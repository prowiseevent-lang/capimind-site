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
      console.log('[contact] Google Sheets response:', text.substring(0, 200));
      try {
        const json = JSON.parse(text);
        if (json.success === true) {
          return { ok: true, detail: `Saved to sheet: ${json.sheet || 'unknown'}` };
        }
        return { ok: false, detail: json.error || 'Script returned success=false' };
      } catch {
        return { ok: true, detail: 'Request sent (non-JSON response)' };
      }
    }
    console.error('[contact] Google Sheets HTTP error:', res.status, res.statusText);
    return { ok: false, detail: `HTTP ${res.status}` };
  } catch (err) {
    const msg = (err as Error).message || String(err);
    console.error('[contact] Google Sheets error:', msg);
    return { ok: false, detail: msg };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (nom, email, sujet, message)' },
        { status: 400 }
      );
    }

    // 1) Save to local DB first
    let dbSaved = false;
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
      dbSaved = true;
      console.log('[contact] Saved to local DB');
    } catch (dbErr) {
      console.warn('[contact] Local DB error:', (dbErr as Error).message);
    }

    // 2) Send to Google Sheets (await result)
    const sheetData = {
      type: 'contact',
      name,
      email,
      subject,
      message,
      date: new Date().toISOString(),
      destination: 'contact@capimind.com',
    };

    const sheetResult = await sendToGoogleSheets(sheetData);
    console.log('[contact] Google Sheets result:', sheetResult.ok ? 'SUCCESS' : 'FAILED', '-', sheetResult.detail);

    // 3) Return success
    return NextResponse.json({
      success: true,
      message: 'Bien Reçu ! Votre message a été transmis.',
      sheetStatus: sheetResult.ok ? 'sent' : 'pending',
      dbSaved,
    });
  } catch (error) {
    console.error('[contact] Fatal error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
