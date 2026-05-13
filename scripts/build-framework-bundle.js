const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const bundleRoot = path.join(rootDir, 'framework', 'team-starter-kit');
const coreRoot = path.join(bundleRoot, 'core');
const examplesRoot = path.join(bundleRoot, 'examples');

const coreItemsToCopy = [
  'package.json',
  'playwright.config.js',
  'helpers/actions.js',
  'helpers/auth.js',
  'helpers/dataLoader.js',
  'helpers/fallback.js',
  'selectors/common.selectors.js',
  'scripts/customize-allure-report.js',
  'scripts/scaffold-module.js',
  'scripts/run-combined-client-report.js',
  'assets',
  'docs/conversion-framework.md',
  'docs/team-project-setup-guide.md',
  'README.md'
];

const exampleItemsToCopy = [
  'helpers/imremit.js',
  'helpers/fileProcessing.js',
  'helpers/admin.js',
  'helpers/customerModuleManagement.js',
  'selectors/imremit.selectors.js',
  'selectors/fileProcessing.selectors.js',
  'selectors/admin.selectors.js',
  'selectors/customerModuleManagement.selectors.js',
  'tests/FileProcessing/_shared.js',
  'tests/FileProcessing/TS_01_To_verify_File_Processing_button.spec.js',
  'tests/CustomerModuleManagement/_shared.js',
  'tests/CustomerModuleManagement/TS_29_To_verify_that_Management_Role_has_access_to_Customer_Module_Management.spec.js'
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyRecursive(sourcePath, targetPath) {
  const stats = fs.statSync(sourcePath);

  if (stats.isDirectory()) {
    ensureDir(targetPath);
    for (const entry of fs.readdirSync(sourcePath)) {
      copyRecursive(path.join(sourcePath, entry), path.join(targetPath, entry));
    }
    return;
  }

  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);
}

function writeBundleReadme() {
  const content = `# Team Starter Kit

This folder is a reusable starter kit for AIQ-to-Playwright conversion projects.

## Folder Layout

- core/
  Reusable framework pieces intended to be copied or merged into a target Playwright repo.
- examples/
  Working examples from this project that show how module-specific helpers, selectors, _shared.js, and specs are structured.

## Important Rule

Every target project still brings its own:

1. Test Script folder
2. Utility folder/files
3. DPL file

Those project inputs are not part of the starter kit and should be pasted separately into the target repo.

## What To Do

1. Copy core/ into the target Playwright project and merge it with the target repo.
2. Use examples/ only as implementation reference.
3. Paste incoming AIQ assets into:
   - source-aiq/
   - data/
4. Run:

\`\`\`bash
npm install
npx playwright install
npm run scaffold:module -- <ModuleName>
\`\`\`

## Core Includes

- package.json
- playwright.config.js
- helpers/actions.js
- helpers/auth.js
- helpers/dataLoader.js
- helpers/fallback.js
- selectors/common.selectors.js
- scripts/customize-allure-report.js
- scripts/scaffold-module.js
- scripts/run-combined-client-report.js
- assets/
- docs/conversion-framework.md
- docs/team-project-setup-guide.md

## Example Includes

- module helper examples
- module selector examples
- _shared.js examples
- sample specs from this repo

## Main Team Docs

- core/docs/conversion-framework.md
- core/docs/team-project-setup-guide.md
`;

  fs.writeFileSync(path.join(bundleRoot, 'START-HERE.md'), content, 'utf8');
}

function writeExamplesReadme() {
  const content = `# Examples

This folder contains project-specific examples from this repository.

Use these files to understand the structure and coding style, not as a blind drop-in replacement for every target project.

## Included Example Areas

1. File Processing
2. Customer Module Management

## How To Use

1. Reuse patterns.
2. Copy only when the target project needs similar behavior.
3. Keep the target project's own AIQ Test Scripts, Utility files, and DPL as the source of truth.
`;

  fs.writeFileSync(path.join(examplesRoot, 'README.md'), content, 'utf8');
}

function main() {
  fs.rmSync(bundleRoot, { recursive: true, force: true });
  ensureDir(bundleRoot);
  ensureDir(coreRoot);
  ensureDir(examplesRoot);

  for (const item of coreItemsToCopy) {
    const sourcePath = path.join(rootDir, item);
    const targetPath = path.join(coreRoot, item);
    copyRecursive(sourcePath, targetPath);
  }

  for (const item of exampleItemsToCopy) {
    const sourcePath = path.join(rootDir, item);
    const targetPath = path.join(examplesRoot, item);
    copyRecursive(sourcePath, targetPath);
  }

  writeBundleReadme();
  writeExamplesReadme();
  console.log(`Framework bundle created at ${bundleRoot}`);
}

main();