import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SHEETS_SCRIPT_URL = process.env.GOOGLE_SHEETS_SCRIPT_URL || '';

if (!GOOGLE_SHEETS_SCRIPT_URL) {
  console.warn('⚠️ GOOGLE_SHEETS_SCRIPT_URL is not configured. Form data will NOT be sent to Google Sheets.');
}

// Cache the redirect URL to avoid an extra request each time
let cachedRedirectUrl: string | null = null;
let cachedRedirectUrlExpiry = 0;
const REDIRECT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Google Apps Script Web Apps redirect GET/POST requests (302).
 * The redirect URL points to script.googleusercontent.com which is the
 * actual execution endpoint. We need to:
 * 1. Get the redirect URL (once, cached)
 * 2. Append our data as a query parameter to that URL
 * 3. Make the actual request to the redirect URL with data
 */
async function getExecutionUrl(): Promise<string | null> {
  // Return cached URL if still valid
  if (cachedRedirectUrl && Date.now() < cachedRedirectUrlExpiry) {
    return cachedRedirectUrl;
  }

  try {
    const res = await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
      method: 'GET',
      redirect: 'manual',
    });

    const location = res.headers.get('location');
    if (location) {
      cachedRedirectUrl = location;
      cachedRedirectUrlExpiry = Date.now() + REDIRECT_CACHE_TTL;
      return cachedRedirectUrl;
    }

    // No redirect means the URL is already the execution URL
    cachedRedirectUrl = GOOGLE_SHEETS_SCRIPT_URL;
    cachedRedirectUrlExpiry = Date.now() + REDIRECT_CACHE_TTL;
    return cachedRedirectUrl;
  } catch (err) {
    console.error('❌ Failed to get Google Sheets execution URL:', err);
    return null;
  }
}

/**
 * Send data to Google Apps Script by appending it to the execution URL.
 * This bypasses the redirect that would otherwise strip query parameters.
 */
async function sendToGoogleSheets(data: Record<string, string>) {
  if (!GOOGLE_SHEETS_SCRIPT_URL) {
    console.warn('⚠️ GOOGLE_SHEETS_SCRIPT_URL not configured — data NOT sent to Google Sheets');
    return false;
  }

  try {
    const execUrl = await getExecutionUrl();
    if (!execUrl) {
      console.error('❌ Could not resolve Google Sheets execution URL');
      return false;
    }

    // Append data parameter to the execution URL
    const separator = execUrl.includes('?') ? '&' : '?';
    const url = `${execUrl}${separator}data=${encodeURIComponent(JSON.stringify(data))}`;

    const res = await fetch(url, {
      method: 'GET',
    });

    if (res.ok) {
      const text = await res.text();
      console.log('✅ Data forwarded to Google Sheets:', text);
      return true;
    } else {
      console.error('❌ Google Sheets forwarding failed:', res.status);
      // Invalidate cache on error
      cachedRedirectUrl = null;
      return false;
    }
  } catch (err) {
    console.error('❌ Google Sheets forwarding error:', err);
    cachedRedirectUrl = null;
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

    // Forward to Google Sheets
    await sendToGoogleSheets({
      type: 'inscription',
      name: fullName,
      email,
      phone,
      company: company || '',
      course: courseTitle,
      message: message || '',
      date: new Date().toISOString(),
      destination: 'contact@capimind.com',
    });

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
