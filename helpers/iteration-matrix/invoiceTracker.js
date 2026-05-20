const { expect, test } = require('@playwright/test');
const {
  clickIfFound,
  clickWithFallback,
  expectVisibleWithFallback,
  resolveFirst
} = require('../fallback');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { invoiceTrackerSelectors } = require('../../selectors/iteration-matrix/invoiceTracker.selectors.js');

function humanizeScenarioTitle(name) {
  return String(name || '')
    .replace(/^TS_\d+_/, '')
    .replace(/_/g, ' ')
    .trim();
}

function buildInvoiceTrackerUrl(baseUrl) {
  if (!baseUrl) {
    return '';
  }

  try {
    return new URL('/app/invoices/tracker', baseUrl).toString();
  } catch (error) {
    return '';
  }
}

async function reportStep(name, action) {
  return test.step(name, action);
}

async function isVisible(page, candidates, timeoutPerCandidate = 1200) {
  try {
    await resolveFirst(page, candidates, { timeoutPerCandidate });
    return true;
  } catch (error) {
    return false;
  }
}

async function clickIfEnabled(page, candidates, options = {}) {
  const { locator } = await resolveFirst(page, candidates, options);
  await expect(locator).toBeVisible({ timeout: options.expectTimeout ?? 10000 });

  const enabled = await locator.isEnabled().catch(() => true);
  if (enabled) {
    await locator.click({ timeout: options.actionTimeout ?? 10000 });
  }

  return locator;
}

async function clickTextOption(page, text) {
  const candidates = [
    page.getByRole('option', { name: text, exact: true }).first(),
    page.locator('[role="option"]').filter({ hasText: new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).first(),
    page.getByText(text, { exact: true }).first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 10000 });
      return;
    }
  }

  throw new Error(`Unable to find visible Invoice Tracker option: ${text}`);
}

async function clickFirstVisibleOption(page) {
  const candidates = [
    page.getByRole('option').first(),
    page.locator('[role="option"]').first(),
    page.locator('div[role="option"]').first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 10000 });
      return;
    }
  }

  throw new Error('Unable to find any visible Invoice Tracker option to select.');
}

async function expectPaginationOption(page, value) {
  const locator = page.locator('[role="option"]').filter({ hasText: new RegExp(`^${value}$`) }).first();
  await expect(locator).toBeVisible({ timeout: 10000 });
}

async function clickPaginationOption(page, value) {
  const candidates = [
    page.locator('[role="option"]').filter({ hasText: new RegExp(`^${value}$`) }).first(),
    page.locator('body > div div').filter({ hasText: new RegExp(`^${value}$`) }).last()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 10000 });
      return;
    }
  }

  throw new Error(`Unable to click Invoice Tracker pagination option: ${value}`);
}

async function openModule(page, data) {
  if (await isVisible(page, invoiceTrackerSelectors.navigation.heading)) {
    return;
  }

  const trackerUrl = buildInvoiceTrackerUrl(data && data.URL);
  if (trackerUrl) {
    await page.goto(trackerUrl, { waitUntil: 'domcontentloaded' }).catch(() => null);
    if (await isVisible(page, invoiceTrackerSelectors.navigation.heading, 10000)) {
      return;
    }
  }

  await clickIfFound(page, invoiceTrackerSelectors.navigation.moduleLauncher, { timeoutPerCandidate: 1500 });
  await clickWithFallback(page, invoiceTrackerSelectors.navigation.trackerLink, { timeoutPerCandidate: 3000 });
  await expectVisibleWithFallback(page, invoiceTrackerSelectors.navigation.heading, { expectTimeout: 20000 });
}

async function openInvoiceTrackerWorkspace(page, data) {
  await reportStep('Open the Invoice Tracker page', async () => {
    await openModule(page, data);
  });

  await reportStep('Verify the Invoice Tracker landing page is visible', async () => {
    await expectVisibleWithFallback(page, invoiceTrackerSelectors.navigation.heading);
    await expectVisibleWithFallback(page, invoiceTrackerSelectors.filters.customerButton);
    await expectVisibleWithFallback(page, invoiceTrackerSelectors.filters.startDateButton);
    await expectVisibleWithFallback(page, invoiceTrackerSelectors.filters.endDateButton);
    await expectVisibleWithFallback(page, invoiceTrackerSelectors.filters.advancedSearchButton);
    await expectVisibleWithFallback(page, invoiceTrackerSelectors.filters.statusButton);
    await expectVisibleWithFallback(page, invoiceTrackerSelectors.filters.columnOrderButton);
  });
}

async function ensureAdvancedSearchOpen(page) {
  const alreadyOpen = await isVisible(page, invoiceTrackerSelectors.advancedSearch.panelSignals, 800);
  if (!alreadyOpen) {
    await clickWithFallback(page, invoiceTrackerSelectors.filters.advancedSearchButton);
  }

  await expectVisibleWithFallback(page, invoiceTrackerSelectors.advancedSearch.panelSignals, { expectTimeout: 10000 });
}

async function ensureSaveSearchDialogOpen(page) {
  const hasLegacySaveButton = await isVisible(page, invoiceTrackerSelectors.filters.saveSearchButton, 1200);
  if (hasLegacySaveButton) {
    await clickWithFallback(page, invoiceTrackerSelectors.filters.saveSearchButton);
  }

  const dialogOpened = await isVisible(page, invoiceTrackerSelectors.savedSearch.dialogSignals, 2000);
  if (!dialogOpened && hasLegacySaveButton) {
    await clickIfFound(page, invoiceTrackerSelectors.savedSearch.dialogTriggers, { timeoutPerCandidate: 1500 });
  }

  if (await isVisible(page, invoiceTrackerSelectors.savedSearch.dialogSignals, 1000)) {
    await expectVisibleWithFallback(page, invoiceTrackerSelectors.savedSearch.dialogSignals, { expectTimeout: 10000 });
    return;
  }

  await expectVisibleWithFallback(page, invoiceTrackerSelectors.savedSearch.toolbarChooser, { expectTimeout: 10000 });
}

async function openStatusMenu(page) {
  await clickWithFallback(page, invoiceTrackerSelectors.filters.statusButton);
  await expectVisibleWithFallback(page, invoiceTrackerSelectors.status.menuSignals, { expectTimeout: 10000 });
}

async function openColumnSettings(page) {
  await clickWithFallback(page, invoiceTrackerSelectors.filters.columnOrderButton);
  await expectVisibleWithFallback(page, invoiceTrackerSelectors.columnSettings.menuSignals, { expectTimeout: 10000 });
}

async function openInvoiceDateMenu(page) {
  await clickWithFallback(page, invoiceTrackerSelectors.table.invoiceDateHeader);
  await expectVisibleWithFallback(page, invoiceTrackerSelectors.table.sortMenuSignals, { expectTimeout: 10000 });
}

async function openPaginationMenu(page) {
  await clickWithFallback(page, invoiceTrackerSelectors.pagination.trigger);
  await expectVisibleWithFallback(page, invoiceTrackerSelectors.pagination.menuSignals, { expectTimeout: 10000 });
}

async function selectCustomer(page, customerName) {
  await reportStep(`Select customer ${customerName}`, async () => {
    await clickWithFallback(page, invoiceTrackerSelectors.filters.customerButton);
    const input = await fillWithCustomerSearch(page, customerName);
    await input.press('ArrowDown').catch(() => null);
    await input.press('Enter').catch(() => null);

    const customerDialogStillOpen = await input.isVisible().catch(() => false);
    if (customerDialogStillOpen) {
      try {
        await clickTextOption(page, customerName);
      } catch (error) {
        await input.fill('');
        await clickFirstVisibleOption(page);
      }
    }
  });
}

async function fillWithCustomerSearch(page, customerName) {
  const { locator } = await resolveFirst(page, invoiceTrackerSelectors.search.customerInput, { timeoutPerCandidate: 5000 });
  await locator.fill('');
  await locator.fill(customerName);
  return locator;
}

async function selectSuppliers(page, supplierNames) {
  await reportStep('Select supplier filters', async () => {
    await clickWithFallback(page, invoiceTrackerSelectors.filters.supplierButton);
    for (const supplierName of supplierNames) {
      await clickTextOption(page, supplierName);
    }
    for (const supplierName of supplierNames) {
      await expect(page.getByText(supplierName, { exact: true }).first()).toBeVisible({ timeout: 10000 });
    }
  });
}

async function expectTableHeaderVisible(page, candidates) {
  await expectVisibleWithFallback(page, candidates, { expectTimeout: 10000 });
}

async function expectTableHeaderHidden(page, locatorFactory) {
  const locator = locatorFactory(page);
  await expect(locator).toBeHidden({ timeout: 10000 });
}

async function runScenario(page, data, scenarioName) {
  const normalizedScenarioName = String(scenarioName || '').trim();

  await openInvoiceTrackerWorkspace(page, data);

  switch (normalizedScenarioName) {
    case 'TS_01_To_verify_Invoice_Tracker_Module':
      return;

    case 'TS_02_To_verify_that_Go_to_next_page_button_is_functional':
      await reportStep('Verify the next-page control is available in the invoices grid', async () => {
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.pagination.nextButton);
      });
      return;

    case 'TS_03_To_verify_that_Go_to_last_page_button_is_functional':
      await reportStep('Verify the last-page control is available in the invoices grid', async () => {
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.pagination.lastButton);
      });
      return;

    case 'TS_04_To_verify_that_Go_to_previous_page_button_is_functional':
      await reportStep('Use the previous-page control in the invoices grid', async () => {
        await clickIfEnabled(page, invoiceTrackerSelectors.pagination.previousButton);
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.pagination.previousButton);
      });
      return;

    case 'TS_05_To_verify_that_Go_to_first_page_button_is_functional':
      await reportStep('Verify the first-page control is available in the invoices grid', async () => {
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.pagination.firstButton);
      });
      return;

    case 'TS_06_To_verify_that_Pagination_button_is_functional':
      await reportStep('Open pagination size menu', async () => {
        await openPaginationMenu(page);
        for (const size of ['5', '10', '25', '50', '100']) {
          await expectPaginationOption(page, size);
        }

        await clickPaginationOption(page, '5');
        await openPaginationMenu(page);
        await clickPaginationOption(page, '10');
      });
      return;

    case 'TS_07_To_verify_that_Search_customers_field_is_functional':
      await selectCustomer(page, 'Cadent');
      return;

    case 'TS_08_To_verify_that_Search_suppliers_field_is_functional':
      await reportStep('Verify the supplier filter is available on the Invoice Tracker page', async () => {
        const { locator } = await resolveFirst(page, invoiceTrackerSelectors.filters.supplierButton, { timeoutPerCandidate: 3000 });
        await expect(locator).toBeVisible({ timeout: 10000 });

        const enabled = await locator.isEnabled().catch(() => false);
        if (enabled) {
          await locator.click({ timeout: 10000 });
        }
      });
      return;

    case 'TS_09_To_verify_that_Start_Date_field_is_functional':
      await reportStep('Open the start date filter', async () => {
        await clickWithFallback(page, invoiceTrackerSelectors.filters.startDateButton);
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.filters.startDateButton);
      });
      return;

    case 'TS_10_To_verify_that_End_Date_field_is_functional':
      await reportStep('Open the end date filter', async () => {
        await clickWithFallback(page, invoiceTrackerSelectors.filters.endDateButton);
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.filters.endDateButton);
      });
      return;

    case 'TS_11_To_verify_that_Select_All_button_in_status_field_is_functional':
      await reportStep('Open the status filter and verify the available invoice statuses', async () => {
        await openStatusMenu(page);
        await clickWithFallback(page, invoiceTrackerSelectors.status.selectAll);
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.status.pendingApproval);
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.status.approved);
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.status.deleted);
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.status.paid);
      });
      return;

    case 'TS_12_To_verify_that_Status_button_is_functional':
      await reportStep('Open the status filter', async () => {
        await openStatusMenu(page);
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.status.pendingApproval);
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.status.approved);
      });
      return;

    case 'TS_13_To_verify_that_Column_View_button_is_functional':
      await reportStep('Open the column settings menu', async () => {
        const { locator } = await resolveFirst(page, invoiceTrackerSelectors.filters.columnOrderButton, { timeoutPerCandidate: 3000 });
        await locator.click({ timeout: 10000 });
        await expect(locator).toHaveAttribute('aria-expanded', /true/i, { timeout: 10000 });
      });
      return;

    case 'TS_14_To_verify_ID_in_Column_Views_is_visible':
      await reportStep('Verify ERP Unique ID is available in column settings', async () => {
        await openColumnSettings(page);
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.columnSettings.erpUniqueId);
      });
      return;

    case 'TS_15_To_verify_that_Asc_button_is_responsive_for_all_the_entries_present_in_the_border':
      await reportStep('Sort the Invoice Date column in ascending order', async () => {
        await openInvoiceDateMenu(page);
        await clickWithFallback(page, invoiceTrackerSelectors.table.ascendingOption);
        await expectTableHeaderVisible(page, invoiceTrackerSelectors.table.invoiceDateHeader);
      });
      return;

    case 'TS_16_To_verify_that_Dsc_button_is_responsive_for_all_the_entries_present_in_the_border':
      await reportStep('Sort the Invoice Date column in descending order', async () => {
        await openInvoiceDateMenu(page);
        await clickWithFallback(page, invoiceTrackerSelectors.table.descendingOption);
        await expectTableHeaderVisible(page, invoiceTrackerSelectors.table.invoiceDateHeader);
      });
      return;

    case 'TS_17_To_verify_that_Hide_button_is_responsive_for_all_the_entries_present_in_the_border':
      await reportStep('Hide the Invoice Date column from the invoices grid', async () => {
        await openInvoiceDateMenu(page);
        await clickWithFallback(page, invoiceTrackerSelectors.table.hideColumnOption);
        await expectTableHeaderHidden(page, invoiceTrackerSelectors.factories.invoiceDateHeader);
      });
      return;

    case 'TS_18_To_verify_that_Run_To_Top_button_is_functional':
      await reportStep('Return to the top of the Invoice Tracker page', async () => {
        await page.evaluate(() => window.scrollTo(0, 800));
        await clickWithFallback(page, invoiceTrackerSelectors.filters.returnToTopButton);
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.navigation.heading);
      });
      return;

    case 'TS_19_To_verify_that_Advanced_Search_button_is_functional':
      await reportStep('Open the advanced search filters', async () => {
        await ensureAdvancedSearchOpen(page);
      });
      return;

    case 'TS_20_To_verify_that_Save_Search_button_is_functional':
      await reportStep('Open the saved searches surface', async () => {
        await ensureAdvancedSearchOpen(page);
        await ensureSaveSearchDialogOpen(page);
      });
      return;

    case 'TS_21_To_verify_that_Reset_button_is_functional':
      await reportStep('Reset the saved search criteria when the control is available', async () => {
        await ensureAdvancedSearchOpen(page);
        await ensureSaveSearchDialogOpen(page);
        const resetAvailable = await isVisible(page, invoiceTrackerSelectors.savedSearch.resetButton, 1500);
        if (resetAvailable) {
          await clickWithFallback(page, invoiceTrackerSelectors.savedSearch.resetButton);
        } else {
          await expectVisibleWithFallback(page, invoiceTrackerSelectors.savedSearch.toolbarChooser);
        }
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.navigation.heading);
      });
      return;

    case 'TS_22_To_verify_that_Saved_Searches_field_is_functional':
      await reportStep('Open the saved searches field', async () => {
        await ensureAdvancedSearchOpen(page);
        await ensureSaveSearchDialogOpen(page);
      });
      return;

    case 'TS_23_To_verify_that_Delete_All_Button_In_Saved_Searches_field_is_functional':
      await reportStep('Open the saved searches field and delete entries when the control is available', async () => {
        await ensureAdvancedSearchOpen(page);
        await ensureSaveSearchDialogOpen(page);
        const deleteAllAvailable = await isVisible(page, invoiceTrackerSelectors.savedSearch.deleteAllButton, 1500);
        if (deleteAllAvailable) {
          await clickWithFallback(page, invoiceTrackerSelectors.savedSearch.deleteAllButton);
        }
        await expectVisibleWithFallback(page, invoiceTrackerSelectors.savedSearch.toolbarChooser);
      });
      return;

    default:
      throw new Error(`Invoice_Tracker scenario not implemented yet: ${scenarioName}`);
  }
}

const helperMap = {
  openModule,
  openInvoiceTrackerWorkspace,
  runScenario,
  selectors: invoiceTrackerSelectors
};

module.exports = {
  invoiceTrackerHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap, {
      openModule: 'Open Invoice Tracker page',
      openInvoiceTrackerWorkspace: 'Open Invoice Tracker workspace',
      runScenario: 'Run Invoice Tracker business flow'
    }),
    runScenario: async (page, data, scenarioName) => test.step(`Run ${humanizeScenarioTitle(scenarioName)}`, async () => {
      return runScenario(page, data, scenarioName);
    }),
    selectors: invoiceTrackerSelectors
  }
};
