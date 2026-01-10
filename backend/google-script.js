function doPost(e) {
  const ss = SpreadsheetApp.openById("YOUR_SHEET_ID");
  const sheet = ss.getSheetByName("Responses");
  const folder = DriveApp.getFolderById("YOUR_FOLDER_ID");

  const data = e.parameter;
  const files = e.files;

  let fileLinks = [];

  if (files) {
    for (let key in files) {
      const blob = files[key];
      const file = folder.createFile(blob);
      fileLinks.push(file.getUrl());
    }
  }

  sheet.appendRow([
    new Date(),
    data.fullName,
    data.mobile,
    data.email,
    data.aadhaar,
    data.documentType,
    data.serviceType,
    data.fee,
    fileLinks.join(", ")
  ]);

  return ContentService.createTextOutput("Success");
}
