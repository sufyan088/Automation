const { expect, test } = require('@playwright/test');
const { clickIfFound, clickWithFallback, expectVisibleWithFallback, fillWithFallback, resolveFirst } = require('../fallback');
const { businessAssertionStepTitle, wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { mgmtPercentageGrowthSelectors } = require('../../selectors/iteration-matrix/mgmtPercentageGrowth.selectors.js');

async function isVisible(page, candidates, timeout = 1500) {
  try {
    await expectVisibleWithFallback(page, candidates, { expectTimeout: timeout, timeoutPerCandidate: timeout });
    return true;
  } catch {
    return false;
  }
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

async function clickVisibleText(page, values) {
  for (const value of values) {
    for (const scope of [getOpenDialog(page), page.locator('body')]) {
      const locators = [
        scope.locator('[role="option"], [data-value], [cmdk-item]').filter({ hasText: new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }).first(),
        scope.getByRole('option', { name: value, exact: true }).first(),
        scope.getByText(value, { exact: true }).first()
      ];

      for (const locator of locators) {
        if (!(await locator.isVisible().catch(() => false))) {
          continue;
        }

        await locator.click({ timeout: 10000, force: true });
        return true;
      }
    }
  }

  return false;
}

async function collectVisibleOptionTexts(page) {
  const dialog = getOpenDialog(page);
  const root = (await dialog.count().catch(() => 0)) > 0 ? dialog : page.locator('body');
  const texts = await root.locator('[role="option"], [cmdk-item], [data-value]').evaluateAll((nodes) => nodes
    .filter((node) => !node.querySelector('[role="option"], [cmdk-item], [data-value]'))
    .map((node) => (node.textContent || '').trim())
    .filter(Boolean));
  return [...new Set(texts.map((text) => text.replace(/\s+/g, ' ').trim()))].filter((text) => text && !/^Clear All$/i.test(text));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function clickVisibleDialogOption(page, values) {
  for (const value of values) {
    for (const scope of [page.locator('[role="listbox"], [cmdk-list]').last(), getOpenDialog(page), page.locator('body')]) {
      const locators = [
        scope.locator('[role="option"], [data-value], [cmdk-item]').filter({ hasText: new RegExp(`^${escapeRegex(value)}$`, 'i') }).first(),
        scope.getByRole('option', { name: value, exact: true }).first()
      ];

      for (const locator of locators) {
        if (!(await locator.isVisible().catch(() => false))) {
          continue;
        }

        await locator.click({ timeout: 10000, force: true });
        return true;
      }
    }
  }

  return false;
}

async function chartIsLoading(page) {
  return page.getByText(/Fetching payment data|Processing transactions|Loading your workspace/i).first().isVisible().catch(() => false);
}

async function waitForChartContent(page) {
  await expect.poll(async () => !(await chartIsLoading(page)), { timeout: 20000 }).toBeTruthy();
}

function assertAlphabetical(values) {
  const comparable = values.filter((value) => !/^select all/i.test(value));
  if (comparable.length < 2) {
    return;
  }

  const sorted = [...comparable].sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }));
  expect(comparable).toEqual(sorted);
}

async function selectFirstAvailableOption(page) {
  const options = (await collectVisibleOptionTexts(page)).filter((text) => !/^select all/i.test(text) && !/^all .* selected$/i.test(text));
  expect(options.length).toBeGreaterThan(0);
  await clickVisibleText(page, [options[0]]);
}

async function openModule(page) {
  const { navigation, page: pageSelectors } = mgmtPercentageGrowthSelectors;

  if (!(await isVisible(page, navigation.adminHeading))) {
    await clickWithFallback(page, navigation.adminModule, { actionTimeout: 15000, timeoutPerCandidate: 2500 });
    await expectVisibleWithFallback(page, navigation.adminHeading, { expectTimeout: 20000, timeoutPerCandidate: 2500 });
  }

  await clickWithFallback(page, navigation.mgmtInformationSystemLink, { actionTimeout: 15000, timeoutPerCandidate: 2500 });

  if (!(await isVisible(page, navigation.percentageGrowthHeading, 4000))) {
    await clickWithFallback(page, navigation.percentageGrowthTab, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  }

  await expectVisibleWithFallback(page, navigation.percentageGrowthHeading, { expectTimeout: 20000, timeoutPerCandidate: 2500 });
  await expectVisibleWithFallback(page, pageSelectors.downloadReportButton, { expectTimeout: 10000, timeoutPerCandidate: 2000 });

  if (!(await isVisible(page, pageSelectors.adjustFiltersButton, 1500))) {
    await expectVisibleWithFallback(page, pageSelectors.hideFiltersButton, { expectTimeout: 15000, timeoutPerCandidate: 2500 });
  }

  return page;
}

async function ensureChartVisible(page) {
  const { page: pageSelectors } = mgmtPercentageGrowthSelectors;

  await openModule(page);
  if (await isVisible(page, pageSelectors.hideChartButton, 2000)) {
    return;
  }

  if (await isVisible(page, pageSelectors.showChartButton, 2000)) {
    await clickWithFallback(page, pageSelectors.showChartButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  }

  await expectVisibleWithFallback(page, [...pageSelectors.hideChartButton, ...pageSelectors.graphHeading], { expectTimeout: 25000, timeoutPerCandidate: 3000 });
}

async function ensureTableVisible(page) {
  const { page: pageSelectors } = mgmtPercentageGrowthSelectors;

  await openModule(page);
  if (await isVisible(page, pageSelectors.showTableButton, 2000)) {
    await clickWithFallback(page, pageSelectors.showTableButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  }

  await expectVisibleWithFallback(page, pageSelectors.hideTableButton, { expectTimeout: 15000, timeoutPerCandidate: 3000 });
  await expectVisibleWithFallback(page, [...pageSelectors.tableHeading, ...pageSelectors.tableElement], { expectTimeout: 25000, timeoutPerCandidate: 3000 });
}

async function openAdjustFilters(page) {
  const { page: pageSelectors, filters } = mgmtPercentageGrowthSelectors;

  await openModule(page);
  if (await isVisible(page, pageSelectors.adjustFiltersButton, 1500)) {
    await clickWithFallback(page, pageSelectors.adjustFiltersButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  }
  await expectVisibleWithFallback(page, filters.dialogHeading, { expectTimeout: 10000, timeoutPerCandidate: 1500 });
}

async function openCustomerOptions(page) {
  const { filters } = mgmtPercentageGrowthSelectors;

  await openAdjustFilters(page);
  await clickWithFallback(page, [{
    type: 'custom',
    name: 'customers filter trigger',
    factory: (localPage) => getFilterTriggerByLabel(localPage, 'Customers:*')
  }], { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  await expectVisibleWithFallback(page, filters.customerSearchInput, { expectTimeout: 10000, timeoutPerCandidate: 1500 });
}

async function openDownloadMenu(page) {
  const { page: pageSelectors } = mgmtPercentageGrowthSelectors;

  await ensureChartVisible(page);
  if ((await isVisible(page, pageSelectors.downloadBothButton, 1200)) || (await isVisible(page, pageSelectors.downloadChartButton, 1200))) {
    return;
  }

  await clickWithFallback(page, pageSelectors.downloadReportButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
}

async function openSortMenu(page) {
  const { page: pageSelectors } = mgmtPercentageGrowthSelectors;

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

  throw new Error('Could not open a sorting menu from the percentage growth table.');
}

async function clickPaginationButtonWhenEnabled(page, candidates) {
  const { locator } = await resolveFirst(page, candidates, { timeoutPerCandidate: 1500 });

  await expect(locator).toBeVisible({ timeout: 5000 });
  if (await locator.isDisabled().catch(() => true)) {
    await expect(page.locator('#table-container')).toContainText(/Page:\s*1 of 1/i, { timeout: 5000 });
    return false;
  }

  await locator.click({ timeout: 10000 });
  return true;
}

async function assertBaseSurface(page) {
  const { page: pageSelectors } = mgmtPercentageGrowthSelectors;

  await ensureChartVisible(page);
  await expectVisibleWithFallback(page, pageSelectors.graphHeading, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
  await expectVisibleWithFallback(page, pageSelectors.adjustFiltersButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
}

async function runScenario(page, data, scenarioName) {
  const { page: pageSelectors, filters } = mgmtPercentageGrowthSelectors;
  const testNumber = Number((String(scenarioName).match(/^TS_(\d+)/) || [])[1]);

  switch (testNumber) {
    case 1:
      await assertBaseSurface(page);
      return;
    case 2:
      await openCustomerOptions(page);
      await fillWithFallback(page, filters.customerSearchInput, 'Koerber Supply', { timeoutPerCandidate: 1500 });
      await clickVisibleText(page, ['Koerber Supply']);
      return;
    case 3:
      await openModule(page);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await clickWithFallback(page, pageSelectors.returnToTopButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 4:
      await ensureTableVisible(page);
      await clickPaginationButtonWhenEnabled(page, pageSelectors.nextPageButton);
      return;
    case 5:
      await ensureTableVisible(page);
      {
        const movedForward = await clickPaginationButtonWhenEnabled(page, pageSelectors.nextPageButton);
        if (!movedForward) {
          return;
        }
      }
      await clickPaginationButtonWhenEnabled(page, pageSelectors.previousPageButton);
      return;
    case 6:
      await ensureTableVisible(page);
      {
        const movedToLast = await clickPaginationButtonWhenEnabled(page, pageSelectors.lastPageButton);
        if (!movedToLast) {
          return;
        }
      }
      await clickPaginationButtonWhenEnabled(page, pageSelectors.firstPageButton);
      return;
    case 7:
      await ensureTableVisible(page);
      await clickPaginationButtonWhenEnabled(page, pageSelectors.lastPageButton);
      return;
    case 8:
      await ensureTableVisible(page);
      await fillWithFallback(page, pageSelectors.searchAllEntriesInput, 'Koerber Supply', { timeoutPerCandidate: 1500 });
      return;
    case 9:
      await ensureTableVisible(page);
      await clickWithFallback(page, pageSelectors.paginationButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 10:
      await ensureTableVisible(page);
      await clickWithFallback(page, pageSelectors.columnViewsButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 11:
      await openSortMenu(page);
      await clickVisibleText(page, ['Ascending', 'Asc']);
      return;
    case 12:
      await openSortMenu(page);
      await clickVisibleText(page, ['Descending', 'Desc']);
      return;
    case 13:
      await openSortMenu(page);
      await clickVisibleText(page, ['Hide column', 'Hide']);
      return;
    case 14:
    case 15:
      await openModule(page);
      await clickWithFallback(page, pageSelectors.downloadReportButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 16:
      await ensureChartVisible(page);
      await expectVisibleWithFallback(page, pageSelectors.showDifferencesCheckbox, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.showDifferencesCheckbox, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 17:
      await ensureTableVisible(page);
      await fillWithFallback(page, pageSelectors.searchAllEntriesInput, 'Koerber Supply', { timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.searchResetButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 18:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.customersLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 19:
      await ensureChartVisible(page);
      await clickWithFallback(page, pageSelectors.hideChartButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.showChartButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.showChartButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.hideChartButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 20:
      await ensureTableVisible(page);
      await clickWithFallback(page, pageSelectors.hideTableButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.showTableButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.showTableButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.tableElement, { expectTimeout: 15000, timeoutPerCandidate: 3000 });
      return;
    case 21:
      await openDownloadMenu(page);
      await expectVisibleWithFallback(page, pageSelectors.downloadBothButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.downloadBothButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 22:
      await openAdjustFilters(page);
      await openCustomerOptions(page);
      if (await isVisible(page, [...filters.customerOptionsDialog, ...filters.customerSearchInput, ...filters.customerResetButton], 1500)) {
        await fillWithFallback(page, filters.customerSearchInput, 'Koerber Supply', { timeoutPerCandidate: 1500 });
        await clickVisibleText(page, ['Koerber Supply']);
      }
      if ((await clickIfFound(page, filters.customerResetButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 })).clicked === false) {
        await fillWithFallback(page, filters.customerSearchInput, '', { timeoutPerCandidate: 1500 }).catch(() => null);
        await page.keyboard.press('Escape').catch(() => null);
      }
      await expectVisibleWithFallback(page, filters.allCustomersSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 23:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.moduleLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await expect.poll(async () => ((await getFilterTriggerByLabel(page, 'Module:').textContent()) || '').replace(/\s+/g, ' ').trim(), { timeout: 10000 }).toMatch(/both/i);
      return;
    case 24:
      await openCustomerOptions(page);
      await expect.poll(async () => (await collectVisibleOptionTexts(page)).length, { timeout: 10000 }).toBeGreaterThan(0);
      assertAlphabetical(await collectVisibleOptionTexts(page));
      return;
    case 25:
      await openAdjustFilters(page);
      await waitForChartContent(page);
      await expect(async () => {
        await page.getByRole('tabpanel', { name: 'Basic Filters' }).getByText(/^(Both|All modules selected)$/).first().click({ timeout: 10000, force: true });
        expect(await clickVisibleText(page, ['imREmit lite', 'imREmit Lite', 'imREmit-Lite', 'imREmit'])).toBeTruthy();
      }).toPass({ timeout: 15000 });
      await expect.poll(async () => (await getFilterTriggerByLabel(page, 'Module:').textContent()) || '', { timeout: 10000 }).toMatch(/imremit(?: |-)?lite/i);
      await expectVisibleWithFallback(page, filters.allSendersSelected, { expectTimeout: 10000, timeoutPerCandidate: 5000 });
      await expect(async () => {
        await page.getByRole('tabpanel', { name: 'Basic Filters' }).getByText('All senders selected', { exact: true }).first().click({ timeout: 10000, force: true });
        await expect.poll(async () => (await collectVisibleOptionTexts(page)).length, { timeout: 10000 }).toBeGreaterThan(0);
        await selectFirstAvailableOption(page);
      }).toPass({ timeout: 15000 });
      await page.keyboard.press('Escape').catch(() => null);
      await ensureTableVisible(page);
      return;
    case 26:
      await ensureTableVisible(page);
      await expectVisibleWithFallback(page, pageSelectors.parentCustomerHeader, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    default:
      await assertBaseSurface(page);
  }
}

const helperMap = {
  openModule,
  runScenario,
  selectors: mgmtPercentageGrowthSelectors
};

async function runScenarioWithBusinessSteps(page, data, scenarioName, reportScenarioName) {
  await test.step('Open the MIS Percentage Growth page', async () => {
    await openModule(page);
  });

  return test.step(businessAssertionStepTitle(reportScenarioName || scenarioName), async () => {
    return runScenario(page, data, scenarioName);
  });
}

module.exports = {
  mgmtPercentageGrowthHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario: runScenarioWithBusinessSteps,
    selectors: mgmtPercentageGrowthSelectors
  }
};
