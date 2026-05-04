const fs = require('fs');
const path = require('path');

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

function loadRuntimeData() {
  const csvRecord = loadCsvRecord(path.join(__dirname, '..', 'data', 'IM_DPL1.csv'));

  return {
    ...csvRecord,
    URL: process.env.BASE_URL || csvRecord.URL,
    Username_Admin: process.env.USERNAME_ADMIN || csvRecord.Username_Admin,
    Password_Admin: process.env.PASSWORD_ADMIN || csvRecord.Password_Admin,
    fileProcessingCustomer: process.env.FILE_PROCESSING_CUSTOMER || 'Verizon Customer',
    fileProcessingSearchId: process.env.FILE_PROCESSING_SEARCH_ID || '953f3dac-c29c-4e2d-b355-7f278e8865aa',
    fileProcessingFilename: process.env.FILE_PROCESSING_FILENAME || 'Stanford_IM_Response_2024-09-03 06:42:39.txt',
    fileProcessingAllEntries: process.env.FILE_PROCESSING_ALL_ENTRIES || 'VeriZonPayment',
    customerModuleBaseName: process.env.CUSTOMER_MODULE_BASE_NAME || csvRecord.CustomerName || 'CustomerTest',
    customerModuleProgramManager: process.env.CUSTOMER_MODULE_PROGRAM_MANAGER || 'ammy willson',
    customerModuleExistingCustomer: process.env.CUSTOMER_MODULE_EXISTING_CUSTOMER || csvRecord.CustomerName || 'CustomerTest19525268'
  };
}

module.exports = {
  loadRuntimeData
};
