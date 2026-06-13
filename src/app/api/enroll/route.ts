import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const GOOGLE_SHEETS_SCRIPT_URL = process.env.GOOGLE_SHEETS_SCRIPT_URL || '';

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

    // Forward to Google Sheets (non-blocking)
    if (GOOGLE_SHEETS_SCRIPT_URL) {
      try {
        const sheetsRes = await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'inscription',
            name: fullName,
            email,
            phone,
            company: company || '',
            course: courseTitle,
            message: message || '',
            date: new Date().toISOString(),
            destination: 'contact@capimind.com',
          }),
        });
        if (sheetsRes.ok) {
          console.log('Enrollment forwarded to Google Sheets successfully');
        } else {
          console.error('Google Sheets forwarding failed:', sheetsRes.status);
        }
      } catch (sheetsError) {
        console.error('Google Sheets forwarding error:', sheetsError);
      }
    } else {
      console.warn('GOOGLE_SHEETS_SCRIPT_URL not configured — skipping Sheets forwarding');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Inscription réussie! Vous recevrez une confirmation à votre email.',
        id: enrollment.id,
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
