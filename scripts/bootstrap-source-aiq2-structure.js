const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(repoRoot, 'source-aiq2');
const testScriptsRoot = path.join(sourceRoot, 'Test Scripts');
const testsRoot = path.join(repoRoot, 'tests', 'DigitEYESCamp_Server');
const helpersRoot = path.join(repoRoot, 'helpers', 'source-aiq2');
const selectorsRoot = path.join(repoRoot, 'selectors', 'source-aiq2');
const dataRoot = path.join(repoRoot, 'data', 'source-aiq2');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) {
    return false;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function copyIfMissing(sourcePath, destinationPath) {
  if (fs.existsSync(destinationPath)) {
    return false;
  }

  fs.copyFileSync(sourcePath, destinationPath);
  return true;
}

function toSafeSegment(value) {
  return String(value || '')
    .replace(/\.ds$/i, '')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

function toCamelCase(value) {
  const parts = toSafeSegment(value).split('_').filter(Boolean);
  return parts
    .map((part, index) => {
      const normalized = part.toLowerCase();
      if (index === 0) {
        return normalized;
      }

      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    })
    .join('');
}

function normalizeRelative(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function toRequirePath(fromDir, targetPath) {
  let relativePath = path.relative(fromDir, targetPath).split(path.sep).join('/');
  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`;
  }
  return relativePath.replace(/\.js$/i, '');
}

function findLeafModuleDirectories(currentDir, collected = []) {
  const entries = fs
    .readdirSync(currentDir, { withFileTypes: true })
    .filter((entry) => entry.name !== '.gitkeep');

  const dsFiles = entries.filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.ds'));
  if (dsFiles.length) {
    collected.push({
      dirPath: currentDir,
      sourceFiles: dsFiles
        .map((entry) => path.join(currentDir, entry.name))
        .sort((left, right) => left.localeCompare(right))
    });
    return collected;
  }

  entries
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name))
    .forEach((entry) => {
      findLeafModuleDirectories(path.join(currentDir, entry.name), collected);
    });

  return collected;
}

function getModuleInfo(dirPath) {
  const relativeParts = path.relative(testScriptsRoot, dirPath).split(path.sep).filter(Boolean);
  const moduleParts = relativeParts[0] === 'Camp Server' ? relativeParts.slice(1) : relativeParts;
  const moduleName = moduleParts.map(toSafeSegment).join('_');
  const fileStem = toCamelCase(moduleName);

  return {
    moduleName,
    helperFileName: `${fileStem}.js`,
    selectorFileName: `${fileStem}.selectors.js`,
    helperExportName: `${fileStem}Helpers`,
    selectorExportName: `${fileStem}Selectors`
  };
}

function buildTrackDataLoaderTemplate() {
  return `const fs = require('fs');
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

    if ((char === '\\n' || char === '\\r') && !inQuotes) {
      if (char === '\\r' && next === '\\n') {
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

  return {
    ...csvRecord,
    dataFilePath: csvFilePath,
    URL: firstNonEmpty(
      process.env.SOURCE_AIQ2_BASE_URL,
      csvRecord.URL,
      csvRecord.BaseUrl,
      ''
    ),
    Username_Admin: firstNonEmpty(
      process.env.SOURCE_AIQ2_USERNAME,
      csvRecord.Username_Admin,
      csvRecord.Username,
      ''
    ),
    Password_Admin: firstNonEmpty(
      process.env.SOURCE_AIQ2_PASSWORD,
      csvRecord.Password_Admin,
      csvRecord.Password,
      ''
    )
  };
}

module.exports = {
  loadRuntimeData
};
`;
}

function buildTrackAuthTemplate() {
  return `async function loginAsAdmin(page, data) {
  if (!data.URL) {
    throw new Error('Missing source-aiq2 base URL. Set SOURCE_AIQ2_BASE_URL or provide URL in data/source-aiq2/*.csv before running Camp Server tests.');
  }

  await page.goto(data.URL);
}

async function logout(page) {
  return page;
}

module.exports = {
  loginAsAdmin,
  logout
};
`;
}

function buildSharedTemplate(moduleInfo, moduleDir, helperPath, selectorPath, dataLoaderPath, authPath, allurePath) {
  return `const { test } = require('@playwright/test');
const { loadRuntimeData } = require('${toRequirePath(moduleDir, dataLoaderPath)}');
const { loginAsAdmin } = require('${toRequirePath(moduleDir, authPath)}');
const { registerModuleSuite } = require('${toRequirePath(moduleDir, allurePath)}');
const { ${moduleInfo.helperExportName} } = require('${toRequirePath(moduleDir, helperPath)}');
const { ${moduleInfo.selectorExportName} } = require('${toRequirePath(moduleDir, selectorPath)}');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  ${moduleInfo.helperExportName},
  ${moduleInfo.selectorExportName}
};
`;
}

function buildHelperTemplate(moduleInfo) {
  return `const ${moduleInfo.selectorExportName} = {};

async function openModule(page) {
  return page;
}

module.exports = {
  ${moduleInfo.helperExportName}: {
    openModule,
    selectors: ${moduleInfo.selectorExportName}
  }
};
`;
}

function buildSelectorTemplate(moduleInfo) {
  return `const ${moduleInfo.selectorExportName} = {};

module.exports = {
  ${moduleInfo.selectorExportName}
};
`;
}

function buildSpecTemplate(sourceFilePath) {
  const sourceRelativePath = normalizeRelative(sourceFilePath);
  const sourceName = path.basename(sourceFilePath, '.ds');

  return `const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession
} = require('./_shared');

test(${JSON.stringify(sourceName)}, async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: ${JSON.stringify(sourceRelativePath)}
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
`;
}

function copyCsvFiles() {
  ensureDir(dataRoot);

  const copiedFiles = [];
  const sourceCsvFiles = fs
    .readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.csv'))
    .map((entry) => path.join(sourceRoot, entry.name))
    .sort((left, right) => left.localeCompare(right));

  sourceCsvFiles.forEach((sourcePath) => {
    const destinationPath = path.join(dataRoot, path.basename(sourcePath));
    if (copyIfMissing(sourcePath, destinationPath)) {
      copiedFiles.push(normalizeRelative(destinationPath));
    }
  });

  return copiedFiles;
}

function ensureTrackCommonFiles() {
  ensureDir(helpersRoot);
  ensureDir(selectorsRoot);
  ensureDir(dataRoot);

  const createdFiles = [];
  const dataLoaderPath = path.join(helpersRoot, 'dataLoader.js');
  const authPath = path.join(helpersRoot, 'auth.js');

  if (writeIfMissing(dataLoaderPath, buildTrackDataLoaderTemplate())) {
    createdFiles.push(normalizeRelative(dataLoaderPath));
  }

  if (writeIfMissing(authPath, buildTrackAuthTemplate())) {
    createdFiles.push(normalizeRelative(authPath));
  }

  return createdFiles;
}

function main() {
  if (!fs.existsSync(testScriptsRoot)) {
    throw new Error(`Missing AIQ test script root: ${testScriptsRoot}`);
  }

  ensureDir(testsRoot);
  const createdCommonFiles = ensureTrackCommonFiles();

  const createdModules = [];
  const createdHelpers = [];
  const createdSelectors = [];
  const createdSpecs = [];

  const dataLoaderPath = path.join(helpersRoot, 'dataLoader.js');
  const authPath = path.join(helpersRoot, 'auth.js');
  const allurePath = path.join(repoRoot, 'helpers', 'allureHierarchy.js');

  findLeafModuleDirectories(testScriptsRoot).forEach(({ dirPath, sourceFiles }) => {
    const moduleInfo = getModuleInfo(dirPath);
    const moduleDir = path.join(testsRoot, moduleInfo.moduleName);
    ensureDir(moduleDir);
    createdModules.push(normalizeRelative(moduleDir));

    const helperPath = path.join(helpersRoot, moduleInfo.helperFileName);
    const selectorPath = path.join(selectorsRoot, moduleInfo.selectorFileName);

    writeIfMissing(
      path.join(moduleDir, '_shared.js'),
      buildSharedTemplate(moduleInfo, moduleDir, helperPath, selectorPath, dataLoaderPath, authPath, allurePath)
    );

    if (writeIfMissing(helperPath, buildHelperTemplate(moduleInfo))) {
      createdHelpers.push(normalizeRelative(helperPath));
    }

    if (writeIfMissing(selectorPath, buildSelectorTemplate(moduleInfo))) {
      createdSelectors.push(normalizeRelative(selectorPath));
    }

    sourceFiles.forEach((sourceFilePath) => {
      const specName = `${toSafeSegment(path.basename(sourceFilePath, '.ds'))}.spec.js`;
      const specPath = path.join(moduleDir, specName);
      if (writeIfMissing(specPath, buildSpecTemplate(sourceFilePath))) {
        createdSpecs.push(normalizeRelative(specPath));
      }
    });
  });

  const copiedCsvFiles = copyCsvFiles();

  console.log(JSON.stringify({
    commonFiles: createdCommonFiles,
    modules: createdModules.length,
    helperFiles: createdHelpers.length,
    selectorFiles: createdSelectors.length,
    specFiles: createdSpecs.length,
    copiedCsvFiles
  }, null, 2));
}

main();