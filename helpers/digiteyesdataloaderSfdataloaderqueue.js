const { safeExpectVisible, waitForAppToSettle } = require('./actions');
const { resolveFirst } = require('./fallback');
const { createDataLoaderModuleHelpers } = require('./digiteyesdataloaderCommon');
const { digiteyesdataloaderSfdataloaderqueueSelectors: SEL } = require('../selectors/digiteyesdataloaderSfdataloaderqueue.selectors');
const { wrapHelperMapWithReadableSteps } = require('./clientReadableSteps');

async function verifySearchFilterHeadingVisible(page) {
  await safeExpectVisible(page, SEL.searchFilterHeading, 'Queue Search / Filter heading', {
    timeoutPerCandidate: 10000
  });
}

async function applyFilterWithDataImportedStatus(page, status) {
  const normalized = String(status || '').toLowerCase();

  if (normalized === 'marked' || normalized === 'already-done' || normalized === 'already done') {
    const { locator } = await resolveFirst(page, SEL.dataImportedMarkedRadio, { timeoutPerCandidate: 10000 });
    await locator.first().click();
    await waitForAppToSettle(page, 500);
  } else if (normalized === 'all') {
    const { locator } = await resolveFirst(page, SEL.dataImportedAllRadio, { timeoutPerCandidate: 10000 });
    await locator.first().click();
    await waitForAppToSettle(page, 500);
  }

  const { locator: applyButton } = await resolveFirst(page, SEL.searchApplyButton, { timeoutPerCandidate: 10000 });
  await applyButton.click();
  await waitForAppToSettle(page, 1500);
}

const baseHelpers = createDataLoaderModuleHelpers(SEL);

module.exports = {
  digiteyesdataloaderSfdataloaderqueueHelpers: wrapHelperMapWithReadableSteps({
    ...baseHelpers,
    verifySearchFilterHeadingVisible: (page) => verifySearchFilterHeadingVisible(page),
    applyFilterWithDataImportedStatus: (page, status) => applyFilterWithDataImportedStatus(page, status)
  })
};
