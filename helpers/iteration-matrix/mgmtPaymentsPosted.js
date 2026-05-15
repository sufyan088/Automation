const { expect } = require('@playwright/test');
const { clickWithFallback, expectVisibleWithFallback, fillWithFallback } = require('../fallback');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { mgmtPaymentsPostedSelectors } = require('../../selectors/iteration-matrix/mgmtPaymentsPosted.selectors.js');

async function isVisible(page, candidates, timeout = 1500) {
  try {
    await expectVisibleWithFallback(page, candidates, { expectTimeout: timeout, timeoutPerCandidate: timeout });
    return true;
  } catch {
    return false;
  }
}

function getDialog(page) {
  return page.locator('[role="dialog"]').last();
}

function getOpenDialog(page) {
  return page.locator('[role="dialog"]').filter({ has: page.locator('[role="listbox"], [role="option"], input[role="combobox"], [cmdk-list]') }).last();
}

function getFilterTriggerByLabel(page, labelText) {
  if (labelText === 'Customers:*') {
    return page.locator('xpath=//*[starts-with(normalize-space(text()),"Customers:")]/following::*[self::button or @role="combobox"][1]').first();
  }

  return page.locator(`xpath=//*[normalize-space(text())="${labelText}"]/following::*[self::button or @role="combobox"][1]`).first();
}

function getFilterTriggerFallbacks(page, labelText) {
  const triggerTextsByLabel = {
    'Year:': [/^current$/i],
    'Module:': [/^All modules selected$/i],
    'Customers:*': [/^All modules customers selected$/i, /^All customers selected$/i],
    'Month:': [/^All months selected$/i],
    'Quarter:': [/^All quarters selected$/i, /^Select All Quarters$/i]
  };

  return (triggerTextsByLabel[labelText] || []).map((pattern) => page.locator('button, [role="combobox"]').filter({ hasText: pattern }).first());
}

async function clickLocatorIfEnabled(locator) {
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  if (await locator.isDisabled().catch(() => false)) {
    return false;
  }

  await locator.click({ timeout: 10000, force: true });
  return true;
}

async function clickVisibleText(page, values) {
  for (const value of values) {
    for (const scope of [getOpenDialog(page), getDialog(page), page.locator('body')]) {
      const locator = scope.getByText(value, { exact: true }).first();
      if (!(await locator.isVisible().catch(() => false))) {
        continue;
      }

      await locator.click({ timeout: 10000, force: true });
      return true;
    }
  }

  return false;
}

async function collectVisibleOptionTexts(page) {
  const dialog = getOpenDialog(page);
  const root = (await dialog.count().catch(() => 0)) > 0 ? dialog : page.locator('body');
  const texts = await root.locator('[role="option"], [cmdk-item], [data-value]').evaluateAll((nodes) => nodes.map((node) => (node.textContent || '').trim()).filter(Boolean));
  return [...new Set(texts.map((text) => text.replace(/\s+/g, ' ').trim()))].filter(Boolean);
}

async function clickFilterTrigger(page, labelText) {
  for (const fallback of getFilterTriggerFallbacks(page, labelText)) {
    if (!(await fallback.isVisible().catch(() => false))) {
      continue;
    }

    await fallback.click({ timeout: 10000, force: true });
    return;
  }

  const trigger = getFilterTriggerByLabel(page, labelText);
  await clickLocatorIfEnabled(trigger);
}

async function openCustomerOptions(page) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await clickFilterTrigger(page, 'Customers:*');

    const opened = await isVisible(page, mgmtPaymentsPostedSelectors.filters.customerSearchInput, 5000);
    if (opened) {
      return;
    }
  }

  throw new Error('Could not open the customers dropdown options for payments posted.');
}

async function openModuleOptions(page) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await clickFilterTrigger(page, 'Module:');
    const opened = await expect.poll(async () => (await collectVisibleOptionTexts(page)).length, { timeout: 10000 }).toBeGreaterThan(0).then(() => true).catch(() => false);
    if (opened) {
      return;
    }
  }

  throw new Error('Could not open the module dropdown options for payments posted.');
}

async function openModule(page) {
  const { navigation, page: pageSelectors } = mgmtPaymentsPostedSelectors;

  if (!(await isVisible(page, navigation.adminHeading))) {
    await clickWithFallback(page, navigation.adminModule, { actionTimeout: 15000, timeoutPerCandidate: 2500 });
    await expectVisibleWithFallback(page, navigation.adminHeading, { expectTimeout: 20000, timeoutPerCandidate: 2500 });
  }

  await clickWithFallback(page, navigation.mgmtInformationSystemLink, { actionTimeout: 15000, timeoutPerCandidate: 2500 });

  if (!(await isVisible(page, navigation.paymentsPostedHeading, 4000)) && (await isVisible(page, navigation.paymentsPostedTab, 1500))) {
    await clickWithFallback(page, navigation.paymentsPostedTab, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  }

  await expectVisibleWithFallback(page, navigation.paymentsPostedHeading, { expectTimeout: 20000, timeoutPerCandidate: 2500 });
  if (!(await isVisible(page, pageSelectors.adjustFiltersButton, 2000))) {
    await expectVisibleWithFallback(page, pageSelectors.hideFiltersButton, { expectTimeout: 15000, timeoutPerCandidate: 2500 });
  }
  await expectVisibleWithFallback(page, pageSelectors.downloadReportButton, { expectTimeout: 10000, timeoutPerCandidate: 2000 });

  return page;
}

async function ensureChartVisible(page) {
  const { page: pageSelectors } = mgmtPaymentsPostedSelectors;

  await openModule(page);
  if (await isVisible(page, pageSelectors.hideChartButton, 3000)) {
    return;
  }

  if (await isVisible(page, pageSelectors.showChartButton)) {
    await clickWithFallback(page, pageSelectors.showChartButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  }

  await expectVisibleWithFallback(page, [...pageSelectors.hideChartButton, ...pageSelectors.graphHeading], { expectTimeout: 25000, timeoutPerCandidate: 4000 });
}

async function ensureTableVisible(page) {
  const { page: pageSelectors } = mgmtPaymentsPostedSelectors;

  await openModule(page);
  if (await isVisible(page, pageSelectors.showTableButton)) {
    await clickWithFallback(page, pageSelectors.showTableButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  }

  await expectVisibleWithFallback(page, pageSelectors.hideTableButton, { expectTimeout: 20000, timeoutPerCandidate: 3000 });
  await expectVisibleWithFallback(page, [...pageSelectors.tableHeading, ...pageSelectors.tableElement], { expectTimeout: 25000, timeoutPerCandidate: 3000 });
}

async function openAdjustFilters(page) {
  const { page: pageSelectors, filters } = mgmtPaymentsPostedSelectors;

  await openModule(page);
  if (await isVisible(page, pageSelectors.adjustFiltersButton, 1500)) {
    await clickWithFallback(page, pageSelectors.adjustFiltersButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  }
  await expectVisibleWithFallback(page, filters.dialogHeading, { expectTimeout: 10000, timeoutPerCandidate: 1500 });
}

async function openAdvancedFilters(page) {
  const { filters } = mgmtPaymentsPostedSelectors;

  await openAdjustFilters(page);
  await clickWithFallback(page, filters.advancedFiltersTab, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  await expectVisibleWithFallback(page, filters.dialogHeading, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
}

async function openSortMenu(page) {
  const { page: pageSelectors } = mgmtPaymentsPostedSelectors;

  await ensureTableVisible(page);
  const headers = page.locator('#table-container button');
  const count = await headers.count();
  for (let index = 0; index < count; index += 1) {
    const header = headers.nth(index);
    const text = ((await header.textContent().catch(() => '')) || '').trim();
    if (!text) {
      continue;
    }

    await header.click({ timeout: 10000, force: true }).catch(() => null);
    if ((await isVisible(page, pageSelectors.sortAscOption, 1200)) || (await isVisible(page, pageSelectors.sortDescOption, 1200)) || (await isVisible(page, pageSelectors.sortHideOption, 1200))) {
      return;
    }
  }

  throw new Error('Could not open a sorting menu from the payments posted table.');
}

async function assertBaseSurface(page) {
  const { page: pageSelectors } = mgmtPaymentsPostedSelectors;

  await ensureChartVisible(page);
  await expectVisibleWithFallback(page, pageSelectors.hideChartButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
  await expectVisibleWithFallback(page, pageSelectors.showTableButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
  await expectVisibleWithFallback(page, pageSelectors.monthlyPaymentsLegend, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
  await expectVisibleWithFallback(page, pageSelectors.trendlineLegend, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
  await expectVisibleWithFallback(page, pageSelectors.showTrendlineCheckbox, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
}

async function runScenario(page, data, scenarioName) {
  const { page: pageSelectors, filters } = mgmtPaymentsPostedSelectors;
  const testNumber = Number((String(scenarioName).match(/^TS_(\d+)/) || [])[1]);

  switch (testNumber) {
    case 1:
      await assertBaseSurface(page);
      return;
    case 2:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.yearLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickFilterTrigger(page, 'Year:');
      await clickVisibleText(page, ['previous']);
      return;
    case 3:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.moduleLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await openModuleOptions(page);
      {
        const optionTexts = (await collectVisibleOptionTexts(page)).map((text) => text.toLowerCase());
        expect(optionTexts).toContain('imremit');
        expect(optionTexts).toContain('all modules selected');
      }
      await clickVisibleText(page, ['imREmit']);
      return;
    case 4:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.customersLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await openCustomerOptions(page);
      await fillWithFallback(page, filters.customerSearchInput, 'Infios Supply', { timeoutPerCandidate: 1500 });
      await clickVisibleText(page, ['Infios Supply']);
      return;
    case 5:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.monthLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickFilterTrigger(page, 'Month:');
      await expectVisibleWithFallback(page, filters.selectAllMonthsOption, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, filters.selectAllMonthsOption, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, filters.clearAllButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, filters.clearAllButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 6:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.quarterLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickFilterTrigger(page, 'Quarter:');
      await expectVisibleWithFallback(page, filters.selectAllQuartersOption, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 7:
      await ensureChartVisible(page);
      await expectVisibleWithFallback(page, pageSelectors.showTrendlineCheckbox, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.showTrendlineCheckbox, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 8:
      await openModule(page);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await clickWithFallback(page, pageSelectors.returnToTopButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 9:
      await ensureTableVisible(page);
      await clickWithFallback(page, pageSelectors.nextPageButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 10:
      await ensureTableVisible(page);
      {
        const previousButton = page.getByRole('button', { name: /Go to previous page/i }).first();
        if (await previousButton.isDisabled().catch(() => true)) {
          await clickWithFallback(page, pageSelectors.nextPageButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
          await expect(previousButton).toBeEnabled({ timeout: 10000 });
        }
      }
      await clickWithFallback(page, pageSelectors.previousPageButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 11:
      await ensureTableVisible(page);
      await clickWithFallback(page, pageSelectors.lastPageButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.firstPageButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 12:
      await ensureTableVisible(page);
      await clickWithFallback(page, pageSelectors.lastPageButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 13:
      await ensureTableVisible(page);
      await fillWithFallback(page, pageSelectors.searchAllEntriesInput, 'Infios Supply', { timeoutPerCandidate: 1500 });
      return;
    case 14:
      await ensureTableVisible(page);
      await clickWithFallback(page, pageSelectors.paginationButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 15:
      await ensureTableVisible(page);
      await clickWithFallback(page, pageSelectors.columnViewsButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 16:
      await openSortMenu(page);
      await clickVisibleText(page, ['Ascending', 'Asc']);
      return;
    case 17:
      await openSortMenu(page);
      await clickVisibleText(page, ['Descending', 'Desc']);
      return;
    case 18:
      await openSortMenu(page);
      await clickVisibleText(page, ['Hide column', 'Hide']);
      return;
    case 19:
    case 20:
      await openModule(page);
      await clickWithFallback(page, pageSelectors.downloadReportButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 21:
      await ensureTableVisible(page);
      await fillWithFallback(page, pageSelectors.searchAllEntriesInput, 'Infios Supply', { timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.searchResetButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 22:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.yearLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, filters.moduleLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 40:
      await openModule(page);
      if (await isVisible(page, pageSelectors.hideTableButton, 1500)) {
        await clickWithFallback(page, pageSelectors.hideTableButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      }
      await clickWithFallback(page, pageSelectors.showTableButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.tableElement, { expectTimeout: 15000, timeoutPerCandidate: 3000 });
      return;
    default:
      await assertBaseSurface(page);
  }
}

module.exports = {
  mgmtPaymentsPostedHelpers: wrapHelperMapWithReadableSteps({
    openModule,
    runScenario,
    selectors: mgmtPaymentsPostedSelectors
  }, {
    runScenario: 'Run the converted payments posted scenario'
  })
};
