import { NextRequest, NextResponse } from 'next/server';
import { Drawing } from '@/model/drawing';
import connectDB from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

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
      drawing_name: formData.get('drawing_name') || 'CustomWear',
      drawing_pic: `data:${file.type};base64,${base64String}`,
      drawing_on: formData.get('drawing_on') || 'canvas',
    });

    return NextResponse.json({
      success: true,
      data: drawing
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const drawings = await Drawing.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    const totalDrawing = await Drawing.countDocuments();

    return NextResponse.json({
      success: true,
      data: drawings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalDrawing / limit),
        totalDrawing,
      }
    })
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      {
        message: 'error fetching the Designs'
      },
      {
        status: 500
      }
    )
  }
}