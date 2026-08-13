import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SHEETS_SCRIPT_URL = process.env.GOOGLE_SHEETS_SCRIPT_URL || '';

if (!GOOGLE_SHEETS_SCRIPT_URL) {
  console.warn('⚠️ GOOGLE_SHEETS_SCRIPT_URL is not configured. Form data will NOT be sent to Google Sheets.');
}

/**
 * Send data to Google Apps Script Web App.
 * 
 * Google Apps Script web apps use a 302 redirect flow:
 * 1. Request SCRIPT_URL?data=... → 302 redirect to script.googleusercontent.com
 * 2. Follow redirect → script executes with data available in e.parameter
 * 
 * We must include the data in the initial URL so it's part of the
 * execution context that Google creates for the redirect.
 */
async function sendToGoogleSheets(data: Record<string, string>) {
  if (!GOOGLE_SHEETS_SCRIPT_URL) {
    console.warn('⚠️ GOOGLE_SHEETS_SCRIPT_URL not configured — data NOT sent to Google Sheets');
    return false;
  }

  try {
    // Step 1: Request with data in URL, get the redirect location
    const urlWithData = `${GOOGLE_SHEETS_SCRIPT_URL}?data=${encodeURIComponent(JSON.stringify(data))}`;
    
    const redirectRes = await fetch(urlWithData, {
      method: 'GET',
      redirect: 'manual',
    });

    const location = redirectRes.headers.get('location');
    
    if (!location) {
      // No redirect — try reading the response directly
      if (redirectRes.ok) {
        const text = await redirectRes.text();
        console.log('✅ Google Sheets response (no redirect):', text);
        return true;
      }
      console.error('❌ Google Sheets request failed:', redirectRes.status);
      return false;
    }

    // Step 2: Follow the redirect to execute the script
    const execRes = await fetch(location, {
      method: 'GET',
    });

    if (execRes.ok) {
      const text = await execRes.text();
      console.log('✅ Data forwarded to Google Sheets:', text);
      return true;
    } else {
      console.error('❌ Google Sheets execution failed:', execRes.status);
      return false;
    }
  } catch (err) {
    console.error('❌ Google Sheets forwarding error:', err);
    return false;
  }
}

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
    await sendToGoogleSheets({
      type: 'contact',
      name,
      email,
      subject,
      message,
      date: new Date().toISOString(),
      destination: 'contact@capimind.com',
    });

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
