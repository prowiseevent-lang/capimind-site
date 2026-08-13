/**
 * ============================================================
 * GOOGLE APPS SCRIPT - CapiMind Google Sheets Integration
 * ============================================================
 * 
 * Ce script reçoit les données du site CapiMind et les écrit
 * dans le Google Sheet connecté.
 * 
 * Les données sont envoyées via GET avec un paramètre "data"
 * contenant un JSON encodé (pour éviter les problèmes de 
 * redirection POST des Google Apps Script Web Apps).
 * 
 * INSTRUCTIONS:
 * 1. Ouvrez votre Google Sheet
 * 2. Cliquez sur "Extensions" > "Apps Script"
 * 3. Collez tout ce code dans l'éditeur (remplacez tout)
 * 4. Cliquez sur "Déployer" > "Nouvelle deployment" :
 *    - Type : "Application Web"
 *    - Exécuter en tant que : "Moi"
 *    - Qui a accès : "Tout le monde"
 * 5. Copiez l'URL et ajoutez-la dans .env :
 *    GOOGLE_SHEETS_SCRIPT_URL=https://script.google.com/macros/s/XXXXX/exec
 * ============================================================
 */

// Handle GET requests - receives data and writes to sheet
function doGet(e) {
  try {
    // Data comes as JSON encoded in the "data" query parameter
    var dataStr = e.parameter.data;
    
    if (!dataStr) {
      // No data = just a ping/test request
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: 'ok', 
          message: 'CapiMind Google Sheets Integration is active',
          sheetId: SpreadsheetApp.getActiveSpreadsheet().getId()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = JSON.parse(dataStr);
    var result = writeDataToSheet(data);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle POST requests (fallback - may not work due to redirect)
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var result = writeDataToSheet(data);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Core function: writes data to the appropriate sheet
function writeDataToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Determine which sheet to write to based on the type
  var sheetName = data.type === 'inscription' ? 'Inscriptions' : 'Contacts';
  var sheet = ss.getSheetByName(sheetName);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    
    // Add headers based on type
    if (data.type === 'inscription') {
      sheet.appendRow([
        'Date', 'Type', 'Nom complet', 'Email', 'Téléphone', 
        'Entreprise', 'Formation', 'Message', 'Destination'
      ]);
    } else {
      sheet.appendRow([
        'Date', 'Type', 'Nom', 'Email', 'Sujet', 'Message', 'Destination'
      ]);
    }
    
    // Format headers
    var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0d9488');
    headerRange.setFontColor('#ffffff');
  }
  
  // Format date
  var date = data.date ? new Date(data.date) : new Date();
  var formattedDate = Utilities.formatDate(date, 'Africa/Casablanca', 'yyyy-MM-dd HH:mm:ss');
  
  // Append data row based on type
  if (data.type === 'inscription') {
    sheet.appendRow([
      formattedDate,
      data.type || 'inscription',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.company || '',
      data.course || '',
      data.message || '',
      data.destination || 'contact@capimind.com'
    ]);
  } else {
    sheet.appendRow([
      formattedDate,
      data.type || 'contact',
      data.name || '',
      data.email || '',
      data.subject || '',
      data.message || '',
      data.destination || 'contact@capimind.com'
    ]);
  }
  
  // Auto-resize columns
  for (var i = 1; i <= sheet.getLastColumn(); i++) {
    sheet.autoResizeColumn(i);
  }
  
  return {
    success: true,
    message: 'Données enregistrées dans ' + sheetName,
    sheet: sheetName
  };
}
