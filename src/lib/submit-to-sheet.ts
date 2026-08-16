/**
 * Dual-mode Google Sheets submission utility.
 *
 * 1) Tries the Next.js API route first  (/api/enroll or /api/contact)
 *    → works when the site is deployed as a standalone server.
 *
 * 2) Falls back to a direct POST to the Google Apps Script web app
 *    → works even on static-hosted sites (GitHub Pages, Cloudflare, etc.)
 *    → uses mode:'no-cors' so the browser won't block it (simple request
 *       with text/plain content-type = no CORS preflight).
 *    → response is opaque (can't read it), but the data IS delivered.
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDkpEnbsYuEnNLK69WVNcVhhXpt5QWYkp6JmVM9pUub2hoBTp357EMTMgzqGjQqhOO2A/exec';

export type SheetType = 'inscription' | 'contact';

interface SubmitResult {
  ok: boolean;
  source: 'api' | 'direct' | 'none';
  message?: string;
}

/**
 * Submit data to Google Sheets via the API route, then fall back to direct.
 */
export async function submitToSheet(
  apiRoute: '/api/enroll' | '/api/contact',
  type: SheetType,
  payload: Record<string, string>,
): Promise<SubmitResult> {
  // ── Attempt 1: API route (works with standalone server) ──
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(apiRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, source: 'api', message: data.message };
    }
    // API returned non-2xx → fall through to direct
    console.warn(`[sheets] API ${apiRoute} returned ${res.status}, falling back to direct`);
  } catch (err) {
    // Network error / abort → fall through to direct
    console.warn(`[sheets] API ${apiRoute} failed: ${(err as Error).message}, falling back to direct`);
  }

  // ── Attempt 2: Direct POST to Google Apps Script (works on static sites) ──
  try {
    const body = JSON.stringify({ ...payload, type, date: new Date().toISOString() });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      mode: 'no-cors',           // ← simple request, no preflight
      signal: controller.signal,
    });
    clearTimeout(timer);

    // With no-cors the response is opaque — we can't read it,
    // but the data HAS been sent to Google Sheets.
    return { ok: true, source: 'direct' };
  } catch (err) {
    console.error('[sheets] Direct submission failed:', (err as Error).message);
    return { ok: false, source: 'none', message: 'Erreur réseau. Vérifiez votre connexion.' };
  }
}
