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
  const dataDir = path.join(__dirname, '..', '..', 'data', 'iteration-matrix');
  const sourceDir = path.join(__dirname, '..', '..', 'source-aiq');

  const candidateFiles = [
    path.join(dataDir, 'IM_DPL1.csv'),
    path.join(sourceDir, 'IM_DPL1.csv')
  ];

  const parseableCandidate = candidateFiles.find((candidatePath) => {
    if (!fs.existsSync(candidatePath)) {
      return false;
    }

    try {
      const record = loadCsvRecord(candidatePath);
      return Object.keys(record).length > 0;
    } catch (error) {
      return false;
    }
  });

  if (parseableCandidate) {
    return parseableCandidate;
  }

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
    console.log(`[DATA] Iteration Matrix CSV parsing failed for ${filePath}: ${error.message}`);
    return {};
  }
}

function loadRuntimeData() {
  const csvFilePath = process.env.ITERATION_MATRIX_DATA_FILE
    ? path.resolve(process.env.ITERATION_MATRIX_DATA_FILE)
    : findDefaultCsvFile();
  const csvRecord = loadCsvRecordSafely(csvFilePath);

  const baseUrl = firstNonEmpty(
    process.env.ITERATION_MATRIX_BASE_URL,
    process.env.BASE_URL,
    csvRecord.URL,
    csvRecord.BaseURL
  );
  const username = firstNonEmpty(
    process.env.ITERATION_MATRIX_USERNAME_ADMIN,
    process.env.USERNAME_ADMIN,
    csvRecord.Username_Admin,
    csvRecord.Username,
    csvRecord.Email
  );
  const password = firstNonEmpty(
    process.env.ITERATION_MATRIX_PASSWORD_ADMIN,
    process.env.PASSWORD_ADMIN,
    csvRecord.Password_Admin,
    csvRecord.Password
  );

  return {
    ...csvRecord,
    dataFilePath: csvFilePath,
    URL: baseUrl,
    Username_Admin: username,
    Password_Admin: password
  };
}

module.exports = {
  loadRuntimeData
};