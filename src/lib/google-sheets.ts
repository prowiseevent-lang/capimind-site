/**
 * Send form data directly to Google Sheets via the Apps Script Web App.
 * Works on both the dev server (via API routes) and static sites (GitHub Pages).
 * 
 * On static sites (GitHub Pages), API routes don't exist, so we call
 * the Google Apps Script URL directly from the browser.
 */

const GOOGLE_SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || '';

export type SheetDataType = 'inscription' | 'contact';

interface InscriptionData {
  type: 'inscription';
  name: string;
  email: string;
  phone: string;
  company: string;
  course: string;
  message: string;
  date: string;
  destination: string;
}

interface ContactData {
  type: 'contact';
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  destination: string;
}

type SheetData = InscriptionData | ContactData;

/**
 * Send data to Google Sheets via the Apps Script Web App.
 * Uses GET with data encoded in the URL query parameter.
 * Google Apps Script web apps redirect (302) to script.googleusercontent.com,
 * but the browser follows the redirect automatically.
 */
export async function sendToGoogleSheetsDirect(data: SheetData): Promise<{ success: boolean; message?: string }> {
  if (!GOOGLE_SHEETS_URL) {
    console.warn('⚠️ NEXT_PUBLIC_GOOGLE_SHEETS_URL not configured');
    return { success: false, message: 'Google Sheets not configured' };
  }

  try {
    const url = `${GOOGLE_SHEETS_URL}?data=${encodeURIComponent(JSON.stringify(data))}`;
    
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      mode: 'cors',
    });

    if (res.ok) {
      try {
        const result = await res.json();
        console.log('✅ Google Sheets:', result);
        return { success: true, message: result.message };
      } catch {
        // Response might not be JSON but request succeeded
        return { success: true };
      }
    }

    console.error('❌ Google Sheets request failed:', res.status);
    return { success: false, message: `HTTP ${res.status}` };
  } catch (err) {
    console.error('❌ Google Sheets error:', err);
    return { success: false, message: String(err) };
  }
}
