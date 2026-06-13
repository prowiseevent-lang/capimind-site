import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    // Save the enrollment to the database
    // Notification will be automatically sent to contact@capimind.com
    const enrollment = await db.enrollment.create({
      data: {
        fullName,
        email,
        phone,
        company: company || null,
        message: message || null,
        courseId,
        courseTitle,
      },
    });

    console.log('New enrollment saved:', {
      id: enrollment.id,
      fullName,
      email,
      phone,
      courseId,
      courseTitle,
      enrolledAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Inscription réussie! Vous recevrez une confirmation à votre email.',
        id: enrollment.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
