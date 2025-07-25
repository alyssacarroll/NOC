



const DATA_ENTRY_SHEET_NAME = "Sheet1";
const TIME_STAMP_COLUMN_NAME = "Timestamp";
const FOLDER_ID = "NOC";
// secondary file upload
const NUMERIC_LOG_SHEET_NAME = 'DataEntry'; // Sheet name in the message metrics spreadsheet
const DAILY_CHECKS_SPREADSHEET_ID = "1JwpraepmuSFGlhmcv8LwT_L7xVwCDcqi4MU4Rje7NvQ"; // ID of the target spreadsheet for daily checks
// == CONFIGURATION END ==

/**
 * Gets the ID of the Message Metrics spreadsheet.
 * @returns {string} Message Metrics spreadsheet ID
 */
function getMessageMetricsSpreadsheetId() {
  const configSheet = getOrCreateConfigSheet();
  const id = configSheet.getRange('B1').getValue();
  if (!id) throw new Error('No Message Metrics spreadsheet ID set in Config sheet.');
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
    if (!e.postData || !e.postData.contents) {
      throw new Error("No post data received");
    }

    const data = JSON.parse(e.postData.contents);

    // Validate required field checkNumber
    if (!data.checkNumber) {
      throw new Error("Missing checkNumber in payload");
    };
    // ------------- Write to Spreadsheet #1  --------------
    const ss1 = SpreadsheetApp.openById("1SQc0ZZU5j7dwcqYVr56hylA3mKp326Yggz8E3FJXlMc");
    const sheet1 = ss1.getSheetByName("Sheet1"); // Adjust if you use a different sheet name

    // Find row for this checkNumber (assuming column A has check numbers)
    const checkNumStr = data.checkNumber.toString().padStart(2, "0");
    const dataRange = sheet1.getRange("A2:A" + sheet1.getLastRow());
    const values = dataRange.getValues();
    let rowToUpdate = null;
    for (let i = 0; i < values.length; i++) {
      if (values[i][0].toString().padStart(2, "0") === checkNumStr) {
        rowToUpdate = i + 2; // +2 because of header + 1-based indexing
        break;
      }
    }
    if (!rowToUpdate) {
      throw new Error(`Check number ${checkNumStr} not found in Spreadsheet #1`);
    }

    // Prepare data to update (example columns: Completed B, Notes C, Timestamp D)
    sheet1.getRange(rowToUpdate, 2).setValue(data.Completed === "TRUE" || data.Completed === true);
    sheet1.getRange(rowToUpdate, 3).setValue(data.Notes || "");
    sheet1.getRange(rowToUpdate, 4).setValue(new Date());

    // ------------- Write to Spreadsheet #2 (Message Metrics) --------------
    if (data.checkNumberStr === "07") {
      const dataSheet = SpreadsheetApp.openById(getMessageMetricsSpreadsheetId()).getSheetByName(NUMERIC_LOG_SHEET_NAME);
      const now = new Date();
      const monthIndex = now.getMonth();
      const day = now.getDate();

      const monthColMap = {
        0: 2, 1: 8, 2: 14, 3: 20, 4: 26, 5: 32,  // Jan–Jun
        6: 2, 7: 8, 8: 14, 9: 20, 10: 26, 11: 32 // Jul–Dec
      };

      const startCol = monthColMap[monthIndex];
      const startRow = monthIndex < 6 ? 4 : 42; // Jan–Jun → row 4, Jul–Dec → row 42
      const targetRow = startRow + (day - 1);   // Adjust for 1-based days

      dataSheet.getRange(targetRow, startCol).setValue(data["Total Device Count"] || "");
      dataSheet.getRange(targetRow, startCol + 1).setValue(data["Raw Messages"] || "");
      dataSheet.getRange(targetRow, startCol + 2).setValue(data["Unique IMEIs"] || "");
      dataSheet.getRange(targetRow, startCol + 3).setValue(data["Free Disk Space"] || "");
    }


    // -------- Write to Spreadsheet #3 ("NOC Checklist") ---------
    writeToNocChecklist(data);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Success!" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}


// --- Helper functions (include these somewhere in your script) ---

function getOrCreateMonthlySpreadsheet() {
  const SCRIPT_TIMEZONE = "America/New_York";
  const now = new Date();
  const monthName = Utilities.formatDate(now, SCRIPT_TIMEZONE, "MMM yy"); // e.g. "Jul 25"
  const folderIter = DriveApp.getFoldersByName("NOC");
  if (!folderIter.hasNext()) throw new Error("NOC folder not found in Drive");
  const folder = folderIter.next();

  const files = folder.getFilesByName(`NOC Checklist - ${monthName}`);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }

  // Create new monthly spreadsheet if doesn't exist
  const newSs = SpreadsheetApp.create(`NOC Checklist - ${monthName}`);
  folder.addFile(DriveApp.getFileById(newSs.getId()));
  DriveApp.getRootFolder().removeFile(DriveApp.getFileById(newSs.getId())); // Remove from root My Drive
  return newSs;
}

function copyPreviousDaySheet() {
  const spreadsheet = getOrCreateMonthlySpreadsheet();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tz = "America/New_York";
  const todayName = Utilities.formatDate(today, tz, "M/d/yy");
  const yesterdayName = Utilities.formatDate(yesterday, tz, "M/d/yy");

  if (spreadsheet.getSheetByName(todayName)) {
    throw new Error(`Sheet (${todayName}) already exists`);
  }

  const previousSheet = spreadsheet.getSheetByName(yesterdayName);
  if (!previousSheet) throw new Error(`Sheet "${yesterdayName}" not found in "${spreadsheet.getName()}"`);

  const newSheet = previousSheet.copyTo(spreadsheet).activate();
  newSheet.setName(todayName);

  // Reset operator info
  newSheet.getRange("C3").setValue(""); // Operator
  newSheet.getRange("C4").setValue(todayName); // Date

  // Reset checkboxes to FALSE and set description font color blue except for "WAVE" checks
  const range = newSheet.getDataRange();
  const values = range.getValues();
  const numRows = values.length;
  const checkboxCol = 2; // Column B
  const titleCol = 3;    // Column C

  for (let row = 1; row < numRows; row++) {
    const checkboxValue = values[row][checkboxCol - 1];
    const titleText = values[row][titleCol - 1];

    if (typeof checkboxValue === "boolean") {
      const checkboxCell = newSheet.getRange(row + 1, checkboxCol);
      checkboxCell.setValue(false);

      if (typeof titleText === 'string' && titleText.includes("WAVE")) continue;

      const descriptionRow = row + 2;
      if (descriptionRow <= numRows) {
        const descriptionCell = newSheet.getRange(descriptionRow, titleCol);
        descriptionCell.setFontColor("#00a6ffff"); // Set font color to blue
      }
    }
  }
}

function getTimeBlock() {
  const tz = "America/New_York";
  const now = new Date();
  const hour = Number(Utilities.formatDate(now, tz, "H"));
  if (hour >= 0 && hour < 10) return "morning";
  if (hour >= 10 && hour < 14) return "midday";
  if (hour >= 14 && hour < 24) return "endofday";
  return "morning"; // Default to morning if somehow out of range
}

function isCheckInBlock(checkNum, timeBlock) {
  const skipChecks = [2, 7, 13];
  if ((timeBlock === "midday" || timeBlock === "endofday") && skipChecks.includes(checkNum)) {
    return false;
  }
  return true;
}

function resetMiddayChecks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_ENTRY_SHEET_NAME);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];

  const checkCol = headers.indexOf("Check #");
  const statusCol = headers.indexOf("Completed");
  const notesCol = headers.indexOf("Notes");
  const timestampCol = headers.indexOf("Timestamp");

  const skipChecks = ["02", "07", "13"]; // Checks NOT to reset midday

  for (let i = 1; i < values.length; i++) {
    const checkNum = values[i][checkCol].toString().padStart(2, "0");
    if (!skipChecks.includes(checkNum)) {
      sheet.getRange(i + 1, statusCol + 1).setValue(false);   // Reset checkbox
      sheet.getRange(i + 1, notesCol + 1).setValue("");       // Clear notes
      sheet.getRange(i + 1, timestampCol + 1).setValue("");   // Clear timestamp (optional)
    }
  }
}


function findCheckRow(sheet, checkNum, timeBlock) {
  let startRow, endRow;
  if (timeBlock === "morning") {
    startRow = 8;
    endRow = 61;
  } else if (timeBlock === "midday") {
    startRow = 66;
    endRow = 113;
  } else if (timeBlock === "endofday") {
    startRow = 118;
    endRow = 165;
  } else {
    return null;
  }

  const checkNumsRange = sheet.getRange(startRow, 3, endRow - startRow + 1, 1); // column C
  const checkNumsValues = checkNumsRange.getValues();

  for (let i = 0; i < checkNumsValues.length; i++) {
    const val = checkNumsValues[i][0];
    if (val) {
      const match = val.toString().match(/^(\d+)/);
      if (match && Number(match[1]) === checkNum) {
        return startRow + i;
      }
    }
  }
  return null;
}

function writeToNocChecklist(data) {
  const spreadsheet = getOrCreateMonthlySpreadsheet();
  const tz = "America/New_York";
  const todayName = Utilities.formatDate(new Date(), tz, "M/d/yy");

  let sheet = spreadsheet.getSheetByName(todayName);
  if (!sheet) {
    copyPreviousDaySheet();
    sheet = spreadsheet.getSheetByName(todayName);
  }

  // Write operator name and date to C3 & C4
  sheet.getRange("C3").setValue(data.Operator || "Unknown");
  sheet.getRange("C4").setValue(data.Date || Utilities.formatDate(new Date(), tz, "M/d/yy"));

  const timeBlock = getTimeBlock();
  const checkNum = Number(data.checkNumber);
  if (!isCheckInBlock(checkNum, timeBlock)) {
    // Skip logging for this check/timeBlock combo
    return;
  }

  const row = findCheckRow(sheet, checkNum, timeBlock);
  if (!row) throw new Error(`Check number ${checkNum} not found in ${timeBlock} section`);

  // Checkbox in col B, Notes in row+1 col C
  sheet.getRange(row, 2).setValue(data.Completed === "TRUE" || data.Completed === true);


  // Special handling for Check #10 (WAVE Servers)
  if (checkNum === 10) {
    const serverRows = {
      "Fly-216N": row + 2,
      "Fly-220": row + 3,
      "Fly-222": row + 4,
      "Fly-224": row + 5,
      "Fly-226": row + 6,
      "Fly-228": row + 7,
      "Fly-230": row + 8,
      "Fly-232": row + 9,
      "Fly-234": row + 10,
      "Fly-236": row + 11,
      "Fly-238": row + 12,
      "Fly-240": row + 13,
      "Fly-242": row + 14,
      "MED to VPI": row + 15,
      "SA14WAVE511MS": row + 16,
      "WAVE-PRXY12019.ptbportal.us": row + 18,
      "WAVE-PRXY22019.ptbportal.us": row + 19,
      "WAVE-MANMED2019.ptbportal.us": row + 21,
      "EASTERN EUROPE Vocality": row + 23
    };

    const statusCol = 4; // Column D

    for (const [server, targetRow] of Object.entries(serverRows)) {
      const newValue = data[server];
      if (newValue !== undefined) {
        const cell = sheet.getRange(targetRow, statusCol);
        const oldValue = cell.getValue().toString().trim();

        // Only update if value has changed
        if (oldValue !== newValue) {
          cell.setValue(newValue);

          // Append red note after if status is not "TRUE"
          if (newValue !== "TRUE") {

const descCell = sheet.getRange(targetRow, statusCol + 1); // Cell after status
            const oldRichText = descCell.getRichTextValue();
            const oldNote = oldRichText ? oldRichText.getText() : "";
            const datePrefix = Utilities.formatDate(new Date(), tz, "M/d/yy");

const newBullet = `- ${datePrefix} status changed from ${oldValue} to ${newValue}`;

            // Split existing lines and append new one
            const bullets = oldNote ? oldNote.split('\n') : [];
            bullets.push(newBullet);

            // Keep only the last 5 bullets
            const recentBullets = bullets.slice(-5);
            const newNote = recentBullets.join('\n');

            const redStyle = SpreadsheetApp.newTextStyle().setForegroundColor("red").build();
            const blueStyle = SpreadsheetApp.newTextStyle().setForegroundColor("blue").build();

// Build all text as blue
            const builder = SpreadsheetApp.newRichTextValue()
              .setText(newNote)
              .setTextStyle(blueStyle);

// Apply red to the last bullet only
            const redStart = newNote.lastIndexOf(newBullet);
            const redEnd = redStart + newBullet.length;
            builder.setTextStyle(redStart, redEnd, redStyle);
// Set the rich text value in the cell
            descCell.setRichTextValue(builder.build());
          }
        }
      }
    }
    return; // Skip the normal note-logging for this special case
  }
  else if (data.Notes && data.Notes.trim()) {
    const descriptionCell = sheet.getRange(row + 1, 3); // original fallback
    const existingText = descriptionCell.getValue();
    const datePrefix = Utilities.formatDate(new Date(), tz, "M/d/yy");
    const newBullet = `- ${datePrefix}: ${data.Notes.trim()}`;
    const updatedText = existingText ? `${existingText}\n${newBullet}` : newBullet;

    descriptionCell.setValue(updatedText);

    // Style the newly added text in red
    const start = updatedText.length - newBullet.length;
    const end = updatedText.length;
    const redStyle = SpreadsheetApp.newTextStyle().setForegroundColor("red").build();

    const styledText = SpreadsheetApp.newRichTextValue()
      .setText(updatedText)
      .setTextStyle(start, end, redStyle)
      .build();

    descriptionCell.setRichTextValue(styledText);
    // Special handling for Check #07 (Message Check)
    if (checkNum === 7) {
      descriptionCell.setValue(null);
    }
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
 * Resets statuses daily {at midnight} for all checks
 */
function resetDailyStatuses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_ENTRY_SHEET_NAME);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];

  const statusCol = headers.indexOf("Completed");
  const notesCol = headers.indexOf("Notes");
  const timestampCol = headers.indexOf("Timestamp");

  const today = new Date().toLocaleDateString();

  for (let i = 1; i < values.length; i++) {
    const rowTimestamp = new Date(values[i][timestampCol]).toLocaleDateString();

    if (rowTimestamp !== today) {
      sheet.getRange(i + 1, statusCol + 1).setValue("FALSE");
      sheet.getRange(i + 1, notesCol + 1).setValue(""); // clear notes
      sheet.getRange(i + 1, timestampCol + 1).setValue(""); // optional
    }
  }
}