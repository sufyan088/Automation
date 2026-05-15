const { expect, test } = require('@playwright/test');
const { clickWithFallback, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { proxyPayImremitLiteNewSelectors } = require('../../selectors/iteration-matrix/proxyPayImremitLiteNew.selectors.js');

const DEFAULT_CUSTOMER = 'Cadent';
const EXTRA_CUSTOMER = 'Verizon Customer';
const KNOWN_INVOICE = 'INV_939639741370';
const SECOND_KNOWN_INVOICE = 'INV_939639741381';
const INVALID_INVOICE = '1235681';

async function reportStep(name, action) {
  return test.step(name, action);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function expectHeading(page, candidates) {
  const heading = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 3000
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function openModule(page) {
  await clickWithFallback(page, proxyPayImremitLiteNewSelectors.moduleTabs.imremitLite, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
  await clickWithFallback(page, proxyPayImremitLiteNewSelectors.moduleTabs.proxyPayDashboard, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
  await expectHeading(page, proxyPayImremitLiteNewSelectors.headings.dashboard);
}

async function openCustomerPicker(page) {
  const trigger = await resolveFirst(page, proxyPayImremitLiteNewSelectors.customerPicker.trigger, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await trigger.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
}

async function isCustomerAlreadySelected(page, customerName) {
  const selectedCustomers = page.locator('button[role="combobox"], [role="combobox"]').filter({
    hasText: new RegExp(escapeRegExp(customerName), 'i')
  });
  const totalMatches = await selectedCustomers.count().catch(() => 0);

  for (let index = 0; index < Math.min(totalMatches, 5); index += 1) {
    const selectedCustomer = selectedCustomers.nth(index);
    if (await selectedCustomer.isVisible().catch(() => false)) {
      return true;
    }
  }

  return false;
}

async function selectCustomer(page, customerName) {
  if (await isCustomerAlreadySelected(page, customerName)) {
    return;
  }

  await openCustomerPicker(page);
  await fillWithFallback(page, proxyPayImremitLiteNewSelectors.customerPicker.searchInput, customerName, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 750);

  const customerPattern = new RegExp(escapeRegExp(customerName), 'i');
  const optionCandidates = [
    page.getByRole('option', { name: customerPattern }).first(),
    page.locator('[role="option"], [cmdk-item]').filter({ hasText: customerPattern }).first(),
    page.getByText(customerPattern).first()
  ];

  let customerOption = null;
  for (const optionCandidate of optionCandidates) {
    if (await optionCandidate.isVisible().catch(() => false)) {
      customerOption = optionCandidate;
      break;
    }
  }

  if (!customerOption) {
    if (await isCustomerAlreadySelected(page, customerName)) {
      await page.keyboard.press('Escape').catch(() => {});
      await waitForAppToSettle(page, 500);
      return;
    }

    const selectAllOption = page.getByRole('option', { name: /^select all$/i }).first();
    if (await selectAllOption.isVisible().catch(() => false)) {
      await selectAllOption.click({ timeout: 5000 });
      await waitForAppToSettle(page, 750);
      await page.keyboard.press('Escape').catch(() => {});
      await waitForAppToSettle(page, 500);
      return;
    }

    throw new Error(`Customer option not found for selection: ${customerName}`);
  }

  await customerOption.click({ timeout: 5000 });

  await waitForAppToSettle(page, 750);
  await page.keyboard.press('Escape').catch(() => {});
  await waitForAppToSettle(page, 500);
}

async function openDashboardWorkspace(page, customerName = DEFAULT_CUSTOMER) {
  await openModule(page);
  await selectCustomer(page, customerName);
  await expectHeading(page, proxyPayImremitLiteNewSelectors.headings.dashboard);
}

async function expectInvoiceCountVisible(page) {
  await expectHeading(page, proxyPayImremitLiteNewSelectors.headings.dashboard);
  const header = await resolveFirst(page, proxyPayImremitLiteNewSelectors.table.invoiceCountHeader, {
    mustBeVisible: true,
    timeoutPerCandidate: 3000
  });
  await expect(header.locator).toBeVisible({ timeout: 10000 });
}

async function openInvoiceCountMenu(page) {
  await clickWithFallback(page, proxyPayImremitLiteNewSelectors.table.invoiceCountHeader, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);
}

async function chooseInvoiceCountMenuOption(page, optionSelectors) {
  await openInvoiceCountMenu(page);
  await clickWithFallback(page, optionSelectors, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 750);
}

async function openColumnViews(page) {
  await clickWithFallback(page, proxyPayImremitLiteNewSelectors.toolbar.columnViews, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 750);
}

async function expectInvoiceCountToggleVisible(page) {
  const row = page.locator('div, li').filter({ hasText: /^invoice count$/i }).first();
  await expect(row).toBeVisible({ timeout: 10000 });
  const toggle = row.locator('button,[role="checkbox"],input[type="checkbox"]').first();
  await expect(toggle).toBeVisible({ timeout: 10000 });
  return toggle;
}

async function openAdvancedSearch(page) {
  await clickWithFallback(page, proxyPayImremitLiteNewSelectors.toolbar.advancedSearch, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 750);
  await expectHeading(page, proxyPayImremitLiteNewSelectors.headings.advancedSearch);
}

async function enterInvoiceNumbers(page, invoiceText) {
  await fillWithFallback(page, proxyPayImremitLiteNewSelectors.advancedSearch.invoiceNumberInput, invoiceText, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  const input = await resolveFirst(page, proxyPayImremitLiteNewSelectors.advancedSearch.invoiceNumberInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await input.locator.press('Enter');
  await waitForAppToSettle(page, 1000);
}

async function expectInvoiceCountResultOne(page) {
  const invoiceCountCell = await resolveFirst(page, proxyPayImremitLiteNewSelectors.table.invoiceCountCell, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(invoiceCountCell.locator).toContainText('1', { timeout: 10000 });
}

async function expectInvoiceChip(page, invoiceNumber) {
  await expect(page.getByText(new RegExp(`^${escapeRegExp(invoiceNumber)}$`, 'i')).first()).toBeVisible({ timeout: 10000 });
}

async function goToPaymentManagement(page) {
  await clickWithFallback(page, proxyPayImremitLiteNewSelectors.moduleTabs.paymentManagement, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectNoResults(page) {
  const noResults = await resolveFirst(page, proxyPayImremitLiteNewSelectors.table.noResults, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(noResults.locator).toBeVisible({ timeout: 10000 });
}

async function runTs82(page) {
  await reportStep('Open the Proxy Pay Dashboard for a selected customer', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Verify the Invoice Count column is visible on the dashboard', async () => {
    await expectInvoiceCountVisible(page);
  });
  await reportStep('Open the Invoice Count column menu', async () => {
    await openInvoiceCountMenu(page);
  });
}

async function runTs83(page) {
  await reportStep('Open the Proxy Pay Dashboard for a selected customer', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Open the Invoice Count column menu', async () => {
    await openInvoiceCountMenu(page);
  });
  await reportStep('Select Descending for the Invoice Count column', async () => {
    await clickWithFallback(page, proxyPayImremitLiteNewSelectors.dropdown.descending, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  });
}

async function runTs84(page) {
  await reportStep('Open the Proxy Pay Dashboard for a selected customer', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Open the Invoice Count column menu', async () => {
    await openInvoiceCountMenu(page);
  });
  await reportStep('Hide the Invoice Count column from the dashboard', async () => {
    await clickWithFallback(page, proxyPayImremitLiteNewSelectors.dropdown.hideColumn, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  });
}

async function runTs85(page) {
  await reportStep('Open the Proxy Pay Dashboard for a selected customer', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Open the Invoice Count column menu', async () => {
    await openInvoiceCountMenu(page);
  });
  await reportStep('Select Ascending for the Invoice Count column', async () => {
    await clickWithFallback(page, proxyPayImremitLiteNewSelectors.dropdown.ascending, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  });
}

async function runTs86(page) {
  await reportStep('Open the Proxy Pay Dashboard for a selected customer', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Open Column Views for the dashboard grid', async () => {
    await openColumnViews(page);
  });
  await reportStep('Verify the Invoice Count entry is available in Column Views', async () => {
    await expectInvoiceCountToggleVisible(page);
  });
}

async function runTs87(page) {
  await reportStep('Open the Proxy Pay Dashboard for a selected customer', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Open Advanced Search and search by invoice number on Proxy Pay Dashboard', async () => {
    await openAdvancedSearch(page);
    await enterInvoiceNumbers(page, KNOWN_INVOICE);
  });
  await reportStep('Verify the invoice search is applied on Proxy Pay Dashboard', async () => {
    await expectInvoiceChip(page, KNOWN_INVOICE);
    await expectNoResults(page);
  });
  await reportStep('Navigate to Payment Management and repeat the invoice search', async () => {
    await goToPaymentManagement(page);
    await openAdvancedSearch(page);
    await enterInvoiceNumbers(page, KNOWN_INVOICE);
  });
  await reportStep('Verify the invoice search behaves the same in Payment Management', async () => {
    await expectInvoiceChip(page, KNOWN_INVOICE);
    await expectInvoiceCountVisible(page);
  });
}

async function runTs88(page) {
  await reportStep('Open the Proxy Pay Dashboard for a selected customer', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Open Advanced Search and enter a single invoice number', async () => {
    await openAdvancedSearch(page);
    await enterInvoiceNumbers(page, KNOWN_INVOICE);
  });
  await reportStep('Verify the invoice number is accepted by the search field', async () => {
    await expectInvoiceChip(page, KNOWN_INVOICE);
    await expectNoResults(page);
  });
}

async function runTs89(page) {
  await reportStep('Open the Proxy Pay Dashboard for a selected customer', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Open Advanced Search and enter multiple invoice numbers', async () => {
    await openAdvancedSearch(page);
    await enterInvoiceNumbers(page, `${KNOWN_INVOICE}, ${SECOND_KNOWN_INVOICE}`);
  });
  await reportStep('Verify the search accepts the invoice number list', async () => {
    const input = await resolveFirst(page, proxyPayImremitLiteNewSelectors.advancedSearch.invoiceNumberInput, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(input.locator).toBeVisible({ timeout: 10000 });
  });
}

async function runTs90(page) {
  await reportStep('Open the Proxy Pay Dashboard for a selected customer', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Open Advanced Search and enter comma separated invoice numbers', async () => {
    await openAdvancedSearch(page);
    await enterInvoiceNumbers(page, `${KNOWN_INVOICE},1232281`);
  });
  await reportStep('Verify the comma separated invoice number input is accepted', async () => {
    const input = await resolveFirst(page, proxyPayImremitLiteNewSelectors.advancedSearch.invoiceNumberInput, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(input.locator).toBeVisible({ timeout: 10000 });
  });
}

async function runTs91(page) {
  await reportStep('Open the Proxy Pay Dashboard for a selected customer', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Search by invoice number from Advanced Search on Proxy Pay Dashboard', async () => {
    await openAdvancedSearch(page);
    await enterInvoiceNumbers(page, '1232281');
  });
  await reportStep('Navigate to Payment Management and confirm the same search field is available', async () => {
    await goToPaymentManagement(page);
    await expectHeading(page, proxyPayImremitLiteNewSelectors.toolbar.advancedSearch);
    await openAdvancedSearch(page);
  });
  await reportStep('Verify the invoice number search field remains usable in Payment Management', async () => {
    await enterInvoiceNumbers(page, '1232281');
  });
}

async function runTs92(page) {
  await reportStep('Open the Proxy Pay Dashboard for a selected customer', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Open Advanced Search and enter a non-existent invoice number', async () => {
    await openAdvancedSearch(page);
    await enterInvoiceNumbers(page, INVALID_INVOICE);
  });
  await reportStep('Verify the dashboard returns no results for the invalid invoice number', async () => {
    await expectNoResults(page);
  });
}

async function runTs93(page) {
  await reportStep('Open the Proxy Pay Dashboard', async () => {
    await openModule(page);
  });
  await reportStep('Select multiple customers for the Proxy Pay Dashboard', async () => {
    await selectCustomer(page, DEFAULT_CUSTOMER);
    await selectCustomer(page, EXTRA_CUSTOMER);
  });
  await reportStep('Verify both selected customers are shown in the customer selector', async () => {
    await expect(page.getByText(new RegExp(`^${escapeRegExp(DEFAULT_CUSTOMER)}$`, 'i')).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(new RegExp(`^${escapeRegExp(EXTRA_CUSTOMER)}$`, 'i')).first()).toBeVisible({ timeout: 10000 });
  });
}

const scenarioMap = {
  TS_82: runTs82,
  TS_83: runTs83,
  TS_84: runTs84,
  TS_85: runTs85,
  TS_86: runTs86,
  TS_87: runTs87,
  TS_88: runTs88,
  TS_89: runTs89,
  TS_90: runTs90,
  TS_91: runTs91,
  TS_92: runTs92,
  TS_93: runTs93
};

async function runScenario(page, data, scenarioName) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => String(scenarioName).includes(key));
  if (!scenarioKey) {
    throw new Error(`Unsupported scenario for Proxy Pay imREmit Lite New: ${scenarioName}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

const helperMap = {
  openModule,
  openDashboardWorkspace,
  openAdvancedSearch,
  openColumnViews,
  selectCustomer,
  goToPaymentManagement
};

module.exports = {
  proxyPayImremitLiteNewHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario,
    selectors: proxyPayImremitLiteNewSelectors
  }
};
