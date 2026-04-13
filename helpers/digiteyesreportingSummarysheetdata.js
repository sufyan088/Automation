const {
  openReportingModule,
  fillFieldAndExpectValue,
  getSelectedOptionText,
  selectDropdownOption,
  expectTableHeaders
} = require('./digiteyesreportingCommon');
const { safeExpectVisible, waitForAppToSettle } = require('./actions');
const { expect } = require('@playwright/test');
const { digiteyesreportingSummarysheetdataSelectors } = require('../selectors/digiteyesreportingSummarysheetdata.selectors');

async function openModule(page, data) {
  await openReportingModule(page, data, digiteyesreportingSummarysheetdataSelectors, 'Summary Sheet Data');
}

async function verifySummarySheetDataPage(page) {
  await safeExpectVisible(page, digiteyesreportingSummarysheetdataSelectors.summaryHeading, 'Summary heading');
  await safeExpectVisible(page, digiteyesreportingSummarysheetdataSelectors.refreshButton, 'Refresh button');
  await safeExpectVisible(page, digiteyesreportingSummarysheetdataSelectors.dateFromField, 'Date From field');
  await safeExpectVisible(page, digiteyesreportingSummarysheetdataSelectors.dateToField, 'Date To field');
  await safeExpectVisible(page, digiteyesreportingSummarysheetdataSelectors.themeField, 'All Themes dropdown');
  await safeExpectVisible(page, digiteyesreportingSummarysheetdataSelectors.runReportButton, 'Run Report button');
  await safeExpectVisible(page, digiteyesreportingSummarysheetdataSelectors.exportXlsButton, 'Export Xls button');
  await safeExpectVisible(page, digiteyesreportingSummarysheetdataSelectors.countryField, 'Country dropdown');
}

async function verifyCountryDropdown(page, expectedCountry = 'India') {
  expect(await getSelectedOptionText(page, digiteyesreportingSummarysheetdataSelectors.countryField)).toContain(expectedCountry);
}

async function verifyThemeSelection(page, theme) {
  await selectDropdownOption(page, digiteyesreportingSummarysheetdataSelectors.themeField, theme, 'Summary Sheet Data theme');
}

async function verifyResultHeaders(page) {
  await expectTableHeaders(
    page,
    '#tblSummaryData thead th',
    ['Location', 'Camp Name', 'Country', 'Impact Theme', 'Start Date', 'End Date', 'IP Name'],
    'Summary Sheet Data headers'
  );
}

async function runThemeReport(page, filters = {}) {
  await fillFieldAndExpectValue(
    page,
    digiteyesreportingSummarysheetdataSelectors.dateFromField,
    filters.dateFrom || '2026-02-27',
    'Summary Sheet Data Date From'
  );
  await fillFieldAndExpectValue(
    page,
    digiteyesreportingSummarysheetdataSelectors.dateToField,
    filters.dateTo || '2026-03-04',
    'Summary Sheet Data Date To'
  );
  await selectDropdownOption(
    page,
    digiteyesreportingSummarysheetdataSelectors.themeField,
    filters.theme || 'S2S',
    'Summary Sheet Data theme'
  );
  await page.locator('#frmDates button.btn.btn-sm.btn-primary').first().click();
  await waitForAppToSettle(page, 1000);
  await expect(page.locator('#tblSummaryData')).toBeVisible({ timeout: 15000 });
  await verifyResultHeaders(page);
}

module.exports = {
  digiteyesreportingSummarysheetdataHelpers: {
    openModule,
    verifySummarySheetDataPage,
    verifyCountryDropdown,
    verifyThemeSelection,
    verifyResultHeaders,
    runThemeReport,
    selectors: digiteyesreportingSummarysheetdataSelectors
  }
};
