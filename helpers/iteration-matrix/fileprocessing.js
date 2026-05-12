const { expect, test } = require('@playwright/test');
const { clickWithFallback, clickIfFound, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { fileprocessingSelectors } = require('../../selectors/iteration-matrix/fileprocessing.selectors.js');

async function reportStep(name, action) {
  return test.step(name, action);
}

async function openImRemitModule(page) {
  await clickWithFallback(page, fileprocessingSelectors.moduleTabs.imremit, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function openFileProcessing(page) {
  await clickWithFallback(page, fileprocessingSelectors.moduleTabs.fileProcessing, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectFileProcessingVisible(page) {
  const result = await resolveFirst(page, fileprocessingSelectors.headings.fileProcessing, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(result.locator).toBeVisible({ timeout: 10000 });
}

async function openFileProcessingWorkspace(page) {
  await openImRemitModule(page);
  await clickIfFound(page, fileprocessingSelectors.customerContext.selectAll, {
    mustBeVisible: true,
    timeoutPerCandidate: 1500
  }).catch(() => null);
  await waitForAppToSettle(page, 500);
  await openFileProcessing(page);
  await expectFileProcessingVisible(page);
}

async function fillSearchField(page, candidates, value) {
  const matchedBy = await fillWithFallback(page, candidates, value, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  const result = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(result.locator).toHaveValue(String(value), { timeout: 10000 });
  await waitForAppToSettle(page, 750);
  return matchedBy;
}

async function getFirstRowText(page) {
  const row = page.locator('table tbody tr').first();
  await row.waitFor({ state: 'visible', timeout: 10000 });
  return ((await row.textContent()) || '').replace(/\s+/g, ' ').trim();
}

async function getFirstSearchToken(page) {
  const rowText = await getFirstRowText(page);
  const tokens = rowText.split(/\s+/).filter((token) => token.length >= 4);
  return tokens[0] || rowText;
}

async function clickPaginationControl(page, candidates) {
  const result = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(result.locator).toBeVisible({ timeout: 10000 });
  await result.locator.click();
  await waitForAppToSettle(page, 1000);
}

async function openPaginationSizeMenu(page) {
  await clickPaginationControl(page, fileprocessingSelectors.pagination.sizeTrigger);
}

async function selectPaginationSize(page, value) {
  await openPaginationSizeMenu(page);
  const optionCandidates = fileprocessingSelectors.pagination.sizeOption(value);
  const option = await resolveFirst(page, optionCandidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(option.locator).toBeVisible({ timeout: 10000 });
  await option.locator.click();
  await waitForAppToSettle(page, 1000);
}

async function openColumnOrderMenu(page) {
  await clickPaginationControl(page, fileprocessingSelectors.columnOrder.trigger);
}

async function toggleColumn(page, label) {
  const toggle = await resolveFirst(page, fileprocessingSelectors.columnOrder.toggle(label), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await toggle.locator.click();
  await waitForAppToSettle(page, 500);
}

async function openPackageIdHeaderActions(page) {
  const header = await resolveFirst(page, fileprocessingSelectors.table.packageIdHeader, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await header.locator.click();
  await waitForAppToSettle(page, 500);
}

async function chooseHeaderAction(page, candidates) {
  const action = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await action.locator.click();
  await waitForAppToSettle(page, 750);
}

async function expectHeaderVisible(page, candidates) {
  const header = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(header.locator).toBeVisible({ timeout: 10000 });
}

async function runTs02(page, data) {
  const searchValue = data.FileProcessingSearchId || data.CustomerId || 'a2c9e0e6-30ca-47c9-b235-20154fb1171e';

  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Search file processing records by ID', async () => {
    await fillSearchField(page, fileprocessingSelectors.searchFields.byId, searchValue);
  });
}

async function runTs03(page, data) {
  const filename = data.FileProcessingFilename || 'CADENIM-IM_RECON-FEB-05-0001.txt';

  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Search file processing records by filename', async () => {
    await fillSearchField(page, fileprocessingSelectors.searchFields.byFilename, filename);
  });
}

async function runTs04(page) {
  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Move to the next page of file processing results', async () => {
    await clickPaginationControl(page, fileprocessingSelectors.pagination.next);
  });

  await reportStep('Verify the previous-page control is available after paging forward', async () => {
    await expectHeaderVisible(page, fileprocessingSelectors.pagination.previous);
  });
}

async function runTs05(page) {
  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Move to the last page of file processing results', async () => {
    await clickPaginationControl(page, fileprocessingSelectors.pagination.last);
  });

  await reportStep('Verify the first-page control is available on the last page', async () => {
    await expectHeaderVisible(page, fileprocessingSelectors.pagination.first);
  });
}

async function runTs06(page) {
  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Advance to a later file processing results page', async () => {
    await clickPaginationControl(page, fileprocessingSelectors.pagination.next);
  });

  await reportStep('Return to the previous file processing results page', async () => {
    await clickPaginationControl(page, fileprocessingSelectors.pagination.previous);
  });
}

async function runTs07(page) {
  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Navigate to the last page before returning to the first page', async () => {
    await clickPaginationControl(page, fileprocessingSelectors.pagination.last);
  });

  await reportStep('Use the first-page control to return to the beginning of the results', async () => {
    await clickPaginationControl(page, fileprocessingSelectors.pagination.first);
  });
}

async function runTs08(page) {
  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Open the pagination-size menu', async () => {
    await openPaginationSizeMenu(page);
  });

  await reportStep('Verify the available page-size options are visible', async () => {
    for (const size of ['5', '10', '25', '50', '100']) {
      const option = await resolveFirst(page, fileprocessingSelectors.pagination.sizeOption(size), {
        mustBeVisible: true,
        timeoutPerCandidate: 2500
      });
      await expect(option.locator).toBeVisible({ timeout: 10000 });
    }
  });

  await reportStep('Select 25 rows per page in the pagination menu', async () => {
    await chooseHeaderAction(page, fileprocessingSelectors.pagination.sizeOption('25'));
  });
}

async function runTs09(page) {
  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Search across all file processing entries', async () => {
    const token = await getFirstSearchToken(page);
    await fillSearchField(page, fileprocessingSelectors.searchFields.allEntries, token);
  });
}

async function runTs10(page) {
  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Open the Column Order settings for the file processing grid', async () => {
    await openColumnOrderMenu(page);
  });

  await reportStep('Toggle the Package ID column off and back on from Column Order', async () => {
    await toggleColumn(page, 'Package ID');
    await toggleColumn(page, 'Package ID');
  });

  await reportStep('Verify the Package ID column remains available after toggling', async () => {
    await expectHeaderVisible(page, fileprocessingSelectors.table.packageIdHeader);
  });
}

async function runTs11(page) {
  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Open the Package ID column actions menu', async () => {
    await openPackageIdHeaderActions(page);
  });

  await reportStep('Apply ascending sorting to the Package ID column', async () => {
    await chooseHeaderAction(page, fileprocessingSelectors.headerActions.asc);
  });
}

async function runTs12(page) {
  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Open the Package ID column actions menu', async () => {
    await openPackageIdHeaderActions(page);
  });

  await reportStep('Apply descending sorting to the Package ID column', async () => {
    await chooseHeaderAction(page, fileprocessingSelectors.headerActions.desc);
  });
}

async function runTs13(page) {
  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Open the Package ID column actions menu', async () => {
    await openPackageIdHeaderActions(page);
  });

  await reportStep('Hide the Package ID column from the file processing grid', async () => {
    await chooseHeaderAction(page, fileprocessingSelectors.headerActions.hide);
  });
}

async function runTs14(page) {
  await reportStep('Open the File Processing page for imREmit', async () => {
    await openFileProcessingWorkspace(page);
  });

  await reportStep('Scroll down on the File Processing page', async () => {
    await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
    await waitForAppToSettle(page, 500);
  });

  await reportStep('Return to the top of the File Processing page', async () => {
    await clickPaginationControl(page, fileprocessingSelectors.utilities.returnToTop);
  });

  await reportStep('Verify the page header is visible at the top of the screen', async () => {
    await expectFileProcessingVisible(page);
  });
}

async function runTs01(page) {
  await reportStep('Open the imREmit premium module', async () => {
    await openImRemitModule(page);
  });

  await reportStep('Open File Processing from the imREmit navigation', async () => {
    await openFileProcessing(page);
  });

  await reportStep('Verify the File Processing page is available', async () => {
    await expectFileProcessingVisible(page);
  });
}

async function runScenario(page, data, scenarioName) {
  if (/^TS_01_/i.test(scenarioName)) {
    return runTs01(page);
  }
  if (/^TS_02_/i.test(scenarioName)) {
    return runTs02(page, data);
  }
  if (/^TS_03_/i.test(scenarioName)) {
    return runTs03(page, data);
  }
  if (/^TS_04_/i.test(scenarioName)) {
    return runTs04(page);
  }
  if (/^TS_05_/i.test(scenarioName)) {
    return runTs05(page);
  }
  if (/^TS_06_/i.test(scenarioName)) {
    return runTs06(page);
  }
  if (/^TS_07_/i.test(scenarioName)) {
    return runTs07(page);
  }
  if (/^TS_08_/i.test(scenarioName)) {
    return runTs08(page);
  }
  if (/^TS_09_/i.test(scenarioName)) {
    return runTs09(page);
  }
  if (/^TS_10_/i.test(scenarioName)) {
    return runTs10(page);
  }
  if (/^TS_11_/i.test(scenarioName)) {
    return runTs11(page);
  }
  if (/^TS_12_/i.test(scenarioName)) {
    return runTs12(page);
  }
  if (/^TS_13_/i.test(scenarioName)) {
    return runTs13(page);
  }
  if (/^TS_14_/i.test(scenarioName)) {
    return runTs14(page);
  }

  throw new Error(`FileProcessing scenario not implemented yet: ${scenarioName}`);
}

module.exports = {
  fileprocessingHelpers: {
    ...wrapHelperMapWithReadableSteps({
      openImRemitModule,
      openFileProcessing,
      expectFileProcessingVisible,
      openFileProcessingWorkspace
    }),
    runScenario,
    selectors: fileprocessingSelectors
  }
};
