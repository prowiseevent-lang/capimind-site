/**
 * ============================================================
 * GOOGLE APPS SCRIPT - CapiMind CRM Integration v3
 * ============================================================
 * 
 * ⚠️ INSTRUCTIONS DE DÉPLOIEMENT (IMPORTANT!) ⚠️
 * 
 * 1. Ouvrez votre Google Sheet :
 *    https://docs.google.com/spreadsheets/d/1kfrMKBmdTmcVhskgGn69CdcShsv07-L_7xCKEH-JxjI/edit
 * 
 * 2. Cliquez sur "Extensions" > "Apps Script"
 * 
 * 3. Supprimez TOUT le code existant dans l'éditeur
 * 
 * 4. Collez TOUT ce code à la place
 * 
 * 5. Cliquez sur "Déployer" > "Nouvelle deployment" :
 *    - Type : "Application Web"
 *    - Exécuter en tant que : "Moi" (VOTRE compte Google)
 *    - Qui a accès : "Tout le monde"
 * 
 * 6. Cliquez sur "Déployer"
 * 
 * 7. Copiez l'URL du Web App (elle ressemble à :
 *    https://script.google.com/macros/s/AKfycb.../exec)
 * 
 * 8. Envoyez-moi cette URL pour que je puisse la configurer
 * 
 * ⚠️ Si vous aviez une ancienne deployment, elle peut être 
 *    EXPIRÉE. Créez TOUJOURS une NOUVELLE deployment.
 * ⚠️ Ne mettez PAS à jour une deployment existante - 
 *    créez-en une NOUVELLE à chaque fois.
 * ============================================================
 */

var SPREADSHEET_ID = '1kfrMKBmdTmcVhskgGn69CdcShsv07-L_7xCKEH-JxjI';

// ===== TRAITEMENT DES REQUÊTES GET =====
function doGet(e) {
  try {
    // Test de connectivité (sans paramètres)
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'ok', 
        version: 'v3',
        message: 'CapiMind CRM Integration active',
        spreadsheet: ss.getName(),
        sheets: ss.getSheets().map(function(s) { return s.getName(); })
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

// ===== TRAITEMENT DES REQUÊTES POST =====
function doPost(e) {
  try {
    // Extraire les données du POST body
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else {
      throw new Error('Aucune donnée reçue');
    }
    
    // Écrire dans le sheet
    var result = writeDataToSheet(data);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString(),
        stack: error.stack ? error.stack.toString() : ''
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== FONCTION PRINCIPALE : ÉCRITURE DANS LE SHEET =====
function writeDataToSheet(data) {
  // Ouvrir le spreadsheet par ID explicite
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Déterminer le sheet cible selon le type
  var sheetName = data.type === 'inscription' ? 'Inscriptions' : 'Contacts';
  var sheet = ss.getSheetByName(sheetName);
  
  // Créer le sheet s'il n'existe pas
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  // Vérifier si les en-têtes existent (ligne 1)
  var hasHeaders = sheet.getRange(1, 1).getValue() !== '';
  
  if (!hasHeaders) {
    // Ajouter les en-têtes selon le type
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
    
    // Formater les en-têtes (teal + blanc gras)
    var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0d9488');
    headerRange.setFontColor('#ffffff');
  }
  
  // Formater la date
  var date = data.date ? new Date(data.date) : new Date();
  var formattedDate = Utilities.formatDate(date, 'Africa/Casablanca', 'yyyy-MM-dd HH:mm:ss');
  
  // Construire la ligne de données
  var rowData;
  if (data.type === 'inscription') {
    rowData = [
      formattedDate,
      'inscription',
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
      'contact',
      data.name || '',
      data.email || '',
      data.subject || '',
      data.message || '',
      data.destination || 'contact@capimind.com'
    ];
  }
  
  // Ajouter la ligne
  sheet.appendRow(rowData);
  
  // Forcer l'écriture immédiate
  SpreadsheetApp.flush();
  
  // Vérifier l'écriture
  var lastRow = sheet.getLastRow();
  var writtenData = sheet.getRange(lastRow, 1, 1, rowData.length).getValues()[0];
  
  return {
    success: true,
    message: 'Données enregistrées dans ' + sheetName,
    sheet: sheetName,
    row: lastRow,
    verified: writtenData[0] === formattedDate,
    spreadsheetId: SPREADSHEET_ID
  };
}
