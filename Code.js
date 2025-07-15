
const DATA_ENTRY_SHEET_NAME = "Sheet1";
const TIME_STAMP_COLUMN_NAME = "Timestamp";
const FOLDER_ID = "NOC";
// for secondary file upload
const SECOND_SPREADSHEET_ID = "1JwpraepmuSFGlhmcv8LwT_L7xVwCDcqi4MU4Rje7NvQ";
const NUMERIC_LOG_SHEET_NAME = '7/15/25'; // Sheet name in the secondary spreadsheet
// == CONFIGURATION END ==

function doPost(e) {
  try {
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
      const numericSheet = SpreadsheetApp.openById(SECOND_SPREADSHEET_ID).getSheetByName(NUMERIC_LOG_SHEET_NAME);
      const now = new Date();

      numericSheet.appendRow([
        now,
        data["Num 1"] || "",
        data["Num 2"] || "",
        data["Num 3"] || "",
        data["Num 4"] || "",
        data["Notes"] || ""
      ]);
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
