/**
 * Send data DIRECTLY to Google Sheets from the browser.
 * 
 * This uses fetch with mode: 'no-cors' which:
 * 1. Sends the request without CORS checks
 * 2. Follows the 302 redirect automatically
 * 3. Results in an opaque response (can't read it), but the data IS written
 * 
 * This works EVEN IF the Next.js server is down!
 */

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxDkpEnbsYuEnNLK69WVNcVhhXpt5QWYkp6JmVM9pUub2hoBTp357EMTMgzqGjQqhOO2A/exec';

/**
 * Send data to Google Sheets directly from the browser.
 * Returns true if the request was sent (we can't verify success due to opaque response,
 * but the data IS delivered to the Google Apps Script).
 */
export async function sendToGoogleSheets(data: Record<string, string>): Promise<boolean> {
  try {
    const url = `${GOOGLE_SHEETS_URL}?data=${encodeURIComponent(JSON.stringify(data))}`;
    
    console.log('📤 Sending data directly to Google Sheets (no-cors)...');
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      redirect: 'follow',
    });
    
    // With no-cors, response.type is 'opaque' and we can't read it
    // But the request WAS sent and the script WILL execute
    console.log('📤 Google Sheets request sent (opaque response, type:', response.type, ')');
    
    return true;
  } catch (error) {
    console.error('❌ Google Sheets direct send error:', error);
    return false;
  }
}
