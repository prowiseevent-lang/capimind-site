import { NextRequest, NextResponse } from 'next/server';

// Hardcoded fallback URL — used if env var is missing
const FALLBACK_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDkpEnbsYuEnNLK69WVNcVhhXpt5QWYkp6JmVM9pUub2hoBTp357EMTMgzqGjQqhOO2A/exec';

function getScriptUrl(): string {
  const envUrl = process.env.GOOGLE_SHEETS_SCRIPT_URL;
  if (envUrl && envUrl.length > 10) {
    console.log('📋 Using GOOGLE_SHEETS_SCRIPT_URL from env');
    return envUrl;
  }
  console.log('📋 Env URL missing/empty — using hardcoded fallback URL');
  return FALLBACK_SCRIPT_URL;
}

/**
 * Send data to Google Apps Script Web App via GET + redirect bypass.
 *
 * Google Apps Script web apps redirect GET requests (302) to
 * script.googleusercontent.com. We must:
 * 1. Send GET with data in URL query param + redirect: 'manual'
 * 2. Read the Location header from the 302 response
 * 3. Follow the redirect manually to execute the script
 */
async function sendToGoogleSheets(data: Record<string, string>): Promise<boolean> {
  const scriptUrl = getScriptUrl();
  console.log('📤 Sending enrollment data to Google Sheets...');

  try {
    // Step 1: Request with data in URL, get the redirect location
    const urlWithData = `${scriptUrl}?data=${encodeURIComponent(JSON.stringify(data))}`;
    console.log('🔗 Request URL (first 200 chars):', urlWithData.substring(0, 200));

    const controller1 = new AbortController();
    const timeout1 = setTimeout(() => controller1.abort(), 15000); // 15s timeout
    const redirectRes = await fetch(urlWithData, {
      method: 'GET',
      redirect: 'manual',
      signal: controller1.signal,
    });
    clearTimeout(timeout1);

    console.log('📡 Redirect response status:', redirectRes.status);
    const location = redirectRes.headers.get('location');
    console.log('📡 Location header:', location ? location.substring(0, 100) + '...' : 'null');

    if (!location) {
      // No redirect — try reading the response directly
      if (redirectRes.ok) {
        const text = await redirectRes.text();
        console.log('✅ Google Sheets response (no redirect):', text.substring(0, 200));
        return true;
      }
      console.error('❌ Google Sheets request failed, no redirect, status:', redirectRes.status);
      return false;
    }

    // Step 2: Follow the redirect to execute the script
    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), 15000); // 15s timeout
    const execRes = await fetch(location, {
      method: 'GET',
      signal: controller2.signal,
    });
    clearTimeout(timeout2);

    console.log('📡 Execution response status:', execRes.status);

    if (execRes.ok) {
      const text = await execRes.text();
      console.log('✅ Data forwarded to Google Sheets:', text.substring(0, 300));
      return true;
    } else {
      const errorText = await execRes.text();
      console.error('❌ Google Sheets execution failed:', execRes.status, errorText.substring(0, 200));
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
      console.log('✅ Enrollment saved to local DB');
    } catch {
      console.warn('⚠️ Local DB not available — Google Sheets only');
    }

    // Forward to Google Sheets in background (don't block the response)
    const sheetData = {
      type: 'inscription',
      name: fullName,
      email,
      phone,
      company: company || '',
      course: courseTitle || '',
      message: message || '',
      date: new Date().toISOString(),
      destination: 'contact@capimind.com',
    };
    console.log('📋 Enrollment data to send:', JSON.stringify(sheetData));

    sendToGoogleSheets(sheetData)
      .then((ok) => console.log(ok ? '✅ Google Sheets forwarding complete' : '❌ Google Sheets forwarding failed'))
      .catch((err) => console.error('❌ Background Google Sheets forwarding error:', err));

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
