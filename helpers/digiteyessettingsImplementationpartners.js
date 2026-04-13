const {
  openSettingsModule,
  openSearchFilter,
  selectDropdownValue,
  getSelectedOptionText,
  clickApplySearch,
  clickCloseSearch,
  openAddForm,
  fillSearchField,
  setPageSize,
  expectPageSizeOptions,
  clickPagination,
  expectPaginationSummary,
  clickResultRow
} = require('./digiteyessettingsCommon');
const { expect } = require('@playwright/test');
const { safeExpectVisible, safeClick } = require('./actions');
const { digiteyessettingsImplementationpartnersSelectors } = require('../selectors/digiteyessettingsImplementationpartners.selectors');

async function openModule(page, data) {
  await openSettingsModule(page, data, digiteyessettingsImplementationpartnersSelectors, 'Implementation Partners');
}

async function verifyPaginationFunctionality(page, data) {
  await openModule(page, data);
  await expectPageSizeOptions(page, digiteyessettingsImplementationpartnersSelectors, [
    'Show: 5',
    'Show: 10',
    'Show: 25',
    'Show: 50',
    'Show: 100'
  ]);

  await setPageSize(page, digiteyessettingsImplementationpartnersSelectors, 25);
  await setPageSize(page, digiteyessettingsImplementationpartnersSelectors, 5);
  await setPageSize(page, digiteyessettingsImplementationpartnersSelectors, 100);
  await setPageSize(page, digiteyessettingsImplementationpartnersSelectors, 50);
  await setPageSize(page, digiteyessettingsImplementationpartnersSelectors, 10);
}

async function verifyNextAndLastNavigation(page, data) {
  await openModule(page, data);
  await fillSearchField(
    page,
    digiteyessettingsImplementationpartnersSelectors.partnerNameField,
    'TesterQA11',
    'Partner Name'
  );
  await fillSearchField(
    page,
    digiteyessettingsImplementationpartnersSelectors.salesforceCodeField,
    '1234asdf',
    'Salesforce Code'
  );

  await setPageSize(page, digiteyessettingsImplementationpartnersSelectors, 5);
  await clickPagination(page, digiteyessettingsImplementationpartnersSelectors, 'next');
  await expectPaginationSummary(page, digiteyessettingsImplementationpartnersSelectors);
  await clickPagination(page, digiteyessettingsImplementationpartnersSelectors, 'last');
  await expectPaginationSummary(page, digiteyessettingsImplementationpartnersSelectors);
}

async function verifySearchFilterButton(page, data) {
  await openModule(page, data);
  await openSearchFilter(page, digiteyessettingsImplementationpartnersSelectors);
  await safeExpectVisible(page, digiteyessettingsImplementationpartnersSelectors.searchForm, 'Implementation Partners search form');
}

async function verifyAddSection(page, data) {
  await openModule(page, data);
  await safeExpectVisible(page, digiteyessettingsImplementationpartnersSelectors.saveButton, 'Implementation Partner Save button');
}

async function verifySearchStatusOption(page, data, expectedValue) {
  await openModule(page, data);
  await openSearchFilter(page, digiteyessettingsImplementationpartnersSelectors);
  await selectDropdownValue(page, digiteyessettingsImplementationpartnersSelectors.searchCountryField, data.visionSpringCountry, 'Country');
  await fillSearchField(page, digiteyessettingsImplementationpartnersSelectors.searchPartnerNameField, 'TesterQA', 'Partner Name');
  await selectDropdownValue(page, digiteyessettingsImplementationpartnersSelectors.searchStatusField, expectedValue, 'Active');
  expect(await getSelectedOptionText(page, digiteyessettingsImplementationpartnersSelectors.searchStatusField)).toContain(expectedValue);
}

async function verifySearchCloseButton(page, data) {
  await openModule(page, data);
  await openSearchFilter(page, digiteyessettingsImplementationpartnersSelectors);
  await safeExpectVisible(page, digiteyessettingsImplementationpartnersSelectors.closeButton, 'Search Close button');
  await clickCloseSearch(page, digiteyessettingsImplementationpartnersSelectors);
  await safeExpectVisible(page, digiteyessettingsImplementationpartnersSelectors.pageMarker, 'Implementation Partners listing after closing search');
}

async function verifyApplySearch(page, data) {
  await openModule(page, data);
  await openSearchFilter(page, digiteyessettingsImplementationpartnersSelectors);
  await selectDropdownValue(page, digiteyessettingsImplementationpartnersSelectors.searchCountryField, data.visionSpringCountry, 'Country');
  await fillSearchField(page, digiteyessettingsImplementationpartnersSelectors.searchPartnerNameField, 'TesterQA', 'Partner Name');
  await selectDropdownValue(page, digiteyessettingsImplementationpartnersSelectors.searchStatusField, 'No', 'Active');
  await clickApplySearch(page, digiteyessettingsImplementationpartnersSelectors);
  await expect(page.locator('#datatable')).toContainText('TesterQA', { timeout: 10000 });
}

async function verifyEditCancel(page, data) {
  await openModule(page, data);
  await openSearchFilter(page, digiteyessettingsImplementationpartnersSelectors);
  await selectDropdownValue(page, digiteyessettingsImplementationpartnersSelectors.searchCountryField, data.visionSpringCountry, 'Country');
  await fillSearchField(page, digiteyessettingsImplementationpartnersSelectors.searchPartnerNameField, 'TesterQA1', 'Partner Name');
  await selectDropdownValue(page, digiteyessettingsImplementationpartnersSelectors.searchStatusField, 'No', 'Active');
  await clickApplySearch(page, digiteyessettingsImplementationpartnersSelectors);
  await clickResultRow(page, digiteyessettingsImplementationpartnersSelectors, 'Filtered Implementation Partner row');
  await safeExpectVisible(page, digiteyessettingsImplementationpartnersSelectors.cancelButton, 'Edit form Cancel button');
  await safeClick(page, digiteyessettingsImplementationpartnersSelectors.cancelButton, 'Cancel edit');
  await safeExpectVisible(page, digiteyessettingsImplementationpartnersSelectors.pageMarker, 'Implementation Partners listing after cancel');
}

async function verifyAddCancel(page, data) {
  await openModule(page, data);
  await safeExpectVisible(page, digiteyessettingsImplementationpartnersSelectors.cancelButton, 'Add form Cancel button');
  await safeClick(page, digiteyessettingsImplementationpartnersSelectors.cancelButton, 'Cancel add');
  await safeExpectVisible(page, digiteyessettingsImplementationpartnersSelectors.pageMarker, 'Implementation Partners listing after cancel');
}

async function verifyPreviousAndFirstNavigation(page, data) {
  await openModule(page, data);
  await setPageSize(page, digiteyessettingsImplementationpartnersSelectors, 5);
  await clickPagination(page, digiteyessettingsImplementationpartnersSelectors, 'next');
  await expectPaginationSummary(page, digiteyessettingsImplementationpartnersSelectors);
  if (await page.locator('#pp_2, a[id^="pp_"]').first().isVisible().catch(() => false)) {
    await clickPagination(page, digiteyessettingsImplementationpartnersSelectors, 'previous');
  }
  await expectPaginationSummary(page, digiteyessettingsImplementationpartnersSelectors);
  if (await page.locator('#pp_1, a[id^="pp_"]').first().isVisible().catch(() => false)) {
    await clickPagination(page, digiteyessettingsImplementationpartnersSelectors, 'first');
  }
  await expectPaginationSummary(page, digiteyessettingsImplementationpartnersSelectors);
}

module.exports = {
  digiteyessettingsImplementationpartnersHelpers: {
    openModule,
    verifySearchFilterButton,
    verifyAddSection,
    verifySearchStatusOption,
    verifySearchCloseButton,
    verifyApplySearch,
    verifyEditCancel,
    verifyAddCancel,
    verifyPaginationFunctionality,
    verifyNextAndLastNavigation,
    verifyPreviousAndFirstNavigation,
    selectors: digiteyessettingsImplementationpartnersSelectors
  }
};
