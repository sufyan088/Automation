const { expect, test } = require('@playwright/test');
const { clickIfFound, clickWithFallback, expectVisibleWithFallback, fillWithFallback } = require('../fallback');
const { businessAssertionStepTitle, wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
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
  return [...new Set(texts.map((text) => text.replace(/\s+/g, ' ').trim()))].filter(Boolean);
}

function assertAlphabetical(values) {
  const comparable = values.filter((value) => !/^select all/i.test(value));
  if (comparable.length < 2) {
    return;
  }

  const sorted = [...comparable].sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }));
  expect(comparable).toEqual(sorted);
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
  return page.getByText(/Fetching payment data|Processing transactions|Building visualizations|Aggregating by customer|Almost there|Loading your workspace/i).first().isVisible().catch(() => false);
}

async function waitForChartContent(page) {
  await expect.poll(async () => !(await chartIsLoading(page)), { timeout: 20000 }).toBeTruthy();
}

async function selectFirstAvailableOption(page) {
  const options = (await collectVisibleOptionTexts(page)).filter((text) => !/^select all/i.test(text) && !/^all .* selected$/i.test(text));
  expect(options.length).toBeGreaterThan(0);
  await clickVisibleText(page, [options[0]]);
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

async function expectTextInDialog(page, values) {
  for (const value of values) {
    for (const scope of [getOpenDialog(page), getDialog(page), page.locator('body')]) {
      const locator = scope.getByText(value, { exact: true }).first();
      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }
  }

  throw new Error(`Expected one of these texts to be visible in dialog: ${values.join(', ')}`);
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
    await waitForChartContent(page);
    return;
  }

  if (await isVisible(page, pageSelectors.showChartButton)) {
    await clickWithFallback(page, pageSelectors.showChartButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  }

  await expectVisibleWithFallback(page, [...pageSelectors.hideChartButton, ...pageSelectors.graphHeading], { expectTimeout: 25000, timeoutPerCandidate: 4000 });
  await waitForChartContent(page);
}

async function ensureTableVisible(page) {
  const { page: pageSelectors } = mgmtPaymentsPostedSelectors;
  const tableReadyCandidates = [
    ...pageSelectors.tableHeading,
    ...pageSelectors.searchAllEntriesInput,
    ...pageSelectors.tableElement,
    ...pageSelectors.paginationButton
  ];

  await openModule(page);
  if (await isVisible(page, pageSelectors.showTableButton)) {
    await clickWithFallback(page, pageSelectors.showTableButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
  }

  await expectVisibleWithFallback(page, pageSelectors.hideTableButton, { expectTimeout: 20000, timeoutPerCandidate: 3000 });
  await expectVisibleWithFallback(page, tableReadyCandidates, { expectTimeout: 25000, timeoutPerCandidate: 3000 });
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

async function openDownloadMenu(page) {
  const { page: pageSelectors } = mgmtPaymentsPostedSelectors;

  await ensureChartVisible(page);
  if ((await isVisible(page, pageSelectors.downloadBothButton, 1200)) || (await isVisible(page, pageSelectors.downloadChartButton, 1200))) {
    return;
  }

  await clickWithFallback(page, pageSelectors.downloadReportButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
}

async function verifyQuarterMonths(page, quarterText, expectedMonths) {
  await openAdvancedFilters(page);
  await expectTextInDialog(page, ['Quarter:']);
  await clickFilterTrigger(page, 'Quarter:');
  await clickVisibleText(page, [quarterText]);
  await clickFilterTrigger(page, 'Month:');
  for (const month of expectedMonths) {
    await expectTextInDialog(page, [month]);
  }
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
    case 23:
      await ensureChartVisible(page);
      await clickWithFallback(page, pageSelectors.hideChartButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.showChartButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.showChartButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.hideChartButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 24:
      await ensureTableVisible(page);
      await clickWithFallback(page, pageSelectors.hideTableButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.showTableButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.showTableButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await ensureTableVisible(page);
      return;
    case 25:
      await openDownloadMenu(page);
      await expectVisibleWithFallback(page, pageSelectors.downloadBothButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.downloadBothButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 26:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.customersLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await openCustomerOptions(page);
      if (await isVisible(page, [...filters.customerOptionsDialog, ...filters.customerSearchInput, ...filters.customerResetButton], 1500)) {
        await fillWithFallback(page, filters.customerSearchInput, 'Infios Supply', { timeoutPerCandidate: 1500 });
        await clickVisibleText(page, ['Infios Supply']);
      }
      if ((await clickIfFound(page, filters.customerResetButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 })).clicked === false) {
        await fillWithFallback(page, filters.customerSearchInput, '', { timeoutPerCandidate: 1500 }).catch(() => null);
        await page.keyboard.press('Escape').catch(() => null);
      }
      await expectVisibleWithFallback(page, filters.allCustomersSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 27:
      await openAdvancedFilters(page);
      await clickFilterTrigger(page, 'Month:');
      await expectVisibleWithFallback(page, filters.selectAllMonthsOption, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, filters.selectAllMonthsOption, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, filters.clearAllButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, filters.clearAllButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 28:
      await verifyQuarterMonths(page, 'Q1', ['Jan', 'Feb', 'Mar']);
      return;
    case 29:
      await verifyQuarterMonths(page, 'Q2', ['Apr', 'May', 'Jun']);
      return;
    case 30:
      await verifyQuarterMonths(page, 'Q3', ['Jul', 'Aug', 'Sep']);
      return;
    case 31:
      await verifyQuarterMonths(page, 'Q4', ['Oct', 'Nov', 'Dec']);
      return;
    case 32:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.yearLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await expectTextInDialog(page, ['current']);
      return;
    case 33:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.allCustomersSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 34:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.allMonthsSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 35:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.allModulesSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 36:
      await openAdjustFilters(page);
      await openCustomerOptions(page);
      assertAlphabetical(await collectVisibleOptionTexts(page));
      return;
    case 37:
      await openAdjustFilters(page);
      await clickFilterTrigger(page, 'Module:');
      await clickVisibleText(page, ['imREmit']);
      await openCustomerOptions(page);
      await expect.poll(async () => (await collectVisibleOptionTexts(page)).length, { timeout: 20000 }).toBeGreaterThan(0);
      return;
    case 41:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.moduleLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, filters.allModulesSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 42:
      await openAdjustFilters(page);
      await waitForChartContent(page);
      await expect(async () => {
        await page.getByRole('tabpanel', { name: 'Basic Filters' }).getByText('All modules selected', { exact: true }).first().click({ timeout: 10000, force: true });
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
    case 43:
      await ensureTableVisible(page);
      await expectVisibleWithFallback(page, pageSelectors.parentCustomerHeader, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
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

const helperMap = {
  openModule,
  runScenario,
  selectors: mgmtPaymentsPostedSelectors
};

async function runScenarioWithBusinessSteps(page, data, scenarioName, reportScenarioName) {
  await test.step('Open the MIS Payments Posted page', async () => {
    await openModule(page);
  });

  return test.step(businessAssertionStepTitle(reportScenarioName || scenarioName), async () => {
    return runScenario(page, data, scenarioName);
  });
}

module.exports = {
  mgmtPaymentsPostedHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario: runScenarioWithBusinessSteps,
    selectors: mgmtPaymentsPostedSelectors
  }
};
