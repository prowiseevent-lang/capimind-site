/**
 * ============================================================
 * GOOGLE APPS SCRIPT - CapiMind Google Sheets Integration
 * ============================================================
 * 
 * INSTRUCTIONS:
 * 1. Ouvrez votre Google Sheet : 
 *    https://docs.google.com/spreadsheets/d/1Tc6VFwIfbI3Q_Y-aBLhUtgCQl1DJnovRWdmJ0F9zdoA/edit
 * 
 * 2. Cliquez sur "Extensions" > "Apps Script> 
 * 
 * 3. Collez tout ce code dans l'éditeur (remplacez le contenu existant)
 * 
 * 4. Cliquez sur "Déployer" > "Nouvelle deployment> :
 *    - Type : "Application Web"
 *    - Exécuter en tant que : "Moi"
 *    - Qui a accès : "Tout le monde"
 *    - Cliquez sur "Déployer"
 * 
 * 5. Copiez l'URL de l'application web (elle ressemble à :
 *    https://script.google.com/macros/s/XXXXX/exec)
 * 
 * 6. Ajoutez cette URL dans le fichier .env du projet :
 *    GOOGLE_SHEETS_SCRIPT_URL=https://script.google.com/macros/s/XXXXX/exec
 * 
 * ============================================================
 */

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'ok', 
      message: 'CapiMind Google Sheets Integration is active',
      sheetId: SpreadsheetApp.getActiveSpreadsheet().getId()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle POST requests (form submissions)
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
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
          'Date', 
          'Type', 
          'Nom complet', 
          'Email', 
          'Téléphone', 
          'Entreprise', 
          'Formation', 
          'Message',
          'Destination'
        ]);
      } else {
        sheet.appendRow([
          'Date', 
          'Type', 
          'Nom', 
          'Email', 
          'Sujet', 
          'Message',
          'Destination'
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
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Données enregistrées dans ' + sheetName,
        sheet: sheetName
      }))
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
