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
    const { fullName, email, phone, company, message, courseId, courseTitle } = body;

    if (!fullName || !email || !phone || !courseId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const enrollmentId = 'enr_' + Date.now();

    // Save to database locally (if available)
    try {
      const { db } = await import('@/lib/db');
      await db.enrollment.create({
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
      console.log('Enrollment saved to local DB');
    } catch {
      console.warn('Local DB not available — Google Sheets only');
    }

    // Forward to Google Sheets in background (don't block the response)
    sendToGoogleSheets({
      type: 'inscription',
      name: fullName,
      email,
      phone,
      company: company || '',
      course: courseTitle,
      message: message || '',
      date: new Date().toISOString(),
      destination: 'contact@capimind.com',
    }).catch((err) => console.error('Background Google Sheets forwarding failed:', err));

    // Respond immediately
    return NextResponse.json(
      {
        success: true,
        message: 'Inscription réussie! Vous recevrez une confirmation à votre email.',
        id: enrollmentId,
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
