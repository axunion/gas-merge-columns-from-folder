// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mergeColumnsFromFolder() {
  const FOLDER_ID = "";
  const TARGET_FILE_ID = "";
  const COLUMN_NUMBERS = [2, 4];
  const START_ROW = 1;

  if (!FOLDER_ID || !TARGET_FILE_ID) {
    throw new Error("Folder ID or file ID is missing.");
  }

  if (COLUMN_NUMBERS.some((column) => column <= 0) || START_ROW <= 0) {
    throw new Error("Column numbers and start row must be 1 or greater.");
  }

  let folder: GoogleAppsScript.Drive.Folder;
  let targetSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

  try {
    folder = DriveApp.getFolderById(FOLDER_ID);
    targetSpreadsheet = SpreadsheetApp.openById(TARGET_FILE_ID);
  } catch (e) {
    SpreadsheetApp.getUi().alert(`Error ${e.message}`);
    return;
  }

  const targetSheet = targetSpreadsheet.getActiveSheet();
  const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);

  let currentRow = START_ROW;
  let totalRowsMerged = 0;

  if (!files.hasNext()) {
    SpreadsheetApp.getUi().alert("No Google Sheets files found in the folder.");
    return;
  }

  while (files.hasNext()) {
    const file = files.next();
    const spreadsheet = SpreadsheetApp.open(file);
    const sheet = spreadsheet.getActiveSheet();

    COLUMN_NUMBERS.forEach((columnNumber) => {
      const data = sheet
        .getRange(
          START_ROW,
          columnNumber,
          sheet.getLastRow() - START_ROW + 1,
          1,
        )
        .getValues();

      targetSheet
        .getRange(currentRow, columnNumber, data.length, 1)
        .setValues(data);
    });

    const rowsMerged = sheet.getLastRow() - START_ROW + 1;
    currentRow += rowsMerged;
    totalRowsMerged += rowsMerged;
  }

  SpreadsheetApp.getUi().alert(
    `Process completed. Total rows merged: ${totalRowsMerged}`,
  );
}
