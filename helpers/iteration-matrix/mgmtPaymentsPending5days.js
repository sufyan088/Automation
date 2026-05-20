const { expect, test } = require('@playwright/test');
const { clickWithFallback, clickIfFound, expectVisibleWithFallback, fillWithFallback } = require('../fallback');
const { businessAssertionStepTitle, wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { mgmtPaymentsPending5daysSelectors } = require('../../selectors/iteration-matrix/mgmtPaymentsPending5days.selectors.js');

async function isVisible(page, candidates, timeout = 1500) {
  try {
    await expectVisibleWithFallback(page, candidates, { expectTimeout: timeout, timeoutPerCandidate: timeout });
    return true;
  } catch {
    return false;
  }
}

async function openModule(page) {
  const { navigation, page: pageSelectors } = mgmtPaymentsPending5daysSelectors;

  if (!(await isVisible(page, navigation.adminHeading))) {
    await clickWithFallback(page, navigation.adminModule, { actionTimeout: 15000, timeoutPerCandidate: 2500 });
    await expectVisibleWithFallback(page, navigation.adminHeading, { expectTimeout: 20000, timeoutPerCandidate: 2500 });
  }

  await clickWithFallback(page, navigation.mgmtInformationSystemLink, { actionTimeout: 15000, timeoutPerCandidate: 2500 });

  if (!(await isVisible(page, navigation.pendingPaymentsHeading, 4000))) {
    await clickWithFallback(page, navigation.pendingPaymentsTab, { actionTimeout: 15000, timeoutPerCandidate: 2500 });
  }

  await expectVisibleWithFallback(page, navigation.pendingPaymentsHeading, { expectTimeout: 20000, timeoutPerCandidate: 2500 });
  await expectVisibleWithFallback(page, pageSelectors.adjustFiltersButton, { expectTimeout: 10000, timeoutPerCandidate: 2000 });
  await expectVisibleWithFallback(page, pageSelectors.downloadReportButton, { expectTimeout: 10000, timeoutPerCandidate: 2000 });

  return page;
}

async function ensureChartsVisible(page) {
  const { page: pageSelectors } = mgmtPaymentsPending5daysSelectors;

  await openModule(page);
  if (await isVisible(page, pageSelectors.showChartButton)) {
    await clickWithFallback(page, pageSelectors.showChartButton, { actionTimeout: 10000, timeoutPerCandidate: 2000 });
  }

  await expectVisibleWithFallback(page, pageSelectors.pendingPaymentAmountsHeading, { expectTimeout: 15000, timeoutPerCandidate: 5000 });
}

async function ensureTableVisible(page) {
  const { page: pageSelectors } = mgmtPaymentsPending5daysSelectors;

  await openModule(page);
  if (await isVisible(page, pageSelectors.showTableButton)) {
    await clickWithFallback(page, pageSelectors.showTableButton, { actionTimeout: 10000, timeoutPerCandidate: 2000 });
  }

  await expectVisibleWithFallback(page, pageSelectors.tableElement, { expectTimeout: 30000, timeoutPerCandidate: 10000 });
}

async function openAdjustFilters(page) {
  const { page: pageSelectors, filters } = mgmtPaymentsPending5daysSelectors;

  await openModule(page);
  await clickWithFallback(page, pageSelectors.adjustFiltersButton, { actionTimeout: 10000, timeoutPerCandidate: 2000 });
  await expectVisibleWithFallback(page, filters.dialogHeading, { expectTimeout: 10000, timeoutPerCandidate: 2000 });
}

async function openAdvancedFilters(page) {
  const { filters } = mgmtPaymentsPending5daysSelectors;

  await openAdjustFilters(page);
  await clickWithFallback(page, filters.advancedFiltersTab, { actionTimeout: 10000, timeoutPerCandidate: 2000 });
  await expectVisibleWithFallback(page, filters.advancedFiltersTab, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
}

async function closeAdjustFilters(page) {
  const { filters } = mgmtPaymentsPending5daysSelectors;

  const clicked = await clickIfFound(page, filters.closeDialogButton, { actionTimeout: 5000, timeoutPerCandidate: 1000 });
  if (!clicked.clicked) {
    await page.keyboard.press('Escape').catch(() => null);
  }
}

async function clickIfVisible(page, candidates) {
  if (await isVisible(page, candidates)) {
    await clickWithFallback(page, candidates, { actionTimeout: 10000, timeoutPerCandidate: 2000 });
    return true;
  }

  return false;
}

async function clickLocatorIfEnabled(locator) {
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  if (await locator.isDisabled().catch(() => false)) {
    return false;
  }

  await locator.click({ timeout: 10000 });
  return true;
}

async function clickFirstVisibleText(page, values) {
  for (const value of values) {
    for (const scope of [getOpenDialog(page), page.locator('body')]) {
      const locators = [
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

  throw new Error(`Could not click any visible text option from: ${values.join(', ')}`);
}

function getOpenDialog(page) {
  return page.locator('[role="dialog"]').filter({ has: page.locator('[role="listbox"], [role="option"], input[role="combobox"], [cmdk-list]') }).last();
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

async function clickFirstAvailableOption(page) {
  const options = (await collectVisibleOptionTexts(page)).filter((text) => !/^select all/i.test(text) && !/^all .* selected$/i.test(text));
  expect(options.length).toBeGreaterThan(0);
  await clickFirstVisibleText(page, [options[0]]);
}

async function openSortMenu(page) {
  const { page: pageSelectors } = mgmtPaymentsPending5daysSelectors;
  const sortableHeaders = [
    '#table-container button[aria-label*="Customer Name"]',
    '#table-container button[aria-label*="Supplier Name"]',
    '#table-container button[aria-label*="PID"]',
    '#table-container button[aria-label*="Payment Number"]',
    '#table-container button[aria-label*="Days Aging"]',
    '#table-container button[aria-label*="Payment Status Description"]',
    '#table-container button[aria-label*="Payment Status"]'
  ];

  await ensureTableVisible(page);

  for (const header of sortableHeaders) {
    const locator = page.locator(header).first();
    if (!(await locator.isVisible().catch(() => false))) {
      continue;
    }

    await locator.click({ timeout: 10000, force: true }).catch(() => null);
    if (
      (await isVisible(page, pageSelectors.sortAscOption, 1200)) ||
      (await isVisible(page, pageSelectors.sortDescOption, 1200)) ||
      (await isVisible(page, pageSelectors.sortHideOption, 1200))
    ) {
      return;
    }
  }

  throw new Error('Could not open a sort menu from any visible pending-payments table header.');
}

async function assertBaseSurface(page) {
  const { page: pageSelectors } = mgmtPaymentsPending5daysSelectors;

  await openModule(page);
  await expectVisibleWithFallback(page, pageSelectors.pendingPaymentAmountsHeading, { expectTimeout: 15000, timeoutPerCandidate: 5000 });
  await expectVisibleWithFallback(page, pageSelectors.graphLegendPayByWeb, { expectTimeout: 15000, timeoutPerCandidate: 5000 });
  await expectVisibleWithFallback(page, pageSelectors.graphLegendPayByEmail, { expectTimeout: 15000, timeoutPerCandidate: 5000 });
  await expectVisibleWithFallback(page, pageSelectors.graphLegendPayByPhone, { expectTimeout: 15000, timeoutPerCandidate: 5000 });
  await expectVisibleWithFallback(page, pageSelectors.graphLegendTotal, { expectTimeout: 15000, timeoutPerCandidate: 5000 });
}

async function verifyFilterDefaults(page) {
  const { filters } = mgmtPaymentsPending5daysSelectors;

  await openAdjustFilters(page);
  await expectVisibleWithFallback(page, filters.moduleLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
  await expectVisibleWithFallback(page, filters.customersLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
  await expectVisibleWithFallback(page, filters.moduleTrigger, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
  await expectVisibleWithFallback(page, filters.customersTrigger, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
}

async function runScenario(page, data, scenarioName) {
  const { page: pageSelectors, filters } = mgmtPaymentsPending5daysSelectors;
  const testNumber = Number((String(scenarioName).match(/^TS_(\d+)/) || [])[1]);

  switch (testNumber) {
    case 1:
      await assertBaseSurface(page);
      return;
    case 2:
      await ensureTableVisible(page);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      if (await isVisible(page, pageSelectors.returnToTopButton, 3000)) {
        await clickIfVisible(page, pageSelectors.returnToTopButton);
      }
      return;
    case 3:
      await ensureTableVisible(page);
      await clickLocatorIfEnabled(page.locator('#table-container button[aria-label*="next" i]').first());
      return;
    case 4:
      await ensureTableVisible(page);
      await clickLocatorIfEnabled(page.locator('#table-container button[aria-label*="previous" i]').first());
      return;
    case 5:
      await ensureTableVisible(page);
      await clickLocatorIfEnabled(page.locator('#table-container button[aria-label*="first" i]').first());
      return;
    case 6:
      await ensureTableVisible(page);
      await clickLocatorIfEnabled(page.locator('#table-container button[aria-label*="last" i]').first());
      return;
    case 7:
      await ensureTableVisible(page);
      await fillWithFallback(page, pageSelectors.searchAllEntriesInput, 'Koerber Supply', { timeoutPerCandidate: 1500 });
      return;
    case 8:
      await ensureTableVisible(page);
      await clickIfVisible(page, pageSelectors.paginationButton);
      return;
    case 9:
      await ensureTableVisible(page);
      await clickIfVisible(page, pageSelectors.columnViewsButton);
      return;
    case 10:
      await openSortMenu(page);
      await clickFirstVisibleText(page, ['Ascending', 'Asc']);
      return;
    case 11:
      await openSortMenu(page);
      await clickFirstVisibleText(page, ['Descending', 'Desc']);
      return;
    case 12:
      await openSortMenu(page);
      {
        const hideMenuItem = page.getByRole('menuitem').filter({ hasText: /^Hide column$|^Hide$/ }).first();
        if (await hideMenuItem.isVisible().catch(() => false)) {
          await hideMenuItem.click({ timeout: 10000, force: true });
          return;
        }
      }
      await clickFirstVisibleText(page, ['Hide column', 'Hide']);
      return;
    case 13:
      await ensureChartsVisible(page);
      await expectVisibleWithFallback(page, pageSelectors.graphLegendPayByWeb, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.graphLegendPayByEmail, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.graphLegendPayByPhone, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.graphLegendTotal, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 14:
    case 15:
      await ensureChartsVisible(page);
      await expectVisibleWithFallback(page, pageSelectors.pendingPaymentAmountsHeading, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 16:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.customersLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickIfVisible(page, filters.customersTrigger);
      return;
    case 17:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.moduleLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickIfVisible(page, filters.moduleTrigger);
      return;
    case 18:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.remittanceMethodLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      if (await clickLocatorIfEnabled(page.getByRole('tabpanel', { name: 'Basic Filters' }).getByRole('combobox').nth(2))) {
        await expectVisibleWithFallback(page, filters.payByWebOption, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
        await expectVisibleWithFallback(page, filters.payByEmailOption, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
        await expectVisibleWithFallback(page, filters.payByPhoneOption, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      }
      return;
    case 19:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.supplierNameLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickLocatorIfEnabled(page.getByRole('tabpanel', { name: 'Advanced Filters' }).getByRole('combobox').nth(2));
      return;
    case 20:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.supplierIdLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickLocatorIfEnabled(page.getByRole('tabpanel', { name: 'Advanced Filters' }).getByRole('combobox').nth(3));
      return;
    case 21:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.paymentStatusLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickIfVisible(page, filters.paymentStatusTrigger);
      return;
    case 22:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.statusDescriptionLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickIfVisible(page, filters.statusDescriptionTrigger);
      return;
    case 23:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.daysAgingLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickIfVisible(page, filters.daysAgingTrigger);
      return;
    case 24:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.allCustomersSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 25:
      await openAdjustFilters(page);
      await expectVisibleWithFallback(page, filters.allModulesSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 26:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.allSuppliersSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 27:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.allStatusesSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 28:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.supplierNameTrigger, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, filters.supplierIdLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 29:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.supplierIdTrigger, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, filters.supplierNameLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 30:
      await ensureChartsVisible(page);
      if (await isVisible(page, pageSelectors.hideChartButton)) {
        await clickWithFallback(page, pageSelectors.hideChartButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      }
      await expectVisibleWithFallback(page, pageSelectors.showChartButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.showChartButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.pendingPaymentAmountsHeading, { expectTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 31:
      await ensureTableVisible(page);
      await expectVisibleWithFallback(page, pageSelectors.hideTableButton, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await clickWithFallback(page, pageSelectors.hideTableButton, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, pageSelectors.showTableButton, { expectTimeout: 10000, timeoutPerCandidate: 1500 });
      return;
    case 32:
      await ensureChartsVisible(page);
      await expectVisibleWithFallback(page, pageSelectors.pendingPaymentCountsHeading, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 33:
      await ensureChartsVisible(page);
      {
        const currentDayLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date());
        await expect(page.getByText(currentDayLabel, { exact: true }).first()).toBeVisible({ timeout: 5000 });
      }
      return;
    case 34:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.supplierIdLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, filters.allSupplierIdsSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 35:
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, filters.statusDescriptionLabel, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      await expectVisibleWithFallback(page, filters.allStatusDescriptionsSelected, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    case 36:
      await openAdjustFilters(page);
      await clickWithFallback(page, filters.moduleTrigger, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await clickFirstVisibleText(page, ['imREmit lite', 'imREmit Lite', 'imREmit']);
      await expect(page.getByRole('tabpanel', { name: 'Basic Filters' }).getByRole('combobox').nth(2)).toBeEnabled({ timeout: 10000 });
      await clickWithFallback(page, filters.remittanceMethodTrigger, { actionTimeout: 10000, timeoutPerCandidate: 1500 });
      await expect.poll(async () => (await collectVisibleOptionTexts(page)).length, { timeout: 10000 }).toBeGreaterThan(0);
      await clickFirstAvailableOption(page);
      if (await isVisible(page, pageSelectors.showTableButton, 1500)) {
        await clickWithFallback(page, pageSelectors.showTableButton, { actionTimeout: 10000, timeoutPerCandidate: 2000 });
      }
      await expectVisibleWithFallback(page, pageSelectors.tableElement, { expectTimeout: 30000, timeoutPerCandidate: 10000 });
      return;
    case 37:
      await ensureTableVisible(page);
      await expectVisibleWithFallback(page, pageSelectors.parentCustomerHeader, { expectTimeout: 5000, timeoutPerCandidate: 1500 });
      return;
    default:
      await assertBaseSurface(page);
      await verifyFilterDefaults(page);
      await closeAdjustFilters(page);
  }
}

const helperMap = {
  openModule,
  runScenario,
  selectors: mgmtPaymentsPending5daysSelectors
};

async function runScenarioWithBusinessSteps(page, data, scenarioName, reportScenarioName) {
  await test.step('Open the Pending Payments page', async () => {
    await openModule(page);
  });

  return test.step(businessAssertionStepTitle(reportScenarioName || scenarioName), async () => {
    return runScenario(page, data, scenarioName);
  });
}

module.exports = {
  mgmtPaymentsPending5daysHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario: runScenarioWithBusinessSteps,
    selectors: mgmtPaymentsPending5daysSelectors
  }
};
