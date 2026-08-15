/**
 * Send data directly to Google Sheets via hidden iframe form submission.
 * This bypasses CORS entirely and doesn't depend on the Next.js API server.
 * 
 * Google Apps Script Web Apps redirect GET requests (302), which is handled
 * seamlessly by the browser for form submissions targeting an iframe.
 */

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxDkpEnbsYuEnNLK69WVNcVhhXpt5QWYkp6JmVM9pUub2hoBTp357EMTMgzqGjQqhOO2A/exec';

// Reuse a single hidden iframe
let iframe: HTMLIFrameElement | null = null;
function getIframe(): HTMLIFrameElement {
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.name = 'sheets-submit-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
  return iframe;
}

/**
 * Send data to Google Sheets using a hidden iframe form submission.
 * This is CORS-free and works even if the Next.js server is down.
 */
export function sendToGoogleSheets(data: Record<string, string>): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const frame = getIframe();
      
      // Create a temporary form
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = GOOGLE_SHEETS_URL;
      form.target = frame.name;
      
      // Add the data as a single JSON-encoded field
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'data';
      input.value = JSON.stringify(data);
      form.appendChild(input);
      
      document.body.appendChild(form);
      
      // Submit the form - the browser handles the 302 redirect automatically
      form.submit();
      
      // Clean up the form after a short delay
      setTimeout(() => {
        document.body.removeChild(form);
      }, 1000);
      
      // Resolve true - we can't read the iframe response due to cross-origin,
      // but the data IS being sent to Google Sheets
      setTimeout(() => resolve(true), 500);
    } catch (error) {
      console.error('Google Sheets submission error:', error);
      resolve(false);
    }
  });
}
