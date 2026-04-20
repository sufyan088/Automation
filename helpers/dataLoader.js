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

function findDefaultCsvFile() {
  const dataDir = path.join(__dirname, '..', 'data');

  if (!fs.existsSync(dataDir)) {
    return path.join(dataDir, 'IM_DPL1.csv');
  }

  const csvFiles = fs
    .readdirSync(dataDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.csv'))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  if (!csvFiles.length) {
    return path.join(dataDir, 'IM_DPL1.csv');
  }

  const preferredFile = csvFiles.find((fileName) => fileName.toLowerCase() === 'im_dpl1.csv');
  return path.join(dataDir, preferredFile || csvFiles[0]);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
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
        i += 1;
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
    throw new Error(`CSV file must contain a header row and at least one data row: ${absolutePath}`);
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
    console.log(`[DATA] Falling back to environment defaults because CSV parsing failed for ${filePath}: ${error.message}`);
    return {};
  }
}

function buildUniqueName(prefix) {
  return `${prefix}-${Date.now()}`;
}

function loadRuntimeData() {
  const csvFilePath = process.env.DATA_FILE
    ? path.resolve(process.env.DATA_FILE)
    : findDefaultCsvFile();
  const csvRecord = loadCsvRecordSafely(csvFilePath);

  const baseUrl = firstNonEmpty(
    process.env.BASE_URL,
    process.env.VISIONSPRING_BASE_URL,
    csvRecord.URL,
    'https://dealphacloud.visionspring.org/'
  );
  const username = firstNonEmpty(
    process.env.USERNAME_ADMIN,
    process.env.VISIONSPRING_USERNAME,
    process.env.VISIONSPRING_EMAIL,
    csvRecord.Username_Admin,
    csvRecord.Email,
    csvRecord.Username,
    'mammoth2@visionspring.org'
  );
  const password = firstNonEmpty(
    process.env.PASSWORD_ADMIN,
    process.env.VISIONSPRING_PASSWORD,
    csvRecord.Password_Admin,
    csvRecord.Password,
    'Bat69424'
  );
  const country = firstNonEmpty(
    process.env.VISIONSPRING_COUNTRY,
    csvRecord.Country,
    'India'
  );
  const payer = firstNonEmpty(
    process.env.VISIONSPRING_PAYER,
    csvRecord.Payer,
    'Aardvark'
  );
  const projectCode = firstNonEmpty(
    process.env.VISIONSPRING_PROJECT_CODE,
    csvRecord.ProjectCode,
    'ADK20XXXXXGLO510XXIA'
  );
  const campNamePrefix = firstNonEmpty(
    process.env.VISIONSPRING_CAMP_NAME_PREFIX,
    csvRecord.CampName,
    'Mammoth12-Camp'
  );

  return {
    ...csvRecord,
    dataFilePath: csvFilePath,
    URL: baseUrl,
    Username_Admin: username,
    Password_Admin: password,
    visionSpringCountry: country,
    visionSpringPayer: payer,
    visionSpringProjectCode: projectCode,
    visionSpringCampName: buildUniqueName(campNamePrefix),
    visionSpringCampNamePrefix: campNamePrefix,
    customerModuleBaseName: process.env.CUSTOMER_MODULE_BASE_NAME || csvRecord.CustomerName || 'CustomerTest',
    customerModuleProgramManager: process.env.CUSTOMER_MODULE_PROGRAM_MANAGER || 'ammy willson',
    customerModuleExistingCustomer: process.env.CUSTOMER_MODULE_EXISTING_CUSTOMER || csvRecord.CustomerName || 'CustomerTest19525268'
  };
}

module.exports = {
  loadRuntimeData
};
