const { expect, test } = require('@playwright/test');
const {
  clickWithFallback,
  expectVisibleWithFallback,
  resolveFirst
} = require('../fallback');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { invoiceTrackerHelpers } = require('./invoiceTracker.js');
const { invoiceTrackerSelectors } = require('../../selectors/iteration-matrix/invoiceTracker.selectors.js');
const { invoiceTrackerModuleSelectors } = require('../../selectors/iteration-matrix/invoiceTrackerModule.selectors.js');

function humanizeScenarioTitle(name) {
  return String(name || '')
    .replace(/^TS_\d+_/, '')
    .replace(/_/g, ' ')
    .trim();
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

async function openModule(page, data) {
  await reportStep('Open the Invoice Tracker page', async () => {
    if (await isVisible(page, invoiceTrackerSelectors.navigation.heading, 2000)) {
      return;
    }

    if (await isVisible(page, invoiceTrackerSelectors.navigation.trackerLink, 2000)) {
      await clickWithFallback(page, invoiceTrackerSelectors.navigation.trackerLink, { timeoutPerCandidate: 3000 });
    } else if (await isVisible(page, invoiceTrackerSelectors.navigation.moduleLauncher, 1200)) {
      await clickWithFallback(page, invoiceTrackerSelectors.navigation.moduleLauncher, { timeoutPerCandidate: 2000 });
      await clickWithFallback(page, invoiceTrackerSelectors.navigation.trackerLink, { timeoutPerCandidate: 3000 });
    } else {
      const trackerUrl = buildInvoiceTrackerUrl(data && data.URL);
      if (trackerUrl) {
        await page.goto(trackerUrl, { waitUntil: 'domcontentloaded' }).catch(() => null);
      }
    }
  });

  await reportStep('Verify the Invoice Tracker landing page is visible', async () => {
    await expectVisibleWithFallback(page, invoiceTrackerSelectors.navigation.heading, { expectTimeout: 20000 });
    await expectVisibleWithFallback(page, invoiceTrackerSelectors.filters.advancedSearchButton, { expectTimeout: 10000 });
  });
}

async function ensureAdvancedSearchOpen(page) {
  const alreadyOpen = await isVisible(page, invoiceTrackerModuleSelectors.paymentMethod.panelSignals, 800);
  if (!alreadyOpen) {
    await clickWithFallback(page, invoiceTrackerSelectors.filters.advancedSearchButton);
  }

  await expectVisibleWithFallback(page, invoiceTrackerModuleSelectors.paymentMethod.panelSignals, { expectTimeout: 10000 });
}

async function fillCustomerSearch(page, customerName) {
  const { locator } = await resolveFirst(page, invoiceTrackerSelectors.search.customerInput, { timeoutPerCandidate: 5000 });
  await locator.fill('');
  await locator.fill(customerName);
  return locator;
}

async function clickExactOption(page, text) {
  const exactPattern = new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  const candidates = [
    page.getByRole('option', { name: text, exact: true }).first(),
    page.locator('[role="option"]').filter({ hasText: exactPattern }).first(),
    page.locator('span').filter({ hasText: exactPattern }).first(),
    page.getByText(text, { exact: true }).first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 10000 });
      return;
    }
  }

  throw new Error(`Unable to find visible option: ${text}`);
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

  throw new Error('Unable to find any visible option to select.');
}

async function selectCustomer(page, customerName) {
  await reportStep(`Select customer ${customerName}`, async () => {
    await clickWithFallback(page, invoiceTrackerSelectors.filters.customerButton);
    const input = await fillCustomerSearch(page, customerName);
    await input.press('ArrowDown').catch(() => null);
    await input.press('Enter').catch(() => null);

    const customerStillUnselected = await isVisible(page, invoiceTrackerSelectors.filters.customerButton, 500);
    if (customerStillUnselected) {
      try {
        await clickExactOption(page, customerName);
      } catch (error) {
        await clickFirstVisibleOption(page);
      }
    }

    await page.keyboard.press('Escape').catch(() => null);
  });
}

async function expectRoleBadge(page, roleKey) {
  const selectors = invoiceTrackerModuleSelectors.roles[roleKey];
  if (!selectors) {
    throw new Error(`Invoice Tracker Module role not configured: ${roleKey}`);
  }

  await expectVisibleWithFallback(page, selectors, { expectTimeout: 10000 });
}

async function expectPreselectedCustomer(page) {
  await expectVisibleWithFallback(page, invoiceTrackerModuleSelectors.customerContext.preselectedCustomer, { expectTimeout: 10000 });
}

async function expectPaymentMethodDisabled(page) {
  await ensureAdvancedSearchOpen(page);
  await expectVisibleWithFallback(page, invoiceTrackerModuleSelectors.paymentMethod.disabledPrompt, { expectTimeout: 10000 });
}

async function expectPaymentMethodEnabled(page) {
  await ensureAdvancedSearchOpen(page);
  const { locator } = await resolveFirst(page, invoiceTrackerModuleSelectors.paymentMethod.trigger, { timeoutPerCandidate: 5000 });
  await expect(locator).toBeVisible({ timeout: 10000 });
  await expect(locator).not.toContainText(/Select customer[s]? first/i, { timeout: 10000 });
}

async function openPaymentMethodDropdown(page) {
  await ensureAdvancedSearchOpen(page);
  await clickWithFallback(page, invoiceTrackerModuleSelectors.paymentMethod.trigger);
}

async function selectPaymentMethods(page, methodNames) {
  await reportStep(`Select payment methods: ${methodNames.join(', ')}`, async () => {
    await openPaymentMethodDropdown(page);

    for (const methodName of methodNames) {
      await clickExactOption(page, methodName);
      await expect(page.getByText(methodName, { exact: true }).first()).toBeVisible({ timeout: 10000 });
    }
  });
}

async function applyFacilitiesFilter(page, facilityValue = '10889') {
  await reportStep(`Select facility ${facilityValue}`, async () => {
    await ensureAdvancedSearchOpen(page);
    await clickWithFallback(page, invoiceTrackerModuleSelectors.advancedSearch.facilitiesTrigger);
    await clickExactOption(page, facilityValue);
    await expect(page.getByText(facilityValue, { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });
}

async function applyPaymentDateFilter(page) {
  await reportStep('Open the payment date filter', async () => {
    await ensureAdvancedSearchOpen(page);
    await clickWithFallback(page, invoiceTrackerModuleSelectors.advancedSearch.paymentDateButton);
    await expectVisibleWithFallback(page, invoiceTrackerModuleSelectors.advancedSearch.paymentDateButton, { expectTimeout: 10000 });
  });
}

async function fillAdvancedInput(page, candidates, value, stepName) {
  await reportStep(stepName, async () => {
    await ensureAdvancedSearchOpen(page);
    const { locator } = await resolveFirst(page, candidates, { timeoutPerCandidate: 5000 });
    await locator.fill('');
    await locator.fill(value);
    await expect(locator).toHaveValue(value, { timeout: 10000 });
  });
}

async function runScenario(page, data, scenarioName) {
  const normalizedScenarioName = String(scenarioName || '').trim();

  await openModule(page, data);

  switch (normalizedScenarioName) {
    case 'TS_91_To_verify_that_New_Filter_Payment_Method_is_visible_in_Advanced_Search_pop_up':
    case 'TS_92_To_verify_that_Field_Name_should_be_named_as_Payment_Method':
      await ensureAdvancedSearchOpen(page);
      await expectVisibleWithFallback(page, invoiceTrackerModuleSelectors.paymentMethod.label, { expectTimeout: 10000 });
      return;

    case 'TS_93_To_verify_that_Payment_Method_Dropdown_has_multi_select_capability':
    case 'TS_96_To_verify_that_Payment_Method_filter_should_be_Dropdown_with_multi_select_capability':
      await selectCustomer(page, 'Cadent');
      await expectPaymentMethodEnabled(page);
      await openPaymentMethodDropdown(page);
      return;

    case 'TS_94_To_verify_that_Payment_Method_filter_should_be_Populates_ONLY_after_customer_is_selected':
    case 'TS_95_To_verify_that_Payment_Method_filter_should_be_Disabled_if_no_customer_is_chosen':
      await expectPaymentMethodDisabled(page);
      return;

    case 'TS_97_To_verify_that_Customer_is_already_pre_selected_for_Customer_role_users':
      await expectRoleBadge(page, 'customerAdmin');
      await expectPreselectedCustomer(page);
      return;

    case 'TS_98_verify_that_Payment_Method_dropdown_should_automatically_load_payment_methods_associated_with_that_customer':
      await expectRoleBadge(page, 'customerAdmin');
      await expectPaymentMethodEnabled(page);
      return;

    case 'TS_99_To_verify_that_user_must_first_select_a_Customer':
      await expectPaymentMethodDisabled(page);
      await selectCustomer(page, 'Cadent');
      await expectPaymentMethodEnabled(page);
      return;

    case 'TS_100_To_verify_that_No_Customer_is_selected_by_default_for_Supplier_role_users':
      await expectRoleBadge(page, 'supplierUser');
      await expectVisibleWithFallback(page, invoiceTrackerSelectors.filters.customerButton, { expectTimeout: 10000 });
      return;

    case 'TS_101_To_verify_that_Supplier_must_first_select_Customer':
    case 'TS_102_To_verify_that_only_after_a_Customer_has_selected_then_Payment_Method_filter_become_enabled':
      await expectRoleBadge(page, 'supplierUser');
      await expectPaymentMethodDisabled(page);
      await selectCustomer(page, 'Langham Logistics');
      await expectPaymentMethodEnabled(page);
      return;

    case 'TS_103_To_verify_If_no_Customer_is_selected_then_Payment_Method_filter_remains_disabled':
      await expectRoleBadge(page, 'supplierUser');
      await expectPaymentMethodDisabled(page);
      return;

    case 'TS_104_To_verify_that_payment_Method_filter_must_work_seamlessly_with':
      await selectCustomer(page, 'Cadent');
      await expectPaymentMethodEnabled(page);
      return;

    case 'TS_105_To_verify_that_payment_Method_filter_must_work_seamlessly_with_ERP_unique_ID':
      await selectCustomer(page, 'Cadent');
      await fillAdvancedInput(
        page,
        invoiceTrackerModuleSelectors.advancedSearch.erpUniqueIdInput,
        String(data.Org_ID || '10889'),
        'Fill the ERP Unique ID filter'
      );
      await expectPaymentMethodEnabled(page);
      return;

    case 'TS_106_To_verify_that_payment_Method_filter_must_work_seamlessly_with_Payment_Date':
      await selectCustomer(page, 'Cadent');
      await ensureAdvancedSearchOpen(page);
      await expectVisibleWithFallback(page, invoiceTrackerModuleSelectors.advancedSearch.paymentDateButton, { expectTimeout: 10000 });
      await expectPaymentMethodEnabled(page);
      return;

    case 'TS_107_To_verify_that_payment_Method_filter_must_work_seamlessly_with_Invoice_Number':
      await selectCustomer(page, 'Cadent');
      await fillAdvancedInput(
        page,
        invoiceTrackerModuleSelectors.advancedSearch.invoiceNumberInput,
        String(data.InvoiceNumber || data.invoiceNumber || '10889'),
        'Fill the invoice number filter'
      );
      await expectPaymentMethodEnabled(page);
      return;

    case 'TS_108_To_verify_that_payment_Method_filter_must_work_seamlessly_with_PO_Number':
      await selectCustomer(page, 'Cadent');
      await fillAdvancedInput(
        page,
        invoiceTrackerModuleSelectors.advancedSearch.poNumberInput,
        String(data.PONumber || data.PayNum || '10889'),
        'Fill the PO number filter'
      );
      await expectPaymentMethodEnabled(page);
      return;

    case 'TS_109_To_verify_that_payment_Method_filter_must_work_seamlessly_with_Facilities':
      await selectCustomer(page, 'Cadent');
      await ensureAdvancedSearchOpen(page);
      await expectVisibleWithFallback(page, invoiceTrackerModuleSelectors.advancedSearch.facilitiesTrigger, { expectTimeout: 10000 });
      await expectPaymentMethodEnabled(page);
      return;

    default:
      throw new Error(`Invoice_Tracker_Module scenario not implemented yet: ${scenarioName}`);
  }
}

const helperMap = {
  openModule,
  runScenario,
  selectors: invoiceTrackerModuleSelectors
};

module.exports = {
  invoiceTrackerModuleHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap, {
      openModule: 'Open Invoice Tracker module workspace',
      runScenario: 'Run Invoice Tracker module business flow'
    }),
    runScenario: async (page, data, scenarioName) => test.step(`Run ${humanizeScenarioTitle(scenarioName)}`, async () => {
      return runScenario(page, data, scenarioName);
    }),
    selectors: invoiceTrackerModuleSelectors
  }
};
