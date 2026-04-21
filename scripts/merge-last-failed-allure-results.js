const fs = require('fs');
const os = require('os');
const path = require('path');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function cleanDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  ensureDir(dirPath);
}

function hasFiles(dirPath) {
  return fs.existsSync(dirPath) && fs.readdirSync(dirPath).length > 0;
}

function createBackup(sourceDir, prefix = 'vision-spring-allure-') {
  if (!hasFiles(sourceDir)) {
    return null;
  }

  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  fs.cpSync(sourceDir, backupDir, { recursive: true });
  return backupDir;
}

function restoreBackup(sourceDir, targetDir) {
  cleanDir(targetDir);

  if (!sourceDir || !hasFiles(sourceDir)) {
    return;
  }

  for (const entry of fs.readdirSync(sourceDir)) {
    fs.cpSync(path.join(sourceDir, entry), path.join(targetDir, entry), { recursive: true });
  }
}

function cleanupBackup(dirPath) {
  if (!dirPath) {
    return;
  }

  fs.rmSync(dirPath, { recursive: true, force: true });
}

function isResultFile(fileName) {
  return fileName.endsWith('-result.json');
}

function getResultIdentity(result) {
  return result.testCaseId || result.historyId || result.fullName || result.name || null;
}

function readResultIdentity(filePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return getResultIdentity(parsed);
  } catch {
    return null;
  }
}

function getRerunIdentities(resultsDir) {
  const identities = new Set();

  if (!fs.existsSync(resultsDir)) {
    return identities;
  }

  for (const entry of fs.readdirSync(resultsDir)) {
    if (!isResultFile(entry)) {
      continue;
    }

    const identity = readResultIdentity(path.join(resultsDir, entry));
    if (identity) {
      identities.add(identity);
    }
  }

  return identities;
}

function mergeBaselineIntoRerunResults({ baselineDir, resultsDir }) {
  if (!baselineDir || !hasFiles(baselineDir)) {
    return { mergedBaselineResults: 0, replacedBaselineResults: 0 };
  }

  ensureDir(resultsDir);
  const rerunIdentities = getRerunIdentities(resultsDir);
  let mergedBaselineResults = 0;
  let replacedBaselineResults = 0;

  for (const entry of fs.readdirSync(baselineDir)) {
    const sourcePath = path.join(baselineDir, entry);
    const targetPath = path.join(resultsDir, entry);

    if (isResultFile(entry)) {
      const identity = readResultIdentity(sourcePath);
      if (identity && rerunIdentities.has(identity)) {
        replacedBaselineResults += 1;
        continue;
      }

      mergedBaselineResults += 1;
    }

    if (!fs.existsSync(targetPath)) {
      fs.cpSync(sourcePath, targetPath, { recursive: true });
    }
  }

  return { mergedBaselineResults, replacedBaselineResults };
}

module.exports = {
  cleanDir,
  createBackup,
  restoreBackup,
  cleanupBackup,
  mergeBaselineIntoRerunResults,
};