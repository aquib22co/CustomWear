import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { User } from '@/model/user'; // Your MongoDB model
import connectDB from '@/lib/db'; // MongoDB connection utility

export async function POST(req: NextRequest) {
    try {
        const { sessionId } = await req.json(); // Get the sessionId from the request body

        // Ensure sessionId is provided
        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        // Connect to MongoDB
        await connectDB();

        // Verify the session and fetch user data from Clerk
        const session = await clerkClient.sessions.getSession(sessionId);
        const userId = session.userId;

        // Check if the user is logged in
        if (!userId) {
            return NextResponse.json({ error: 'User is not logged in' }, { status: 401 });
        }

        const userData = await clerkClient.users.getUser(userId);
        const email = userData.emailAddresses[0].emailAddress;

        // Check if the user already exists in MongoDB
        let user = await User.findOne({ clerkId: userId });

        if (user) {
            // If the user already exists, return a success message
            return NextResponse.json({ message: 'User already exists in the database' }, { status: 200 });
        }

        console.log(`Creating a new user: ${userId} , with email: ${email}`);

        // If the user doesn't exist, create a new user
        user = new User({
            clerkId: userId,
            username: userData.fullName,
            email: email,
        });

        await user.save();

        return NextResponse.json({ message: 'User successfully created and saved' }, { status: 201 });
    } catch (error) {
        console.log('Error during Clerk authentication:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
