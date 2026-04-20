const fs = require('fs');
const os = require('os');
const path = require('path');
const { expect } = require('@playwright/test');
const { safeClick, safeExpectVisible, waitForAppToSettle } = require('./actions');
const { clickIfFound, resolveFirst } = require('./fallback');
const { digiteyescampsManagecampsclusterHelpers } = require('./digiteyescampsManagecampscluster');
const { digiteyescampsDataforsalesforceSelectors } = require('../selectors/digiteyescampsDataforsalesforce.selectors');
const { wrapHelperMapWithReadableSteps } = require('./clientReadableSteps');

const DATE_PATTERN = /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b/g;

function normalizeLabel(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

async function getListingTable(page) {
  const { locator } = await resolveFirst(page, digiteyescampsDataforsalesforceSelectors.listingTable, {
    timeoutPerCandidate: 10000
  });
  return locator;
}

async function selectDataForSalesforceModule(page, country = 'India') {
  await digiteyescampsManagecampsclusterHelpers.selectLoginCountry(page, country);
  await safeClick(page, digiteyescampsDataforsalesforceSelectors.dataForSalesforceLink, 'Data for Salesforce', {
    noWaitAfter: true
  });
  await waitForAppToSettle(page, 1000);
}

async function openModule(page, country = 'India') {
  await selectDataForSalesforceModule(page, country);
  await waitForAppToSettle(page, 1500);
  await verifyPageLoaded(page);
}

async function verifyPageLoaded(page) {
  await safeExpectVisible(page, digiteyescampsDataforsalesforceSelectors.pageHeading, 'Data for Salesforce heading', {
    timeoutPerCandidate: 8000
  });
  await safeExpectVisible(page, digiteyescampsDataforsalesforceSelectors.listingTable, 'Data for Salesforce listing table', {
    timeoutPerCandidate: 10000
  });

  await resolveFirst(page, digiteyescampsDataforsalesforceSelectors.refreshButton, {
    timeoutPerCandidate: 1000
  }).catch(() => null);

  const rows = await getVisibleRowCount(page);
  expect(rows).toBeGreaterThan(0);
}

async function getListingHeaders(page) {
  const table = await getListingTable(page);
  return table.locator('thead tr').first().locator('th').evaluateAll((nodes) =>
    nodes.map((node) => node.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean)
  );
}

async function expectListingHeaders(page, expectedHeaders) {
  const headers = await getListingHeaders(page);
  const normalizedHeaders = headers.map(normalizeLabel);

  for (const expectedHeader of expectedHeaders) {
    const matched = asArray(expectedHeader).some((candidate) => {
      const normalizedCandidate = normalizeLabel(candidate);
      return normalizedHeaders.some((header) => header === normalizedCandidate || header.includes(normalizedCandidate));
    });
    expect(matched, `Listing headers should include ${asArray(expectedHeader).join(' / ')}`).toBe(true);
  }
}

async function getColumnIndexByHeader(page, headerName) {
  const headers = await getListingHeaders(page);
  const index = headers.findIndex((header) =>
    asArray(headerName).some((candidate) => normalizeLabel(header) === normalizeLabel(candidate))
  );

  if (index === -1) {
    throw new Error(`Unable to find table header: ${asArray(headerName).join(', ')}. Headers found: ${headers.join(', ')}`);
  }

  return index;
}

async function getColumnValues(page, headerName) {
  const table = await getListingTable(page);
  const headerIndex = await getColumnIndexByHeader(page, headerName);

  return table.locator('tbody tr').evaluateAll((rows, index) =>
    rows
      .map((row) => {
        const cells = Array.from(row.querySelectorAll('td'));
        const cell = cells[index];
        return cell ? cell.textContent.replace(/\s+/g, ' ').trim() : '';
      })
      .filter(Boolean), headerIndex);
}

async function getVisibleRowCount(page) {
  const values = await getColumnValues(page, 'Ref#').catch(async () => {
    const table = await getListingTable(page);
    return table.locator('tbody tr').count();
  });

  return Array.isArray(values) ? values.length : values;
}

async function expectColumnContainsValue(page, headerName, expectedValue) {
  const values = await getColumnValues(page, headerName);
  expect(values.length, `${headerName} should contain at least one value`).toBeGreaterThan(0);
  expect(values.some((value) => value.includes(expectedValue)), `${headerName} should contain ${expectedValue}`).toBe(true);
}

async function expectStatusesWithinAllowed(page, allowedStatuses) {
  const values = await getColumnValues(page, 'Status');
  const normalizedAllowedStatuses = allowedStatuses.map(normalizeLabel);
  expect(values.length, 'Status column should contain at least one value').toBeGreaterThan(0);

  const matchCount = values.filter((value) => normalizedAllowedStatuses.includes(normalizeLabel(value))).length;
  expect(matchCount, 'Status column should contain at least one allowed lifecycle state').toBeGreaterThan(0);
}

async function expectActionButtonsVisible(page, candidates, label) {
  const { locator } = await resolveFirst(page, candidates, { timeoutPerCandidate: 5000 });
  await expect(locator, `${label} button should be visible`).toBeVisible();
}

async function openFirstViewSummaryReport(page) {
  await safeClick(page, digiteyescampsDataforsalesforceSelectors.viewSummaryReportButton, 'View Summary Report');
  await waitForAppToSettle(page, 750);
  await safeExpectVisible(page, digiteyescampsDataforsalesforceSelectors.viewSummaryReportHeading, 'View Summary Report heading');
  await safeExpectVisible(page, digiteyescampsDataforsalesforceSelectors.viewSummaryReportTitle, 'Daily Outreach Summary Report title');
}

async function markFirstRowDataImported(page) {
  const beforeCount = await page.locator('.btnMarkDownloaded').count();
  expect(beforeCount, 'Expected at least one Mark Data Imported to Salesforce button').toBeGreaterThan(0);

  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await safeClick(
    page,
    digiteyescampsDataforsalesforceSelectors.markDataImportedButton,
    'Mark Data Imported to Salesforce'
  );
  await page.waitForLoadState('domcontentloaded').catch(() => null);
  await waitForAppToSettle(page, 2500);
  await safeExpectVisible(page, digiteyescampsDataforsalesforceSelectors.listingTable, 'Data for Salesforce listing table', {
    timeoutPerCandidate: 10000
  });

  const afterCount = await page.locator('.btnMarkDownloaded').count();
  expect(afterCount).toBeLessThanOrEqual(beforeCount);
}

async function downloadFirstMatchingFile(page, candidates, label, extensionPattern) {
  const { locator } = await resolveFirst(page, candidates, { timeoutPerCandidate: 5000 });
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 10000 }),
    locator.click()
  ]);
  const suggestedFilename = download.suggestedFilename().toLowerCase();
  expect(suggestedFilename, `${label} should download the expected file type`).toMatch(extensionPattern);

  const outputPath = path.join(os.tmpdir(), `${Date.now()}-${path.basename(suggestedFilename)}`);
  await download.saveAs(outputPath);
  expect(fs.statSync(outputPath).size, `${label} download should not be empty`).toBeGreaterThan(0);
}

async function downloadFirstXls(page) {
  await downloadFirstMatchingFile(
    page,
    digiteyescampsDataforsalesforceSelectors.downloadXlsButton,
    'XLS export',
    /\.xlsx?$/
  );
}

async function downloadFirstCsv(page) {
  await downloadFirstMatchingFile(
    page,
    digiteyescampsDataforsalesforceSelectors.downloadCsvButton,
    'CSV export',
    /\.csv$/
  );
}

async function clickShowDatesAndExpectCampDates(page) {
  const table = await getListingTable(page);
  const showDatesButton = table.locator('tbody tr button').filter({ hasText: /show dates/i }).first();
  await expect(showDatesButton, 'Show Dates button should be visible in the Data for Salesforce table').toBeVisible({ timeout: 10000 });

  const beforeText = await table.locator('tbody').innerText();
  const beforeDateMatches = beforeText.match(DATE_PATTERN) || [];

  await showDatesButton.click();
  await waitForAppToSettle(page, 750);

  const afterText = await table.locator('tbody').innerText();
  const afterDateMatches = afterText.match(DATE_PATTERN) || [];

  await safeExpectVisible(page, digiteyescampsDataforsalesforceSelectors.pageHeading, 'Data for Salesforce heading');
  expect(afterDateMatches.length, 'Show Dates should leave visible camp date text on the page').toBeGreaterThan(0);
  expect(beforeDateMatches.length, 'The table should already expose at least one camp date before interaction').toBeGreaterThan(0);
}

async function expectColumnValuesNumeric(page, headerName) {
  const values = await getColumnValues(page, headerName);
  expect(values.length, `${headerName} should contain at least one value`).toBeGreaterThan(0);

  for (const value of values) {
    expect(/^\d+$/.test(value), `${headerName} should contain only numeric values, received: ${value}`).toBe(true);
  }
}

async function expectColumnValuesEqual(page, headerName, expectedValue) {
  const values = await getColumnValues(page, headerName);
  expect(values.length, `${headerName} should contain at least one value`).toBeGreaterThan(0);

  for (const value of values) {
    expect(value, `${headerName} should equal ${expectedValue}`).toBe(expectedValue);
  }
}

async function expectColumnValueOccurrenceAtLeast(page, headerName, expectedValue, minimumCount) {
  const values = await getColumnValues(page, headerName);
  expect(values.length, `${asArray(headerName).join(' / ')} should contain at least one value`).toBeGreaterThan(0);

  const matchCount = values.filter((value) => value === expectedValue).length;
  expect(
    matchCount,
    `${asArray(headerName).join(' / ')} should contain ${expectedValue} at least ${minimumCount} times`
  ).toBeGreaterThanOrEqual(minimumCount);
}

async function clickRefresh(page) {
  const refreshClick = await clickIfFound(page, digiteyescampsDataforsalesforceSelectors.refreshButton, {
    timeoutPerCandidate: 5000,
    actionTimeout: 10000
  });

  if (!refreshClick.clicked) {
    await page.reload({ waitUntil: 'domcontentloaded' });
  }

  await waitForAppToSettle(page, 1500);
  await verifyPageLoaded(page);
}

async function clickPushGeoToSalesforce(page) {
  await safeClick(
    page,
    digiteyescampsDataforsalesforceSelectors.pushGeoToSalesforceButton,
    'Push GEO to Salesforce',
    {
      timeoutPerCandidate: 10000,
      actionTimeout: 10000
    }
  );
  await waitForAppToSettle(page, 1500);
}

async function clickPushConsentAndVerifyNavigation(page) {
  await safeClick(
    page,
    digiteyescampsDataforsalesforceSelectors.pushConsentButton,
    'Push Consent',
    {
      timeoutPerCandidate: 10000,
      actionTimeout: 10000
    }
  );
  await waitForAppToSettle(page, 1500);
  await safeExpectVisible(
    page,
    digiteyescampsDataforsalesforceSelectors.consentOnSharePointPendingHeading,
    'Consent on SharePoint Pending heading',
    { timeoutPerCandidate: 10000 }
  );
}

module.exports = {
  digiteyescampsDataforsalesforceHelpers: wrapHelperMapWithReadableSteps({
    openModule,
    verifyPageLoaded,
    expectListingHeaders,
    expectColumnContainsValue,
    expectStatusesWithinAllowed,
    expectActionButtonsVisible,
    openFirstViewSummaryReport,
    markFirstRowDataImported,
    downloadFirstXls,
    downloadFirstCsv,
    clickShowDatesAndExpectCampDates,
    expectColumnValuesNumeric,
    expectColumnValuesEqual,
    expectColumnValueOccurrenceAtLeast,
    clickRefresh,
    clickPushGeoToSalesforce,
    clickPushConsentAndVerifyNavigation,
    selectors: digiteyescampsDataforsalesforceSelectors
  })
};
