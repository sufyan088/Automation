const { expect } = require('@playwright/test');
const { createDataLoaderModuleHelpers } = require('./digiteyesdataloaderCommon');
const { safeExpectVisible, waitForAppToSettle } = require('./actions');
const { resolveFirst } = require('./fallback');
const { digiteyesdataloaderDataforsalesforceSelectors: SEL } = require('../selectors/digiteyesdataloaderDataforsalesforce.selectors');

async function verifySearchFilterHeadingVisible(page) {
  await safeExpectVisible(page, SEL.searchFilterHeading, 'Camp Cluster Data Search / Filter heading', {
    timeoutPerCandidate: 10000
  });
}

async function closeSearchFilterWithXButton(page) {
  const { locator } = await resolveFirst(page, SEL.searchFilterXButton, { timeoutPerCandidate: 10000 });
  await locator.click();
  await waitForAppToSettle(page, 750);
  const { locator: modal } = await resolveFirst(page, SEL.searchFilterModal, {
    timeoutPerCandidate: 5000,
    mustBeVisible: false
  });
  await expect(modal, 'Search / Filter modal should be hidden after clicking X').toBeHidden({ timeout: 10000 });
}

async function verifyDataImportedCheckboxesPresent(page) {
  const { locator: pending } = await resolveFirst(page, SEL.dataImportedPendingRadio, { timeoutPerCandidate: 10000 });
  await expect(pending.first(), 'Pending radio should be present').toBeVisible({ timeout: 10000 });

  const { locator: marked } = await resolveFirst(page, SEL.dataImportedMarkedRadio, { timeoutPerCandidate: 10000 });
  await expect(marked.first(), 'Already Done (Marked) radio should be present').toBeVisible({ timeout: 10000 });

  const { locator: all } = await resolveFirst(page, SEL.dataImportedAllRadio, { timeoutPerCandidate: 10000 });
  await expect(all.first(), 'ALL radio should be present').toBeVisible({ timeout: 10000 });
}

async function applyFilterWithDataImportedStatus(page, status) {
  if (status === 'Marked') {
    const { locator } = await resolveFirst(page, SEL.dataImportedMarkedRadio, { timeoutPerCandidate: 10000 });
    await locator.first().click();
    await waitForAppToSettle(page, 500);
  } else if (status === 'All') {
    const { locator } = await resolveFirst(page, SEL.dataImportedAllRadio, { timeoutPerCandidate: 10000 });
    await locator.first().click();
    await waitForAppToSettle(page, 500);
  }
  // 'Pending' is the default – no radio click needed
  const { locator: applyBtn } = await resolveFirst(page, SEL.searchApplyButton, { timeoutPerCandidate: 10000 });
  await applyBtn.click();
  await waitForAppToSettle(page, 1500);
}

const baseHelpers = createDataLoaderModuleHelpers(SEL);

module.exports = {
  digiteyesdataloaderDataforsalesforceHelpers: {
    ...baseHelpers,
    verifySearchFilterHeadingVisible: (page) => verifySearchFilterHeadingVisible(page),
    closeSearchFilterWithXButton: (page) => closeSearchFilterWithXButton(page),
    verifyDataImportedCheckboxesPresent: (page) => verifyDataImportedCheckboxesPresent(page),
    applyFilterWithDataImportedStatus: (page, status) => applyFilterWithDataImportedStatus(page, status)
  }
};
