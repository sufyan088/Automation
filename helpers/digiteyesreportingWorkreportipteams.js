const {
  openReportingModule,
  openSearchFilter,
  closeSearchFilter,
  fillFieldAndExpectValue,
  clearFieldAndExpectEmpty,
  applySearch,
  resetSearch,
  expectTextVisible,
  expectTableHeaders,
  getSelectedOptionText,
  getDropdownOptions,
  selectDropdownOption
} = require('./digiteyesreportingCommon');
const { expect } = require('@playwright/test');
const { waitForAppToSettle } = require('./actions');
const { resolveFirst } = require('./fallback');
const { digiteyesreportingWorkreportipteamsSelectors } = require('../selectors/digiteyesreportingWorkreportipteams.selectors');

async function openModule(page, data) {
  await openReportingModule(page, data, digiteyesreportingWorkreportipteamsSelectors, 'Work Report - IP Teams');
}

async function verifyModulePage(page) {
  await expectTableHeaders(
    page,
    digiteyesreportingWorkreportipteamsSelectors.tableHeaderCells,
    ['Reg. Date', 'Camp Ref.', 'Location', 'IP Name', 'IP Team', '#Regs'],
    'Work Report - IP Teams headers'
  );
}

async function verifySearchFilter(page) {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
}

async function verifyCountryDropdown(page, expectedCountry = 'India') {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  expect(await getSelectedOptionText(page, digiteyesreportingWorkreportipteamsSelectors.countryField)).toContain(expectedCountry);
}

async function verifyProjectCodeField(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportipteamsSelectors.projectCodeField, value, 'Project Code');
  await applySearch(page, digiteyesreportingWorkreportipteamsSelectors);
  await expectTextVisible(page, 'Search / Filter', 'Work Report - IP Teams page after apply');
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  const { locator } = await resolveFirst(page, digiteyesreportingWorkreportipteamsSelectors.projectCodeField);
  await expect(locator).toHaveValue(value, { timeout: 10000 });
}

async function verifyUserNameField(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportipteamsSelectors.userNameField, value, 'User Name');
  await applySearch(page, digiteyesreportingWorkreportipteamsSelectors);
}

async function verifyReset(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportipteamsSelectors.userNameField, value, 'User Name');
  await resetSearch(page, digiteyesreportingWorkreportipteamsSelectors);
  await clearFieldAndExpectEmpty(page, digiteyesreportingWorkreportipteamsSelectors.userNameField, 'User Name');
}

async function closeSearch(page) {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await closeSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
}

async function verifyDateFrom(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportipteamsSelectors.dateFromField, value, 'Date From');
  await applySearch(page, digiteyesreportingWorkreportipteamsSelectors);
}

async function verifyDateFromSelection(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportipteamsSelectors.dateFromField, value, 'Date From');
}

async function clearDateFrom(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportipteamsSelectors.dateFromField, value, 'Date From');
  await resetSearch(page, digiteyesreportingWorkreportipteamsSelectors);
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await clearFieldAndExpectEmpty(page, digiteyesreportingWorkreportipteamsSelectors.dateFromField, 'Date From');
}

async function verifyDateTo(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportipteamsSelectors.dateToField, value, 'Date To');
  await applySearch(page, digiteyesreportingWorkreportipteamsSelectors);
}

async function clearDateTo(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportipteamsSelectors.dateToField, value, 'Date To');
  await resetSearch(page, digiteyesreportingWorkreportipteamsSelectors);
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await clearFieldAndExpectEmpty(page, digiteyesreportingWorkreportipteamsSelectors.dateToField, 'Date To');
}

async function verifyIpPartnerDropdown(page, option = 'Implementation Partner') {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  const selectedOption = await selectDropdownOption(page, digiteyesreportingWorkreportipteamsSelectors.ipPartnerField, option, 'IP Partner');
  await applySearch(page, digiteyesreportingWorkreportipteamsSelectors);
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  expect(await getSelectedOptionText(page, digiteyesreportingWorkreportipteamsSelectors.ipPartnerField)).toContain(selectedOption);
}

async function verifyIpTeamDropdown(page, partnerOption = 'Implementation Partner') {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await selectDropdownOption(page, digiteyesreportingWorkreportipteamsSelectors.ipPartnerField, partnerOption, 'IP Partner');
  await waitForAppToSettle(page, 1000);

  const options = await getDropdownOptions(page, digiteyesreportingWorkreportipteamsSelectors.ipTeamField);
  const firstSpecificOption = options.find((option) => option.value && !/^all\s+/i.test(option.text) && !/^--/.test(option.text));

  if (firstSpecificOption) {
    await selectDropdownOption(page, digiteyesreportingWorkreportipteamsSelectors.ipTeamField, firstSpecificOption.text, 'IP Team');
  } else {
    expect(options.map((option) => option.text)).toContain('All IP Teams');
  }

  await applySearch(page, digiteyesreportingWorkreportipteamsSelectors);
}

async function verifyInvalidProjectCode(page, value) {
  await openSearchFilter(page, digiteyesreportingWorkreportipteamsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingWorkreportipteamsSelectors.projectCodeField, value, 'Invalid Project Code');
  await applySearch(page, digiteyesreportingWorkreportipteamsSelectors);
  await expectTextVisible(page, '(0) Records Found.', 'No records found');
}

async function verifyRegistrationHeaders(page) {
  await expectTableHeaders(
    page,
    digiteyesreportingWorkreportipteamsSelectors.tableHeaderCells,
    ['Email ID', '#Camps', '#Participant'],
    'Registration headers'
  );
}

module.exports = {
  digiteyesreportingWorkreportipteamsHelpers: {
    openModule,
    verifyModulePage,
    verifySearchFilter,
    verifyCountryDropdown,
    verifyProjectCodeField,
    verifyUserNameField,
    verifyReset,
    closeSearch,
    verifyDateFrom,
    verifyDateFromSelection,
    clearDateFrom,
    verifyDateTo,
    clearDateTo,
    verifyIpPartnerDropdown,
    verifyIpTeamDropdown,
    verifyInvalidProjectCode,
    verifyRegistrationHeaders,
    selectors: digiteyesreportingWorkreportipteamsSelectors
  }
};
