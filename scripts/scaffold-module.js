const fs = require('fs');
const path = require('path');

function toSafeModuleName(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .replace(/^[^a-zA-Z]+/, '');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) {
    console.log(`SKIP ${path.relative(process.cwd(), filePath)} already exists`);
    return;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`CREATE ${path.relative(process.cwd(), filePath)}`);
}

function buildSharedTemplate() {
  return `const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin } = require('../../../helpers/iteration-matrix/auth');

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession
};
`;
}

function buildSpecTemplate(moduleName) {
  return `const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession
} = require('./_shared');

test('TS_01_${moduleName}_smoke', async ({ page }) => {
  const data = loadRuntimeData();

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Add module-specific flow here', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
`;
}

function main() {
  const rawModuleName = process.argv[2];
  const moduleName = toSafeModuleName(rawModuleName);

  if (!moduleName) {
    console.error('Usage: node scripts/scaffold-module.js <ModuleName>');
    process.exit(1);
  }

  const testsDir = path.resolve(__dirname, '..', 'tests', 'Iteration_Matrix', moduleName);
  ensureDir(testsDir);

  writeIfMissing(path.join(testsDir, '_shared.js'), buildSharedTemplate());
  writeIfMissing(
    path.join(testsDir, `TS_01_${moduleName}_smoke.spec.js`),
    buildSpecTemplate(moduleName)
  );
}

main();