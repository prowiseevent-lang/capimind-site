/**
 * ============================================================
 * GOOGLE APPS SCRIPT - CapiMind Google Sheets Integration
 * ============================================================
 * 
 * VERSION 2 - Corrigé et robuste
 * 
 * Ce script reçoit les données du site CapiMind et les écrit
 * dans le Google Sheet CapiMind - CRM.
 * 
 * IMPORTANT: Ce script utilise l'ID EXPLICITE du spreadsheet
 * au lieu de getActiveSpreadsheet() pour garantir que les
 * données arrivent dans le bon fichier.
 * 
 * INSTRUCTIONS:
 * 1. Ouvrez votre Google Sheet: https://docs.google.com/spreadsheets/d/1Tc6VFwIfbI3Q_Y-aBLhUtgCQl1DJnovRWdmJ0F9zdoA/edit
 * 2. Cliquez sur "Extensions" > "Apps Script"
 * 3. Collez TOUT ce code dans l'éditeur (remplacez tout ce qui existe)
 * 4. Cliquez sur "Déployer" > "Nouvelle deployment" :
 *    - Type : "Application Web"
 *    - Exécuter en tant que : "Moi" (VOTRE compte Google)
 *    - Qui a accès : "Tout le monde"
 * 5. Copiez la nouvelle URL et envoyez-la moi
 * ============================================================
 */

// ID EXPLICITE du spreadsheet CapiMind - CRM
var SPREADSHEET_ID = '1Tc6VFwIfbI3Q_Y-aBLhUtgCQl1DJnovRWdmJ0F9zdoA';

// Handle GET requests
function doGet(e) {
  try {
    var dataStr = e.parameter.data;
    
    if (!dataStr) {
      // Ping/test - returns sheet info
      var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: 'ok', 
          message: 'CapiMind CRM Integration v2 active',
          sheetId: SPREADSHEET_ID,
          sheetName: ss.getName(),
          sheets: ss.getSheets().map(function(s) { return s.getName(); })
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
        error: error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle POST requests
function doPost(e) {
  try {
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else {
      throw new Error('No data received');
    }
    
    var result = writeDataToSheet(data);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Core function: writes data to the appropriate sheet
function writeDataToSheet(data) {
  // Open the spreadsheet by EXPLICIT ID (not getActive which can be wrong)
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Determine which sheet to write to based on the type
  var sheetName = data.type === 'inscription' ? 'Inscriptions' : 'Contacts';
  var sheet = ss.getSheetByName(sheetName);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  // Check if headers exist (row 1 should have content)
  var hasHeaders = sheet.getRange(1, 1).getValue() !== '';
  
  if (!hasHeaders) {
    // Add headers based on type
    if (data.type === 'inscription') {
      sheet.getRange(1, 1, 1, 9).setValues([[
        'Date', 'Type', 'Nom complet', 'Email', 'Téléphone', 
        'Entreprise', 'Formation', 'Message', 'Destination'
      ]]);
    } else {
      sheet.getRange(1, 1, 1, 7).setValues([[
        'Date', 'Type', 'Nom', 'Email', 'Sujet', 'Message', 'Destination'
      ]]);
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
  
  // Build row data
  var rowData;
  if (data.type === 'inscription') {
    rowData = [
      formattedDate,
      data.type || 'inscription',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.company || '',
      data.course || '',
      data.message || '',
      data.destination || 'contact@capimind.com'
    ];
  } else {
    rowData = [
      formattedDate,
      data.type || 'contact',
      data.name || '',
      data.email || '',
      data.subject || '',
      data.message || '',
      data.destination || 'contact@capimind.com'
    ];
  }
  
  // Append the row
  sheet.appendRow(rowData);
  
  // CRITICAL: Force flush to ensure data is written immediately
  SpreadsheetApp.flush();
  
  // Verify the write by reading back the last row
  var lastRow = sheet.getLastRow();
  var writtenData = sheet.getRange(lastRow, 1, 1, rowData.length).getValues()[0];
  
  return {
    success: true,
    message: 'Enregistré dans ' + sheetName,
    sheet: sheetName,
    row: lastRow,
    verified: writtenData[0] === formattedDate,
    spreadsheetId: SPREADSHEET_ID
  };
}
