import { NextRequest, NextResponse } from 'next/server';
import { Drawing } from '@/model/drawing';
import { User } from '@/model/user';
import connectDB from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Get the authenticated user's ID
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Find the user in the database
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const file = formData.get('drawing_pic') as File;

        if (!file) {
            return NextResponse.json(
                { message: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert to base64
        const base64String = buffer.toString('base64');

        // Create new drawing document
        const drawing = await Drawing.create({
            drawing_pic: `data:${file.type};base64,${base64String}`,
        });

        // Add the drawing to the user's drawing array
        await User.findByIdAndUpdate(
            user._id,
            {
                $push: { drawing: drawing._id }
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            data: drawing,
            message: 'Drawing saved and added to user\'s collection'
        }, { status: 201 });

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { userId } = await auth();
        console.log(userId);
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            )
        }

        const user = await User.findOne({ clerkId: userId })
            .populate({
                path: 'drawing',
                select: 'drawing_pic'
            })

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user.drawing,
            message: 'Drawings retrieved successfully'
        }, { status: 200 });

    } catch (error) {
        NextResponse.json(
            { message: "Internal Server error : ", error },
            { status: 400 }
        )
    }
}