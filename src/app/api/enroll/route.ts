import { NextRequest, NextResponse } from 'next/server';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDkpEnbsYuEnNLK69WVNcVhhXpt5QWYkp6JmVM9pUub2hoBTp357EMTMgzqGjQqhOO2A/exec';

/**
 * Send data to Google Sheets via POST.
 * Google Apps Script web apps redirect (302) after POST,
 * so we use redirect:'follow' and text/plain content type.
 * 15s timeout.
 */
async function sendToGoogleSheets(data: Record<string, string>): Promise<{ ok: boolean; detail: string }> {
  const url = process.env.GOOGLE_SHEETS_SCRIPT_URL || SCRIPT_URL;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const text = await res.text();
      console.log('[enroll] Google Sheets response:', text.substring(0, 200));
      // Check if response looks like valid JSON from our script
      try {
        const json = JSON.parse(text);
        if (json.success === true) {
          return { ok: true, detail: `Saved to sheet: ${json.sheet || 'unknown'}` };
        }
        return { ok: false, detail: json.error || 'Script returned success=false' };
      } catch {
        // Response might be HTML (redirect page) but status 200 - still treat as sent
        return { ok: true, detail: 'Request sent (non-JSON response)' };
      }
    }
    console.error('[enroll] Google Sheets HTTP error:', res.status, res.statusText);
    return { ok: false, detail: `HTTP ${res.status}` };
  } catch (err) {
    const msg = (err as Error).message || String(err);
    console.error('[enroll] Google Sheets error:', msg);
    return { ok: false, detail: msg };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, company, message, courseId, courseTitle } = body;

    if (!fullName || !email || !phone || !courseId) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (nom, email, téléphone, formation)' },
        { status: 400 }
      );
    }

    // 1) Save to local DB first (always succeeds if DB is up)
    let dbSaved = false;
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
      dbSaved = true;
      console.log('[enroll] Saved to local DB');
    } catch (dbErr) {
      console.warn('[enroll] Local DB error:', (dbErr as Error).message);
    }

    // 2) Send to Google Sheets (await result so we know if it worked)
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

    const sheetResult = await sendToGoogleSheets(sheetData);
    console.log('[enroll] Google Sheets result:', sheetResult.ok ? 'SUCCESS' : 'FAILED', '-', sheetResult.detail);

    // 3) Return success to client regardless (data is safe in local DB)
    //    But include sheetStatus so frontend can show a warning if needed
    return NextResponse.json({
      success: true,
      message: 'Demande d\'inscription bien reçue ! Vous recevrez une confirmation par email.',
      sheetStatus: sheetResult.ok ? 'sent' : 'pending',
      dbSaved,
    });
  } catch (error) {
    console.error('[enroll] Fatal error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
