const {
  openReportingModule,
  fillFieldAndExpectValue,
  clearFieldAndExpectEmpty,
  expectTableHeaders
} = require('./digiteyesreportingCommon');
const { expect } = require('@playwright/test');
const { safeClick, waitForAppToSettle } = require('./actions');
const { digiteyesreportingInternetavailabilitySelectors } = require('../selectors/digiteyesreportingInternetavailability.selectors');

async function openModule(page, data) {
  await openReportingModule(page, data, digiteyesreportingInternetavailabilitySelectors, 'Internet Availability');
}

async function verifyDateFromPresence(page) {
  await fillFieldAndExpectValue(page, digiteyesreportingInternetavailabilitySelectors.dateFromField, '2026-03-02', 'Internet Availability Date From');
}

async function clearDateFrom(page, value) {
  await fillFieldAndExpectValue(page, digiteyesreportingInternetavailabilitySelectors.dateFromField, value, 'Internet Availability Date From');
  await clearFieldAndExpectEmpty(page, digiteyesreportingInternetavailabilitySelectors.dateFromField, 'Internet Availability Date From');
}

async function verifyDateToPresence(page) {
  await fillFieldAndExpectValue(page, digiteyesreportingInternetavailabilitySelectors.dateToField, '2026-03-02', 'Internet Availability Date To');
}

async function verifyDateFromSelection(page, value) {
  await fillFieldAndExpectValue(page, digiteyesreportingInternetavailabilitySelectors.dateFromField, value, 'Internet Availability Date From');
}

async function clearDateTo(page, value) {
  await fillFieldAndExpectValue(page, digiteyesreportingInternetavailabilitySelectors.dateToField, value, 'Internet Availability Date To');
  await clearFieldAndExpectEmpty(page, digiteyesreportingInternetavailabilitySelectors.dateToField, 'Internet Availability Date To');
}

async function verifyDateToSelection(page, value) {
  await fillFieldAndExpectValue(page, digiteyesreportingInternetavailabilitySelectors.dateToField, value, 'Internet Availability Date To');
}

async function verifyHeaders(page) {
  await expectTableHeaders(
    page,
    '#Source_data thead th',
    ['Good', 'Unreliable', 'No'],
    'Internet Availability headers'
  );
}

async function runReport(page, filters = {}) {
  await fillFieldAndExpectValue(
    page,
    digiteyesreportingInternetavailabilitySelectors.dateFromField,
    filters.dateFrom || '2025-03-11',
    'Internet Availability Date From'
  );
  await fillFieldAndExpectValue(
    page,
    digiteyesreportingInternetavailabilitySelectors.dateToField,
    filters.dateTo || '2026-03-18',
    'Internet Availability Date To'
  );
  await safeClick(page, digiteyesreportingInternetavailabilitySelectors.runReportButton, 'Run Report');
  await waitForAppToSettle(page, 1000);
  await expect(page.locator('#Source_data')).toContainText(/Total Camps:\s*\d+/, { timeout: 15000 });
  await expect(page.locator('#Source_data h2')).toHaveCount(3, { timeout: 15000 });
  await verifyHeaders(page);
}

module.exports = {
  digiteyesreportingInternetavailabilityHelpers: {
    openModule,
    verifyDateFromPresence,
    verifyDateFromSelection,
    clearDateFrom,
    verifyDateToPresence,
    verifyDateToSelection,
    clearDateTo,
    verifyHeaders,
    runReport,
    selectors: digiteyesreportingInternetavailabilitySelectors
  }
};
