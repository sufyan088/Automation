const fs = require('fs');
const path = require('path');

function firstNonEmpty(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }

  return '';
}

function buildAlphaSuffix(seed, length = 4) {
  const digits = String(seed || '').replace(/\D/g, '');
  const alphabet = 'abcdefghij';
  const mapped = digits
    .split('')
    .map((digit) => alphabet[Number(digit)] || 'a')
    .join('');

  return (mapped || 'test').slice(-length);
}

function findDefaultCsvFile() {
  const dataDir = path.join(__dirname, '..', '..', 'data', 'source-aiq2');

  if (!fs.existsSync(dataDir)) {
    return path.join(dataDir, 'Digit_Eyes_JS_DPL.csv');
  }

  const csvFiles = fs
    .readdirSync(dataDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.csv'))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  if (!csvFiles.length) {
    return path.join(dataDir, 'Digit_Eyes_JS_DPL.csv');
  }

  return path.join(dataDir, csvFiles[0]);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => String(cell).trim() !== '')) {
        rows.push(row);
      }
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function loadCsvRecord(filePath) {
  const absolutePath = path.resolve(filePath);
  const text = fs.readFileSync(absolutePath, 'utf8');
  const rows = parseCsv(text);

  if (rows.length < 2) {
    throw new Error('CSV file must contain a header row and at least one data row: ' + absolutePath);
  }

  const headers = rows[0];
  const values = rows[1];
  const record = {};

  headers.forEach((header, index) => {
    record[header] = values[index] ?? '';
  });

  return record;
}

function loadCsvRecordSafely(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    return loadCsvRecord(filePath);
  } catch (error) {
    console.log('[DATA] Falling back to environment defaults because CSV parsing failed for ' + filePath + ': ' + error.message);
    return {};
  }
}

function loadRuntimeData() {
  const csvFilePath = process.env.SOURCE_AIQ2_DATA_FILE
    ? path.resolve(process.env.SOURCE_AIQ2_DATA_FILE)
    : findDefaultCsvFile();
  const csvRecord = loadCsvRecordSafely(csvFilePath);
  const uniqueDigits = String(Date.now()).slice(-10);
  const uniqueAlphaSuffix = buildAlphaSuffix(uniqueDigits);

  return {
    ...csvRecord,
    dataFilePath: csvFilePath,
    URL: firstNonEmpty(
      process.env.SOURCE_AIQ2_BASE_URL,
      csvRecord.Camp_Server_URL,
      csvRecord.Camp_Cluster_URL,
      csvRecord.URL,
      csvRecord.BaseUrl,
      'https://dealphacamp.visionspring.org/server.php'
    ),
    Username_Admin: firstNonEmpty(
      process.env.SOURCE_AIQ2_USERNAME,
      csvRecord.Username_Admin,
      csvRecord.Username,
      csvRecord.Email,
      'mammoth2@visionspring.org'
    ),
    Password_Admin: firstNonEmpty(
      process.env.PASSWORD_ADMIN,
      process.env.VISIONSPRING_PASSWORD,
      process.env.SOURCE_AIQ2_PASSWORD,
      csvRecord.Password_Admin,
      csvRecord.Password,
      'Bat69424'
    ),
    CampServerPersonName: firstNonEmpty(
      process.env.SOURCE_AIQ2_PERSON_NAME,
      csvRecord.PersonName,
      'mammoth'
    ),
    campServerParticipantFirstName: firstNonEmpty(
      process.env.SOURCE_AIQ2_PARTICIPANT_FIRST_NAME,
      csvRecord.Participant_Name,
      'Auto' + uniqueAlphaSuffix
    ),
    campServerParticipantLastName: firstNonEmpty(
      process.env.SOURCE_AIQ2_PARTICIPANT_LAST_NAME,
      csvRecord.Participant_Last_Name,
      'Jones'
    ),
    campServerContactNumber: firstNonEmpty(
      process.env.SOURCE_AIQ2_CONTACT_NUMBER,
      csvRecord.Contact_Number,
      '9' + uniqueDigits.slice(-9)
    ),
    campServerFatherName: firstNonEmpty(
      process.env.SOURCE_AIQ2_FATHER_NAME,
      csvRecord.Father_Name,
      'Smith'
    ),
    campServerAddressLine1: firstNonEmpty(
      process.env.SOURCE_AIQ2_ADDRESS_LINE1,
      csvRecord.Address1,
      'test address line 1'
    ),
    campServerAddressLine2: firstNonEmpty(
      process.env.SOURCE_AIQ2_ADDRESS_LINE2,
      csvRecord.Address2,
      'test address line 2'
    ),
    campServerState: firstNonEmpty(
      process.env.SOURCE_AIQ2_STATE,
      csvRecord.State,
      'Delhi'
    ),
    campServerDistrict: firstNonEmpty(
      process.env.SOURCE_AIQ2_DISTRICT,
      csvRecord.District,
      'New Delhi'
    ),
    campServerCity: firstNonEmpty(
      process.env.SOURCE_AIQ2_CITY,
      csvRecord.City,
      'test city'
    ),
    campServerPostalCode: firstNonEmpty(
      process.env.SOURCE_AIQ2_POSTAL_CODE,
      csvRecord.PostalCode,
      '123456'
    ),
    campServerDepartment: firstNonEmpty(
      process.env.SOURCE_AIQ2_DEPARTMENT,
      csvRecord.Department,
      'Administration'
    ),
    campServerAadhaarNumber: firstNonEmpty(
      process.env.SOURCE_AIQ2_AADHAAR,
      csvRecord.Aadhaar_No,
      '123456123456'
    )
  };
}

module.exports = {
  loadRuntimeData
};
