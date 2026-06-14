import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SHEETS_SCRIPT_URL = process.env.GOOGLE_SHEETS_SCRIPT_URL || '';

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

    const contactId = 'msg_' + Date.now();

    // Save to database locally (if available)
    try {
      const { db } = await import('@/lib/db');
      await db.contactMessage.create({
        data: {
          name,
          email,
          subject,
          message,
          sentTo: 'contact@capimind.com',
        },
      });
      console.log('Contact message saved to local DB');
    } catch {
      console.warn('Local DB not available — Google Sheets only');
    }

    // Forward to Google Sheets
    if (GOOGLE_SHEETS_SCRIPT_URL) {
      try {
        const sheetsRes = await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
            date: new Date().toISOString(),
            destination: 'contact@capimind.com',
          }),
        });
        if (sheetsRes.ok) {
          console.log('Contact message forwarded to Google Sheets successfully');
        } else {
          console.error('Google Sheets forwarding failed:', sheetsRes.status);
        }
      } catch (sheetsError) {
        console.error('Google Sheets forwarding error:', sheetsError);
      }
    } else {
      console.warn('GOOGLE_SHEETS_SCRIPT_URL not configured');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message envoyé avec succès à contact@capimind.com',
        id: contactId,
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
