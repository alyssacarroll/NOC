const DATA_ENTRY_SHEET_NAME = "Sheet1";
const TIME_STAMP_COLUMN_NAME = "Timestamp";
const FOLDER_ID = "NOC";
// secondary file upload
const NUMERIC_LOG_SHEET_NAME = 'DataEntry'; // Sheet name in the secondary spreadsheet
// == CONFIGURATION END ==

/**
 * Gets the ID of the secondary spreadsheet.
 * @returns {string} Secondary spreadsheet ID
 */
function getSecondarySpreadsheetId() {
  const configSheet = getOrCreateConfigSheet();
  const id = configSheet.getRange('B1').getValue();
  if (!id) throw new Error('No secondary spreadsheet ID set in Config sheet.');
  return id;
}

function getOrCreateConfigSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Config');
  if (!sheet) {
    sheet = ss.insertSheet('Config');
    sheet.getRange('A1').setValue('Secondary Spreadsheet ID');
  }
  return sheet;
}

function doPost(e) {
  try {
    if (e.parameter && e.parameter.action === 'saveSpreadsheetId') {
      const data = JSON.parse(e.postData.contents);
      const newId = data.newId;
      if (!newId) throw new Error("Missing spreadsheet ID.");

      const configSheet = getOrCreateConfigSheet();
      configSheet.getRange('B1').setValue(newId);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "ID saved." }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);
    const checkNumber = data.checkNumber;

    if (!checkNumber) throw new Error("Missing check number.");

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const checkNumberCol = headers.indexOf("Check #") + 1;
    if (checkNumberCol === 0) throw new Error("'Check #' column not found.");

    const lastRow = sheet.getLastRow();
    const checkNumbers = sheet.getRange(2, checkNumberCol, lastRow - 1).getValues();

    let targetRow = -1;
    for (let i = 0; i < checkNumbers.length; i++) {
      if (checkNumbers[i][0] == checkNumber) {
        targetRow = i + 2; // Adjusted for header
        break;
      }
    }

    if (targetRow === -1) throw new Error(`Check number ${checkNumber} not found.`);

    // Update main sheet row
    for (let key in data) {
      const colIndex = headers.indexOf(key);
      if (colIndex >= 0) {
        sheet.getRange(targetRow, colIndex + 1).setValue(data[key]);
      }
    }

    // Special handling for Check 07: append numeric data to second sheet
    if (checkNumber === '07') {
      const dataSheet = SpreadsheetApp.openById(getSecondarySpreadsheetId()).getSheetByName(NUMERIC_LOG_SHEET_NAME);
      const now = new Date();
      const monthIndex = now.getMonth(); // 0 = Jan, ..., 11 = Dec
      const day = now.getDate(); // 1–31

      // Fixed month-to-column mappings (start columns of each 5-col group)
      const monthColMap = {
        0: 2, 1: 8, 2: 14, 3: 20,  4: 26,  5: 32,  // Jan (B) - Jun (AF)
        6: 2, 7: 8, 8: 14, 9: 20, 10: 26, 11: 32   // Jul (B) - Dec (AF)
      };

      const startCol = monthColMap[monthIndex];
      const startRow = monthIndex < 6 ? 4 : 42; // Jan–Jun → row 4, Jul–Dec → row 42

      const targetRow = startRow + (day - 1); // Adjust for the 1-based day

      dataSheet.getRange(targetRow, startCol)    .setValue(data["Total Device Count"] || "");
      dataSheet.getRange(targetRow, startCol + 1).setValue(data["Raw Messages"]       || "");
      dataSheet.getRange(targetRow, startCol + 2).setValue(data["Unique IMEIs"]       || "");
      dataSheet.getRange(targetRow, startCol + 3).setValue(data["Free Disk Space"]    || "");
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Saves a file to Google Drive
 */
function saveFile(fileData) {
  try {
    const blob = Utilities.newBlob(
      Utilities.base64Decode(fileData.data),
      fileData.mimeType,
      fileData.fileName
    );
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return {
      url: `https://drive.google.com/uc?export=view&id=${file.getId()}`,
      name: fileData.fileName,
    };
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("Failed to upload file: " + error.toString());
  }
}

/**
 * Appends data to the Google Sheet
 */
function appendToGoogleSheet(data, sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // If sheet is empty, create headers
  if (headers.length === 0 || headers[0] === "") {
    const newHeaders = Object.keys(data);
    sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    headers = newHeaders;
  }

  // Map data to header columns
  const rowData = headers.map((header) => data[header] || "");
  sheet.appendRow(rowData);
}

/**
 * Resets daily statuses for specific checks
 */
function resetDailyStatuses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_ENTRY_SHEET_NAME);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];

  const checkCol = headers.indexOf("Check #");
  const statusCol = headers.indexOf("Completed");
  const notesCol = headers.indexOf("Notes");
  const timestampCol = headers.indexOf("Timestamp");

  const today = new Date().toLocaleDateString();

  for (let i = 1; i < values.length; i++) {
    const rowTimestamp = new Date(values[i][timestampCol]).toLocaleDateString();
    const checkNum = values[i][checkCol];

    // Only reset specific checks, e.g., 01, 03, 07
    const checksToReset = ["01", "03", "07"];
    if (!checksToReset.includes(checkNum)) continue;

    if (rowTimestamp !== today) {
      sheet.getRange(i + 1, statusCol + 1).setValue("FALSE");
      sheet.getRange(i + 1, notesCol + 1).setValue(""); // clear notes
      sheet.getRange(i + 1, timestampCol + 1).setValue(""); // optional
    }
  }
}