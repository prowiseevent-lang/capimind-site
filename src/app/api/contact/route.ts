import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save the contact message to the database
    // It will be automatically available to contact@capimind.com
    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        sentTo: 'contact@capimind.com',
      },
    });

    console.log('New contact message saved:', {
      id: contactMessage.id,
      name,
      email,
      subject,
      sentTo: 'contact@capimind.com',
      sentAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message envoyé avec succès à contact@capimind.com',
        id: contactMessage.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
