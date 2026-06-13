import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, company, message, courseId, courseTitle } = body;

    if (!fullName || !email || !phone || !courseId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, you would save this to a database
    // and send a confirmation email
    console.log('New enrollment:', {
      fullName,
      email,
      phone,
      company,
      message,
      courseId,
      courseTitle,
      enrolledAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: 'Enrollment successful' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
