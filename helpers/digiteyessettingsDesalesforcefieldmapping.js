const {
  openSettingsModule,
  clickFirstSortableHeader,
  clickRefresh,
  expectTableHeaders
} = require('./digiteyessettingsCommon');
const { expect } = require('@playwright/test');
const { safeExpectVisible } = require('./actions');
const { digiteyessettingsDesalesforcefieldmappingSelectors } = require('../selectors/digiteyessettingsDesalesforcefieldmapping.selectors');

async function openModule(page, data) {
  await openSettingsModule(page, data, digiteyessettingsDesalesforcefieldmappingSelectors, 'DE Salesforce Field Mapping');
}

async function verifyRefreshButton(page, data) {
  await openModule(page, data);
  await clickFirstSortableHeader(page, digiteyessettingsDesalesforcefieldmappingSelectors);
  await clickRefresh(page, digiteyessettingsDesalesforcefieldmappingSelectors);
  await safeExpectVisible(page, digiteyessettingsDesalesforcefieldmappingSelectors.pageMarker, 'DE Salesforce Field Mapping table');
}

async function verifyHeaders(page, data) {
  await openModule(page, data);
  await expectTableHeaders(page, digiteyessettingsDesalesforcefieldmappingSelectors, [
    'Active',
    'DigitEYES Field Name',
    'Salesforce Field ID',
    'Salesforce Field Label'
  ]);
}

async function verifySorting(page, data) {
  await openModule(page, data);
  await clickFirstSortableHeader(page, digiteyessettingsDesalesforcefieldmappingSelectors);
  await clickFirstSortableHeader(page, digiteyessettingsDesalesforcefieldmappingSelectors);
  await safeExpectVisible(page, digiteyessettingsDesalesforcefieldmappingSelectors.pageMarker, 'DE Salesforce Field Mapping table after sorting');
}

async function verifySinglePageRecords(page, data) {
  await openModule(page, data);
  const summary = await page.locator('#datatable thead:nth-of-type(2) tr th:first-child').textContent();
  const match = String(summary || '').replace(/\s+/g, ' ').trim().match(/Showing\s*:?\s*(\d+)\s*-\s*(\d+)\s*of\s*(\d+)/i);
  expect(match, 'DE Salesforce summary should expose a single-page record count').not.toBeNull();
  expect(Number(match[1])).toBe(1);
  expect(Number(match[2])).toBe(Number(match[3]));
}

module.exports = {
  digiteyessettingsDesalesforcefieldmappingHelpers: {
    openModule,
    verifyHeaders,
    verifySorting,
    verifyRefreshButton,
    verifySinglePageRecords,
    selectors: digiteyessettingsDesalesforcefieldmappingSelectors
  }
};
