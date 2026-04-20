const fs = require('fs');
const os = require('os');
const path = require('path');
const { expect } = require('@playwright/test');
const { safeClick, safeClickIfFound, safeExpectVisible, safeFill, waitForAppToSettle } = require('./actions');
const { clickIfFound, resolveFirst } = require('./fallback');
const { digiteyescampsManagecampsclusterHelpers } = require('./digiteyescampsManagecampscluster');
const { wrapHelperMapWithReadableSteps } = require('./clientReadableSteps');

const DATE_PATTERN = /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b/;

function normalizeLabel(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

async function getListingTable(page, selectors) {
  const { locator } = await resolveFirst(page, selectors.listingTable, {
    timeoutPerCandidate: 10000
  });
  return locator;
}

async function selectModule(page, selectors, country = 'India') {
  await digiteyescampsManagecampsclusterHelpers.selectLoginCountry(page, country);
  await safeClickIfFound(page, selectors.dataLoaderMenu, 'DigitEYES Data Loader menu', {
    timeoutPerCandidate: 2000,
    actionTimeout: 5000
  });
  await safeClick(page, selectors.moduleLink, selectors.moduleLabel || 'DigitEYES Data Loader module', {
    timeoutPerCandidate: 6000
  });
  await waitForAppToSettle(page, 1000);
}

async function verifyPageLoaded(page, selectors) {
  await safeExpectVisible(page, selectors.pageHeading, selectors.pageLabel || 'module heading', {
    timeoutPerCandidate: 10000
  });
  await safeExpectVisible(page, selectors.listingTable, selectors.tableLabel || 'listing table', {
    timeoutPerCandidate: 10000
  });
  const rowCount = await getVisibleRowCount(page, selectors);
  expect(rowCount, 'Expected the listing table to contain at least one visible row').toBeGreaterThan(0);
}

async function openModule(page, selectors, country = 'India') {
  await selectModule(page, selectors, country);
  await verifyPageLoaded(page, selectors);
}

async function measureOpenModuleDuration(page, selectors, country = 'India') {
  const start = Date.now();
  await openModule(page, selectors, country);
  return Date.now() - start;
}

async function getListingHeaders(page, selectors) {
  const table = await getListingTable(page, selectors);
  return table.locator('thead tr').first().evaluate((row) =>
    Array.from(row.children)
      .filter((node) => ['TH', 'TD'].includes(node.tagName))
      .map((node) => node.textContent.replace(/\s+/g, ' ').trim())
  );
}

function findHeaderIndex(headers, expectedHeader) {
  const normalizedExpected = normalizeLabel(expectedHeader);
  return headers.findIndex((header) => {
    const normalizedHeader = normalizeLabel(header);
    if (!normalizedHeader || !normalizedExpected) {
      return false;
    }
    return normalizedHeader === normalizedExpected
      || normalizedHeader.includes(normalizedExpected)
      || normalizedExpected.includes(normalizedHeader);
  });
}

async function getColumnIndexByHeader(page, selectors, headerName) {
  const headers = await getListingHeaders(page, selectors);

  for (const candidate of asArray(headerName)) {
    const index = findHeaderIndex(headers, candidate);
    if (index !== -1) {
      return index;
    }
  }

  throw new Error(`Unable to find table header: ${asArray(headerName).join(', ')}. Headers found: ${headers.join(', ')}`);
}

async function getColumnValues(page, selectors, headerName) {
  const table = await getListingTable(page, selectors);
  const headerIndex = await getColumnIndexByHeader(page, selectors, headerName);

  return table.locator('tbody tr').evaluateAll((rows, index) =>
    rows
      .filter((row) => {
        const style = window.getComputedStyle(row);
        return row.getClientRects().length > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map((row) => {
        const cells = Array.from(row.children).filter((node) => ['TH', 'TD'].includes(node.tagName));
        const cell = cells[index];
        return cell ? cell.textContent.replace(/\s+/g, ' ').trim() : '';
      })
      .filter(Boolean), headerIndex);
}

async function getVisibleRowCount(page, selectors) {
  const table = await getListingTable(page, selectors);
  return table.locator('tbody tr').evaluateAll((rows) =>
    rows.filter((row) => {
      const style = window.getComputedStyle(row);
      return row.getClientRects().length > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    }).length
  );
}

async function expectListingHeaders(page, selectors, expectedHeaders) {
  const headers = await getListingHeaders(page, selectors);
  const normalizedHeaders = headers.map(normalizeLabel);

  for (const expectedHeader of expectedHeaders) {
    const matched = asArray(expectedHeader).some((candidate) => {
      const normalizedCandidate = normalizeLabel(candidate);
      return normalizedHeaders.some((header) => header === normalizedCandidate || header.includes(normalizedCandidate));
    });
    expect(matched, `Listing headers should include ${asArray(expectedHeader).join(' / ')}`).toBe(true);
  }
}

async function expectColumnValuesNumeric(page, selectors, headerName) {
  const values = await getColumnValues(page, selectors, headerName);
  expect(values.length, `${asArray(headerName).join(' / ')} should contain at least one value`).toBeGreaterThan(0);

  for (const value of values) {
    const normalizedValue = value.replace(/,/g, '').trim();
    expect(/^\d+$/.test(normalizedValue), `${asArray(headerName).join(' / ')} should contain only numeric values, received: ${value}`).toBe(true);
  }
}

async function expectColumnValuesEqual(page, selectors, headerName, expectedValue, options = {}) {
  const values = await getColumnValues(page, selectors, headerName);
  expect(values.length, `${asArray(headerName).join(' / ')} should contain at least one value`).toBeGreaterThan(0);

  const valuesToAssert = Number.isInteger(options.limit) && options.limit > 0
    ? values.slice(0, options.limit)
    : values;

  for (const value of valuesToAssert) {
    expect(value, `${asArray(headerName).join(' / ')} should equal ${expectedValue}`).toBe(expectedValue);
  }
}

async function expectColumnContainsValue(page, selectors, headerName, expectedValue) {
  const values = await getColumnValues(page, selectors, headerName);
  expect(values.length, `${asArray(headerName).join(' / ')} should contain at least one value`).toBeGreaterThan(0);
  expect(values.some((value) => value.includes(expectedValue)), `${asArray(headerName).join(' / ')} should contain ${expectedValue}`).toBe(true);
}

async function expectColumnValueOccurrenceAtLeast(page, selectors, headerName, expectedValue, minimumCount) {
  const values = await getColumnValues(page, selectors, headerName);
  expect(values.length, `${asArray(headerName).join(' / ')} should contain at least one value`).toBeGreaterThan(0);

  const matchCount = values.filter((value) => value === expectedValue).length;
  expect(
    matchCount,
    `${asArray(headerName).join(' / ')} should contain ${expectedValue} at least ${minimumCount} times`
  ).toBeGreaterThanOrEqual(minimumCount);
}

async function expectColumnValuesMatchPattern(page, selectors, headerName, pattern) {
  const values = await getColumnValues(page, selectors, headerName);
  expect(values.length, `${asArray(headerName).join(' / ')} should contain at least one value`).toBeGreaterThan(0);

  for (const value of values) {
    expect(pattern.test(value), `${asArray(headerName).join(' / ')} should match ${pattern}, received: ${value}`).toBe(true);
  }
}

async function expectColumnValuesUnique(page, selectors, headerName) {
  const values = await getColumnValues(page, selectors, headerName);
  expect(values.length, `${asArray(headerName).join(' / ')} should contain at least one value`).toBeGreaterThan(0);
  expect(new Set(values).size, `${asArray(headerName).join(' / ')} should contain unique values`).toBe(values.length);
}

async function expectTableContainsText(page, selectors, expectedText) {
  const table = await getListingTable(page, selectors);
  const bodyText = await table.locator('tbody').innerText();
  expect(bodyText, `Listing table should contain ${expectedText}`).toContain(expectedText);
}

async function openSearchFilter(page, selectors) {
  let lastError;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      await safeClick(page, selectors.searchFilterButton, 'Search / Filter', {
        timeoutPerCandidate: 15000,
        actionTimeout: 15000
      });
      await waitForAppToSettle(page, 1000);
      await safeExpectVisible(page, selectors.searchFilterModal, 'Search / Filter modal', {
        timeoutPerCandidate: 10000
      });

      if (selectors.searchApplyButton) {
        await safeExpectVisible(page, selectors.searchApplyButton, 'Apply button', {
          timeoutPerCandidate: 10000
        });
      }

      return;
    } catch (error) {
      lastError = error;
      await page.keyboard.press('Escape').catch(() => null);
      await waitForAppToSettle(page, 500);
    }
  }

  throw lastError;
}

async function verifySearchFilterFields(page, selectors) {
  await safeExpectVisible(page, selectors.searchLocationLabel, 'Search location label', {
    timeoutPerCandidate: 10000
  });
  await safeExpectVisible(page, selectors.searchLocationField, 'Search location field', {
    timeoutPerCandidate: 10000
  });
  await safeExpectVisible(page, selectors.searchApplyButton, 'Apply button', {
    timeoutPerCandidate: 10000
  });
  await safeExpectVisible(page, selectors.searchResetButton, 'Reset button', {
    timeoutPerCandidate: 10000
  });
  await safeExpectVisible(page, selectors.searchCloseButton, 'Close button', {
    timeoutPerCandidate: 10000
  });
}

async function fillSearchLocation(page, selectors, value) {
  await safeFill(page, selectors.searchLocationField, value, 'Search Location', {
    timeoutPerCandidate: 10000
  });
}

async function getReusableSearchToken(page, selectors, headerCandidates) {
  const candidates = headerCandidates || selectors.searchTokenHeaders || ['Location', 'Camp Information'];

  for (const candidate of candidates) {
    try {
      const values = await getColumnValues(page, selectors, candidate);
      const sample = values.find(Boolean);
      if (sample) {
        const token = sample.split(/[^A-Za-z0-9]+/).find((part) => part.length >= 3);
        if (token) {
          return token;
        }
      }
    } catch (error) {
      continue;
    }
  }

  return 'Camp';
}

async function applySearchFilterUsingTableData(page, selectors, options = {}) {
  const token = options.token || await getReusableSearchToken(page, selectors, options.headerCandidates);
  await fillSearchLocation(page, selectors, token);
  await safeClick(page, selectors.searchApplyButton, 'Apply Search Filter', {
    timeoutPerCandidate: 10000,
    actionTimeout: 10000
  });
  await waitForAppToSettle(page, 1500);
  await safeExpectVisible(page, selectors.listingTable, selectors.tableLabel || 'listing table', {
    timeoutPerCandidate: 10000
  });

  const tableText = await (await getListingTable(page, selectors)).locator('tbody').innerText();
  expect(tableText.length, 'Filtered results should remain visible').toBeGreaterThan(0);
}

async function resetSearchFilter(page, selectors, value = 'TemporaryFilterValue') {
  await fillSearchLocation(page, selectors, value);
  await safeClick(page, selectors.searchResetButton, 'Reset Search Filter', {
    timeoutPerCandidate: 10000,
    actionTimeout: 10000
  });
  await waitForAppToSettle(page, 750);

  const { locator } = await resolveFirst(page, selectors.searchLocationField, {
    timeoutPerCandidate: 10000
  });
  await expect(locator, 'Search location field should be cleared after reset').toHaveValue('');
}

async function closeSearchFilter(page, selectors) {
  await safeClick(page, selectors.searchCloseButton, 'Close Search Filter', {
    timeoutPerCandidate: 10000,
    actionTimeout: 10000
  });
  await waitForAppToSettle(page, 750);
  const { locator } = await resolveFirst(page, selectors.searchFilterModal, {
    timeoutPerCandidate: 5000,
    mustBeVisible: false
  });
  await expect(locator, 'Search / Filter modal should be hidden after closing').toBeHidden({ timeout: 10000 });
}

async function clickRefresh(page, selectors) {
  const refreshClick = await clickIfFound(page, selectors.refreshButton, {
    timeoutPerCandidate: 4000,
    actionTimeout: 10000
  });

  if (!refreshClick.clicked) {
    await page.reload({ waitUntil: 'domcontentloaded' });
  }

  await waitForAppToSettle(page, 1500);
  await verifyPageLoaded(page, selectors);
}

async function clickShowDatesAndExpectCampDates(page, selectors) {
  const { locator } = await resolveFirst(page, selectors.showDatesButton, {
    timeoutPerCandidate: 15000
  });
  await locator.click();
  await waitForAppToSettle(page, 1000);
  const tableText = await (await getListingTable(page, selectors)).locator('tbody').innerText();
  expect(DATE_PATTERN.test(tableText), 'Show Dates should expose at least one date value').toBe(true);
}

async function downloadFirstMatchingFile(page, selectors, candidates, label, extensionPattern) {
  const { locator } = await resolveFirst(page, candidates, { timeoutPerCandidate: 10000 });
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15000 }),
    locator.click()
  ]);
  const filename = download.suggestedFilename().toLowerCase();
  expect(filename, `${label} should download the expected file type`).toMatch(extensionPattern);

  const outputPath = path.join(os.tmpdir(), `${Date.now()}-${path.basename(filename)}`);
  await download.saveAs(outputPath);
  expect(fs.statSync(outputPath).size, `${label} download should not be empty`).toBeGreaterThan(0);
}

async function downloadFirstXls(page, selectors) {
  await downloadFirstMatchingFile(page, selectors, selectors.downloadXlsButton, 'XLS export', /\.xlsx?$/);
}

async function downloadFirstCsv(page, selectors) {
  await downloadFirstMatchingFile(page, selectors, selectors.downloadCsvButton, 'CSV export', /\.csv$/);
}

async function openFirstViewSummaryReport(page, selectors) {
  const { locator } = await resolveFirst(page, selectors.viewSummaryReportButton, {
    timeoutPerCandidate: 10000
  });
  const popupPromise = page.waitForEvent('popup', { timeout: 3000 }).catch(() => null);
  await locator.click();
  const popup = await popupPromise;

  if (popup) {
    await popup.waitForLoadState('domcontentloaded');
    await safeExpectVisible(popup, selectors.viewSummaryReportHeading, 'View Summary Report heading', {
      timeoutPerCandidate: 10000
    });
    await popup.close().catch(() => null);
    return;
  }

  await waitForAppToSettle(page, 1500);
  await safeExpectVisible(page, selectors.viewSummaryReportHeading, 'View Summary Report heading', {
    timeoutPerCandidate: 10000
  });
}

async function selectPageSize(page, selectors, valueLabel) {
  const { locator } = await resolveFirst(page, selectors.pageSizeDropdown, {
    timeoutPerCandidate: 15000
  });

  const desiredLabel = String(valueLabel).trim();
  const desiredLabels = [desiredLabel, `Show: ${desiredLabel}`];
  const options = await locator.locator('option').evaluateAll((nodes) => nodes.map((node) => ({
    value: node.value,
    label: (node.textContent || '').trim()
  })));

  const matchingOption = options.find((option) => desiredLabels.includes(option.label))
    || options.find((option) => option.value === desiredLabel);

  if (!matchingOption) {
    throw new Error(`Unable to find page size option for ${desiredLabel}. Available options: ${options.map((option) => option.label || option.value).join(', ')}`);
  }

  await locator.selectOption(matchingOption.value);
  await waitForAppToSettle(page, 1000);
}

async function selectPageSizeAndExpectMaxRows(page, selectors, valueLabel) {
  await selectPageSize(page, selectors, valueLabel);
  const rows = await getVisibleRowCount(page, selectors);
  expect(rows, `Selecting page size ${valueLabel} should limit visible rows`).toBeLessThanOrEqual(Number(valueLabel));

  if (rows === 0) {
    const tableText = await (await getListingTable(page, selectors)).innerText();
    expect(tableText, 'Page-size change should still leave the Change Log table in a valid state when no records exist').toMatch(/0\s+records\s+found|showing:\s*0/i);
    return;
  }

  expect(rows, 'Page-size change should still leave visible data rows').toBeGreaterThan(0);
}

async function retryFirstUpload(page, selectors) {
  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await safeClick(page, selectors.retryUploadButton, 'Retry Upload', {
    timeoutPerCandidate: 10000,
    actionTimeout: 10000
  });
  await waitForAppToSettle(page, 2000);
  await safeExpectVisible(page, selectors.listingTable, selectors.tableLabel || 'listing table', {
    timeoutPerCandidate: 10000
  });
}

function createDataLoaderModuleHelpers(selectors) {
  return wrapHelperMapWithReadableSteps({
    openModule: (page, country) => openModule(page, selectors, country),
    verifyPageLoaded: (page) => verifyPageLoaded(page, selectors),
    measureOpenModuleDuration: (page, country) => measureOpenModuleDuration(page, selectors, country),
    expectListingHeaders: (page, expectedHeaders) => expectListingHeaders(page, selectors, expectedHeaders),
    expectColumnValuesNumeric: (page, headerName) => expectColumnValuesNumeric(page, selectors, headerName),
    expectColumnValuesEqual: (page, headerName, expectedValue, options) => expectColumnValuesEqual(page, selectors, headerName, expectedValue, options),
    expectColumnContainsValue: (page, headerName, expectedValue) => expectColumnContainsValue(page, selectors, headerName, expectedValue),
    expectColumnValueOccurrenceAtLeast: (page, headerName, expectedValue, minimumCount) => expectColumnValueOccurrenceAtLeast(page, selectors, headerName, expectedValue, minimumCount),
    expectColumnValuesMatchPattern: (page, headerName, pattern) => expectColumnValuesMatchPattern(page, selectors, headerName, pattern),
    expectColumnValuesUnique: (page, headerName) => expectColumnValuesUnique(page, selectors, headerName),
    expectTableContainsText: (page, expectedText) => expectTableContainsText(page, selectors, expectedText),
    openSearchFilter: (page) => openSearchFilter(page, selectors),
    verifySearchFilterFields: (page) => verifySearchFilterFields(page, selectors),
    applySearchFilterUsingTableData: (page, options) => applySearchFilterUsingTableData(page, selectors, options),
    resetSearchFilter: (page, value) => resetSearchFilter(page, selectors, value),
    closeSearchFilter: (page) => closeSearchFilter(page, selectors),
    clickRefresh: (page) => clickRefresh(page, selectors),
    clickShowDatesAndExpectCampDates: (page) => clickShowDatesAndExpectCampDates(page, selectors),
    downloadFirstXls: (page) => downloadFirstXls(page, selectors),
    downloadFirstCsv: (page) => downloadFirstCsv(page, selectors),
    openFirstViewSummaryReport: (page) => openFirstViewSummaryReport(page, selectors),
    selectPageSizeAndExpectMaxRows: (page, valueLabel) => selectPageSizeAndExpectMaxRows(page, selectors, valueLabel),
    retryFirstUpload: (page) => retryFirstUpload(page, selectors),
    selectors
  });
}

module.exports = {
  DATE_PATTERN,
  createDataLoaderModuleHelpers
};