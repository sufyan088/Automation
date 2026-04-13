const { expect } = require('@playwright/test');
const { createDataLoaderModuleHelpers } = require('./digiteyesdataloaderCommon');
const { waitForAppToSettle } = require('./actions');
const { resolveFirst } = require('./fallback');
const { digiteyesdataloaderSfdataloadererrorcasesSelectors: SEL } = require('../selectors/digiteyesdataloaderSfdataloadererrorcases.selectors');

async function openFirstRecordInEditMode(page) {
  const { locator } = await resolveFirst(page, SEL.editIconButton, { timeoutPerCandidate: 10000 });
  await locator.first().click();
  await waitForAppToSettle(page, 1000);

  const { locator: heading } = await resolveFirst(page, SEL.editModalHeading, { timeoutPerCandidate: 10000 });
  await expect(heading.first(), 'Edit modal title should be visible').toBeVisible({ timeout: 10000 });
}

async function selectAssignmentFilter(page, type) {
  const candidates = String(type || '').toLowerCase();
  if (candidates === 'deo') {
    const { locator } = await resolveFirst(page, SEL.assignmentDeoCheckbox, { timeoutPerCandidate: 10000 });
    await locator.first().check({ force: true });
    await waitForAppToSettle(page, 500);
    return;
  }

  if (candidates === 'super-deo' || candidates === 'super deo') {
    const { locator } = await resolveFirst(page, SEL.assignmentSuperDeoCheckbox, { timeoutPerCandidate: 10000 });
    await locator.first().check({ force: true });
    await waitForAppToSettle(page, 500);
    return;
  }

  if (candidates === 'both') {
    const { locator: deo } = await resolveFirst(page, SEL.assignmentDeoCheckbox, { timeoutPerCandidate: 10000 });
    const { locator: superDeo } = await resolveFirst(page, SEL.assignmentSuperDeoCheckbox, { timeoutPerCandidate: 10000 });
    await deo.first().check({ force: true });
    await superDeo.first().check({ force: true });
    await waitForAppToSettle(page, 500);
  }
}

async function clickPaginationPage(page, pageNumber) {
  const link = page.locator(`#pg_${pageNumber}`);
  await expect(link, `Pagination link ${pageNumber} should be visible`).toBeVisible({ timeout: 10000 });
  await link.click();
  await waitForAppToSettle(page, 1200);
}

const baseHelpers = createDataLoaderModuleHelpers(SEL);

module.exports = {
  digiteyesdataloaderSfdataloadererrorcasesHelpers: {
    ...baseHelpers,
    openFirstRecordInEditMode: (page) => openFirstRecordInEditMode(page),
    selectAssignmentFilter: (page, type) => selectAssignmentFilter(page, type),
    clickPaginationPage: (page, pageNumber) => clickPaginationPage(page, pageNumber)
  }
};
