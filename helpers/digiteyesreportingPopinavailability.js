const {
  openReportingModule,
  fillFieldAndExpectValue,
  expectDropdownOptions,
  getSelectedOptionText,
  selectDropdownOption,
  expectTableHeaders
} = require('./digiteyesreportingCommon');
const { expect } = require('@playwright/test');
const { safeClick, waitForAppToSettle } = require('./actions');
const { digiteyesreportingPopinavailabilitySelectors } = require('../selectors/digiteyesreportingPopinavailability.selectors');

async function openModule(page, data) {
  await openReportingModule(page, data, digiteyesreportingPopinavailabilitySelectors, 'Popins Availability');
}

async function verifyDateFromPresence(page) {
  await fillFieldAndExpectValue(page, digiteyesreportingPopinavailabilitySelectors.dateFromField, '2026-03-02', 'Popins Availability Date From');
}

async function verifyDateToPresence(page) {
  await fillFieldAndExpectValue(page, digiteyesreportingPopinavailabilitySelectors.dateToField, '2026-03-02', 'Popins Availability Date To');
}

async function verifyThemeDropdown(page) {
  await expectDropdownOptions(
    page,
    digiteyesreportingPopinavailabilitySelectors.themeField,
    ['S2E', 'S2L', 'S2S'],
    'Popins theme dropdown'
  );
  expect(await getSelectedOptionText(page, digiteyesreportingPopinavailabilitySelectors.themeField)).toMatch(/all\s*theme/i);
}

async function verifyThemeSelection(page, theme) {
  await selectDropdownOption(page, digiteyesreportingPopinavailabilitySelectors.themeField, theme, 'Popins theme');
}

async function verifyCountryDropdown(page, expectedCountry = 'India') {
  expect(await getSelectedOptionText(page, digiteyesreportingPopinavailabilitySelectors.countryField)).toContain(expectedCountry);
}

async function verifyTopHeaders(page) {
  await expectTableHeaders(
    page,
    '#datatable thead th',
    ['Camp Ref.', 'Camp Date', 'Location', 'Outreach Incharge', 'Asst. Manager', 'Popins'],
    'Popins Availability headers'
  );
}

async function runThemeReport(page, filters = {}) {
  await fillFieldAndExpectValue(
    page,
    digiteyesreportingPopinavailabilitySelectors.dateFromField,
    filters.dateFrom || '2026-02-10',
    'Popins Availability Date From'
  );
  await fillFieldAndExpectValue(
    page,
    digiteyesreportingPopinavailabilitySelectors.dateToField,
    filters.dateTo || '2026-03-04',
    'Popins Availability Date To'
  );
  await selectDropdownOption(
    page,
    digiteyesreportingPopinavailabilitySelectors.themeField,
    filters.theme || 'S2S',
    'Popins theme'
  );
  await safeClick(page, digiteyesreportingPopinavailabilitySelectors.runReportButton, 'Run Report');
  await waitForAppToSettle(page, 1000);
  await expect(page.locator('#Source_data')).toContainText(/Total Camps:\s*\d+/, { timeout: 15000 });
  await verifyTopHeaders(page);
}

module.exports = {
  digiteyesreportingPopinavailabilityHelpers: {
    openModule,
    verifyDateFromPresence,
    verifyDateToPresence,
    verifyThemeDropdown,
    verifyThemeSelection,
    verifyCountryDropdown,
    verifyTopHeaders,
    runThemeReport,
    selectors: digiteyesreportingPopinavailabilitySelectors
  }
};
