const {
  openReportingMenu,
  openReportingModule,
  openSearchFilter,
  closeSearchFilter,
  fillFieldAndExpectValue,
  clearFieldAndExpectEmpty,
  applySearch,
  resetSearch,
  expectTextVisible,
  clickExportAndAssert,
  expectTableHeaders
} = require('./digiteyesreportingCommon');
const { expect } = require('@playwright/test');
const { resolveFirst } = require('./fallback');
const { digiteyesreportingWorkreportvsteamsSelectors } = require('../selectors/digiteyesreportingWorkreportvsteams.selectors');

async function getSelectedOptionText(page, fieldSelectors) {
  const { locator } = await resolveFirst(page, fieldSelectors);
  return locator.locator('option:checked').textContent();
}

async function verifyMenu(page, data) {
  await openReportingMenu(page, data, digiteyesreportingWorkreportvsteamsSelectors);
}

async function verifyReportingMenuOptions(page, data) {
  await openReportingMenu(page, data, digiteyesreportingWorkreportvsteamsSelectors);
  await expectTextVisible(page, 'Camp Trends', 'Camp Trends link');
  await expectTextVisible(page, 'Work Report - VS Teams', 'Work Report - VS Teams link');
  await expectTextVisible(page, 'Work Report - IP Teams', 'Work Report - IP Teams link');
  await expectTextVisible(page, 'Internet Availability', 'Internet Availability link');
  await expectTextVisible(page, 'Popins Availability', 'Popins Availability link');
  await expectTextVisible(page, 'Summary Sheet Data', 'Summary Sheet Data link');
}

async function openModule(page, data) {
  await openReportingModule(page, data, digiteyesreportingWorkreportvsteamsSelectors, 'Work Report - VS Teams');
}

async function verifyModulePage(page) {
  await expectTextVisible(page, 'Search / Filter', 'VS Teams page');
}

async function verifySearchFilter(page) {
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
}

async function closeSearch(page) {
  await closeSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
}

async function verifyCountryDropdown(page, expectedCountry = 'India') {
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
  const selectedCountry = await getSelectedOptionText(page, digiteyesreportingWorkreportvsteamsSelectors.countryField);
  expect(String(selectedCountry || '')).toContain(expectedCountry);
}

async function verifyProjectCodeField(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportvsteamsSelectors.projectCodeField, value, 'Project Code');
}

async function applyProjectCodeFilter(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportvsteamsSelectors.projectCodeField, value, 'Project Code');
  await applySearch(page, digiteyesreportingWorkreportvsteamsSelectors);
  await expectTextVisible(page, 'Search / Filter', 'VS Teams page after apply');
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
  const { locator } = await resolveFirst(page, digiteyesreportingWorkreportvsteamsSelectors.projectCodeField);
  await expect(locator).toHaveValue(value, { timeout: 10000 });
}

async function filterByAssistantManager(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportvsteamsSelectors.assistantManagerField, value, 'Assistant Manager');
  await applySearch(page, digiteyesreportingWorkreportvsteamsSelectors);
}

async function filterByInvalidAssistantManager(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportvsteamsSelectors.assistantManagerField, value, 'Invalid Assistant Manager');
  await applySearch(page, digiteyesreportingWorkreportvsteamsSelectors);
  await expectTextVisible(page, '(0) Records Found.', 'No records found');
}

async function filterByUserEmail(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportvsteamsSelectors.userEmailField, value, 'User Email');
  await applySearch(page, digiteyesreportingWorkreportvsteamsSelectors);
  await expectTextVisible(page, value, 'User Email result');
}

async function filterByOutreachIncharge(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportvsteamsSelectors.outreachInchargeField, value, 'Outreach Incharge');
  await applySearch(page, digiteyesreportingWorkreportvsteamsSelectors);
  await expectTextVisible(page, value, 'Outreach Incharge result');
}

async function verifyReset(page, value = 'JHJ9889') {
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportvsteamsSelectors.assistantManagerField, value, 'Assistant Manager');
  await resetSearch(page, digiteyesreportingWorkreportvsteamsSelectors);
  await clearFieldAndExpectEmpty(page, digiteyesreportingWorkreportvsteamsSelectors.assistantManagerField, 'Assistant Manager');
}

async function verifyDateFrom(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportvsteamsSelectors.dateFromField, value, 'Date From');
  await applySearch(page, digiteyesreportingWorkreportvsteamsSelectors);
  await expectTextVisible(page, 'Search / Filter', 'VS Teams page after Date From apply');
}

async function verifyDateTo(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportvsteamsSelectors);
  // Clear Date From first to avoid date-range constraint rejecting Date To fill
  const dateFromLocator = page.locator('#frmSearch:visible #search_datefrom').first();
  await dateFromLocator.fill('').catch(() => {});
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportvsteamsSelectors.dateToField, value, 'Date To');
  await applySearch(page, digiteyesreportingWorkreportvsteamsSelectors);
  await expectTextVisible(page, 'Search / Filter', 'VS Teams page after Date To apply');
}

async function verifyTopHeaders(page) {
  await expectTableHeaders(
    page,
    digiteyesreportingWorkreportvsteamsSelectors.tableHeaderCells,
    ['Reg. Date', 'Camp Ref.', 'Location', 'Outreach Incharge', 'Asst. Manager', '#Regs'],
    'VS Teams top headers'
  );
}

async function verifyRegistrationHeaders(page) {
  await expectTableHeaders(
    page,
    digiteyesreportingWorkreportvsteamsSelectors.tableHeaderCells,
    ['Email ID', '#Camps', '#Participant'],
    'VS Teams registration headers'
  );
}

async function exportReport(page) {
  await clickExportAndAssert(page, digiteyesreportingWorkreportvsteamsSelectors);
}

module.exports = {
  digiteyesreportingWorkreportvsteamsHelpers: {
    verifyMenu,
    verifyReportingMenuOptions,
    openModule,
    verifyModulePage,
    verifySearchFilter,
    closeSearch,
    verifyCountryDropdown,
    verifyProjectCodeField,
    applyProjectCodeFilter,
    filterByAssistantManager,
    filterByInvalidAssistantManager,
    verifyReset,
    filterByUserEmail,
    filterByOutreachIncharge,
    verifyDateFrom,
    verifyDateTo,
    verifyTopHeaders,
    verifyRegistrationHeaders,
    exportReport,
    selectors: digiteyesreportingWorkreportvsteamsSelectors
  }
};
