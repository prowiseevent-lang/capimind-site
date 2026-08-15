import { NextRequest, NextResponse } from 'next/server';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDkpEnbsYuEnNLK69WVNcVhhXpt5QWYkp6JmVM9pUub2hoBTp357EMTMgzqGjQqhOO2A/exec';

/**
 * Send data to Google Sheets via simple POST.
 * Uses redirect:'follow' (default) so fetch handles the 302 automatically.
 * 5s timeout to keep the server lightweight.
 */
async function sendToGoogleSheets(data: Record<string, string>): Promise<boolean> {
  const url = process.env.GOOGLE_SHEETS_SCRIPT_URL || SCRIPT_URL;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

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
      console.log('✅ Google Sheets OK:', text.substring(0, 150));
      return true;
    }
    console.error('❌ Google Sheets status:', res.status);
    return false;
  } catch (err) {
    console.error('❌ Google Sheets error:', (err as Error).message || err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    // Save to local DB (best-effort)
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
      console.log('✅ Contact sauvegardé en DB locale');
    } catch {
      console.warn('⚠️ DB locale indisponible');
    }

    // Forward to Google Sheets in background — don't block the response
    const sheetData = {
      type: 'contact',
      name,
      email,
      subject,
      message,
      date: new Date().toISOString(),
      destination: 'contact@capimind.com',
    };

    sendToGoogleSheets(sheetData)
      .then(ok => console.log(ok ? '✅ Google Sheets: contact envoyé' : '❌ Google Sheets: échec'))
      .catch(() => console.error('❌ Google Sheets: erreur'));

    // Respond immediately — client doesn't wait for Google Sheets
    return NextResponse.json({
      success: true,
      message: 'Bien Reçu ! Votre message a été transmis.',
    });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
