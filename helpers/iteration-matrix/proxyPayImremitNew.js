const { expect, test } = require('@playwright/test');
const { clickIfFound, clickWithFallback, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { proxyPayImremitNewSelectors } = require('../../selectors/iteration-matrix/proxyPayImremitNew.selectors.js');

const DEFAULT_CUSTOMER = 'Verizon Customer';
const MULTI_CUSTOMERS = ['Cadent', 'Cardworks'];
const INVOICE_COUNT_LABEL = 'Invoice Count';
const TS55_INVOICE_INPUT = '88686';
const TS56_INVOICE_INPUT = 'WEBTEST2';
const TS57_INVOICE_INPUT = 'WEBTEST2, 116190';
const TS58_INVOICE_INPUT = 'WEBTEST2,QSSSRP091';
const TS59_INVOICE_INPUT = 'WEBTEST2';
const TS60_INVOICE_INPUT = 'WEBTE7772';

async function reportStep(name, action) {
  return test.step(name, action);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseInvoiceCount(value) {
  const normalized = String(value || '').replace(/,/g, '').match(/-?\d+/);
  return normalized ? Number(normalized[0]) : Number.NaN;
}

async function openModule(page) {
  await clickIfFound(page, proxyPayImremitNewSelectors.moduleTabs.imremit, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
  return page;
}

async function openProxyPayDashboard(page) {
  await clickWithFallback(page, proxyPayImremitNewSelectors.moduleTabs.proxyPayDashboard, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function goToPaymentManagement(page) {
  await clickWithFallback(page, proxyPayImremitNewSelectors.moduleTabs.paymentManagement, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function openCustomerPicker(page) {
  const trigger = await resolveFirst(page, proxyPayImremitNewSelectors.customerPicker.trigger, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await trigger.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
  return trigger.locator;
}

async function searchAndSelectCustomer(page, customerName) {
  await fillWithFallback(page, proxyPayImremitNewSelectors.customerPicker.searchInput, customerName, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 750);

  const optionByRole = page.getByRole('option', { name: new RegExp(escapeRegExp(customerName), 'i') }).first();
  if (await optionByRole.isVisible().catch(() => false)) {
    await optionByRole.click({ timeout: 5000 });
    await waitForAppToSettle(page, 500);
    return;
  }

  const optionByText = page.getByText(new RegExp(`^${escapeRegExp(customerName)}$`, 'i')).first();
  await expect(optionByText).toBeVisible({ timeout: 10000 });
  await optionByText.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
}

async function selectCustomers(page, customerNames) {
  await openCustomerPicker(page);
  for (const customerName of customerNames) {
    await searchAndSelectCustomer(page, customerName);
  }
  await page.keyboard.press('Escape').catch(() => {});
  await waitForAppToSettle(page, 500);
}

async function selectDefaultCustomer(page, data) {
  const candidate = DEFAULT_CUSTOMER || data.CustomerName || data.Customer || data.Customer_Name;
  if (!candidate) {
    return;
  }

  const trigger = await resolveFirst(page, proxyPayImremitNewSelectors.customerPicker.trigger, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  const currentText = ((await trigger?.locator.textContent().catch(() => '')) || '').trim();
  if (currentText && new RegExp(escapeRegExp(candidate), 'i').test(currentText)) {
    return;
  }

  await selectCustomers(page, [candidate]);
}

async function expectProxyPayWorkspaceVisible(page) {
  const header = await resolveFirst(page, proxyPayImremitNewSelectors.headings.invoiceCount, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(header.locator).toBeVisible({ timeout: 10000 });
}

async function openProxyPayWorkspace(page, data, options = {}) {
  await openModule(page);
  await openProxyPayDashboard(page);

  if (Array.isArray(options.customers) && options.customers.length > 0) {
    await selectCustomers(page, options.customers);
  } else {
    await selectDefaultCustomer(page, data);
  }

  await expectProxyPayWorkspaceVisible(page);
}

async function clickResolvedLocator(locator) {
  await locator.scrollIntoViewIfNeeded().catch(() => null);
  try {
    await locator.click({ timeout: 10000 });
  } catch (error) {
    if (!/intercepts pointer events|outside of the viewport/i.test(error.message)) {
      throw error;
    }
    await locator.evaluate((element) => element.click());
  }
}

async function clickLocatorCenter(page, locator) {
  await locator.scrollIntoViewIfNeeded().catch(() => null);
  const box = await locator.boundingBox().catch(() => null);

  if (!box) {
    return false;
  }

  await page.mouse.click(box.x + (box.width / 2), box.y + (box.height / 2));
  return true;
}

async function isSortMenuVisible(page) {
  const sortMenu = page.locator('[role="menu"], [data-radix-popper-content-wrapper]').filter({
    hasText: /ascending|descending|hide column|hide/i
  }).first();
  return sortMenu.isVisible().catch(() => false);
}

async function clickHeaderAndChoose(page, label, actionCandidates) {
  const actionIndex = actionCandidates === proxyPayImremitNewSelectors.menus.ascending
    ? 0
    : actionCandidates === proxyPayImremitNewSelectors.menus.descending
      ? 1
      : actionCandidates === proxyPayImremitNewSelectors.menus.hideColumn
        ? 2
        : null;
  const header = await resolveFirst(page, proxyPayImremitNewSelectors.table.header(label), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await clickResolvedLocator(header.locator);
  await waitForAppToSettle(page, 500);

  const menuAction = await resolveFirst(page, actionCandidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500,
    maxCandidateMatches: 20
  }).catch(() => null);

  if (menuAction) {
    await menuAction.locator.click({ timeout: 5000, force: true }).catch(async () => {
      const clickedByPosition = await clickLocatorCenter(page, menuAction.locator).catch(() => false);
      if (!clickedByPosition) {
        await menuAction.locator.dispatchEvent('click').catch(async () => {
          await menuAction.locator.evaluate((element) => {
            const clickable = element.closest('[role="menuitem"], button, [aria-haspopup="menu"], div');
            clickable?.click();
          });
        });
      }
    });
    await waitForAppToSettle(page, 750);

    if (await isSortMenuVisible(page)) {
      await menuAction.locator.evaluate((element) => {
        const clickable = element.closest('[role="menuitem"], button, [aria-haspopup="menu"], div');
        clickable?.click();
      }).catch(() => null);
      await waitForAppToSettle(page, 750);
    }

    if (!(await isSortMenuVisible(page))) {
      return;
    }
  }

  if (actionIndex !== null) {
    for (let index = 0; index <= actionIndex; index += 1) {
      await page.keyboard.press('ArrowDown').catch(() => null);
      await waitForAppToSettle(page, 150);
    }
    await page.keyboard.press('Enter').catch(() => null);
    await waitForAppToSettle(page, 750);
    return;
  }

  throw new Error(`Unable to find menu action for ${label}.`);
}

async function getColumnIndexByLabel(page, label) {
  const headers = page.locator('table thead tr th');
  const total = await headers.count();
  for (let index = 0; index < total; index += 1) {
    const text = ((await headers.nth(index).textContent().catch(() => '')) || '').trim();
    if (new RegExp(escapeRegExp(label), 'i').test(text)) {
      return index + 1;
    }
  }

  throw new Error(`${label} header was not found in the Proxy Pay Dashboard table.`);
}

async function getFirstVisibleDataRow(page) {
  const rows = page.locator('table tbody tr');
  const total = await rows.count();

  for (let index = 0; index < total; index += 1) {
    const row = rows.nth(index);
    if (!(await row.isVisible().catch(() => false))) {
      continue;
    }

    const visibleCells = await row.locator('td:visible').count().catch(() => 0);
    if (visibleCells > 0) {
      return row;
    }
  }

  throw new Error('No visible data rows were found in the Proxy Pay Dashboard table.');
}

async function getColumnTexts(page, label) {
  const columnIndex = await getColumnIndexByLabel(page, label);
  const rows = page.locator('table tbody tr');
  const total = await rows.count();
  const values = [];

  for (let index = 0; index < total; index += 1) {
    const row = rows.nth(index);
    if (!(await row.isVisible().catch(() => false))) {
      continue;
    }

    const cells = row.locator('td');
    const cellCount = await cells.count().catch(() => 0);
    if (cellCount < columnIndex) {
      continue;
    }

    const cell = cells.nth(columnIndex - 1);
    if (!(await cell.isVisible().catch(() => false))) {
      continue;
    }

    const text = ((await cell.textContent().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    if (text) {
      values.push(text);
    }
  }

  return values;
}

async function expectInvoiceCountColumnVisible(page) {
  const header = await resolveFirst(page, proxyPayImremitNewSelectors.headings.invoiceCount, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(header.locator).toBeVisible({ timeout: 10000 });
}

async function expectInvoiceCountColumnHidden(page) {
  await expect
    .poll(async () => {
      const headers = page.locator('table thead tr th');
      const total = await headers.count();
      let visibleMatches = 0;

      for (let index = 0; index < total; index += 1) {
        const header = headers.nth(index);
        if (!(await header.isVisible().catch(() => false))) {
          continue;
        }

        const text = ((await header.textContent().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
        if (/invoice count/i.test(text)) {
          visibleMatches += 1;
        }
      }

      return visibleMatches;
    }, { timeout: 10000 })
    .toBe(0);
}

async function expectInvoiceCountSorted(page, direction) {
  await expect
    .poll(async () => {
      const values = await getColumnTexts(page, INVOICE_COUNT_LABEL);
      const parsedValues = values.map(parseInvoiceCount);
      const hasEnoughRows = parsedValues.length > 1;
      const allNumbers = parsedValues.every((value) => !Number.isNaN(value));
      const sorted = [...parsedValues].sort((left, right) => direction === 'asc' ? left - right : right - left);

      return {
        parsedValues,
        hasEnoughRows,
        allNumbers,
        isSorted: hasEnoughRows && allNumbers && JSON.stringify(parsedValues) === JSON.stringify(sorted)
      };
    }, { timeout: 15000, intervals: [500, 1000] })
    .toMatchObject({
      hasEnoughRows: true,
      allNumbers: true,
      isSorted: true
    });
}

async function openColumnVisibilityMenu(page) {
  await clickWithFallback(page, proxyPayImremitNewSelectors.list.toggleColumnVisibility, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);
}

async function expectColumnOptionVisible(page, label) {
  const option = await resolveFirst(page, proxyPayImremitNewSelectors.table.columnOption(label), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(option.locator).toBeVisible({ timeout: 10000 });
  return option.locator;
}

async function findColumnOptionRow(page, label) {
  const escapedLabel = escapeRegExp(label);
  const drawerRow = page.locator('label, div').filter({
    hasText: new RegExp(`^${escapedLabel}$`, 'i'),
    has: page.locator('input[type="checkbox"], [role="checkbox"]')
  }).first();

  if (await drawerRow.isVisible().catch(() => false)) {
    return drawerRow;
  }

  const option = await expectColumnOptionVisible(page, label);
  return option.locator('xpath=ancestor::*[self::label or self::button or self::div][1]').first();
}

async function findColumnOptionCheckbox(page, label) {
  const row = await findColumnOptionRow(page, label);
  const nativeCheckbox = row.locator('input[type="checkbox"]').first();

  if ((await nativeCheckbox.count().catch(() => 0)) > 0) {
    return nativeCheckbox;
  }

  return row.locator('[role="checkbox"], [role="menuitemcheckbox"]').first();
}

async function isColumnOptionChecked(page, label) {
  const checkbox = await findColumnOptionCheckbox(page, label);

  if ((await checkbox.count().catch(() => 0)) === 0) {
    return false;
  }

  const inputType = await checkbox.getAttribute('type').catch(() => null);
  if (inputType === 'checkbox') {
    return checkbox.isChecked().catch(() => false);
  }

  const ariaChecked = await checkbox.getAttribute('aria-checked').catch(() => null);
  if (ariaChecked !== null) {
    return ariaChecked === 'true';
  }

  const markup = await checkbox.evaluate((element) => element.outerHTML).catch(() => '');
  return /checked|data-state="checked"|aria-checked="true"|lucide-check/i.test(markup);
}

async function expectColumnOptionChecked(page, label) {
  const isChecked = await isColumnOptionChecked(page, label);
  expect(isChecked).toBeTruthy();
}

async function toggleColumnOption(page, label) {
  const row = await findColumnOptionRow(page, label);
  const checkbox = await findColumnOptionCheckbox(page, label);
  const currentlyChecked = await isColumnOptionChecked(page, label);

  if (!currentlyChecked) {
    return;
  }

  const checkboxCount = await checkbox.count().catch(() => 0);
  const inputType = checkboxCount > 0 ? await checkbox.getAttribute('type').catch(() => null) : null;

  if (checkboxCount > 0 && inputType === 'checkbox') {
    await checkbox.uncheck({ force: true }).catch(() => null);
  } else if (checkboxCount > 0 && await checkbox.isVisible().catch(() => false)) {
    await clickResolvedLocator(checkbox);
  } else {
    await clickResolvedLocator(row);
  }

  await waitForAppToSettle(page, 750);

  await expect.poll(async () => isColumnOptionChecked(page, label), {
    timeout: 10000,
    intervals: [500, 1000]
  }).toBeFalsy();
}

async function openAdvancedSearch(page) {
  await clickWithFallback(page, proxyPayImremitNewSelectors.filters.advancedSearchToggle, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);

  const heading = await resolveFirst(page, proxyPayImremitNewSelectors.headings.advancedSearch, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function fillInvoiceNumbers(page, value, options = {}) {
  await fillWithFallback(page, proxyPayImremitNewSelectors.filters.invoiceNumbersInput, value, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);

  const input = await resolveFirst(page, proxyPayImremitNewSelectors.filters.invoiceNumbersInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  if (options.submit) {
    await input.locator.press('Enter').catch(async () => {
      await page.keyboard.press('Enter');
    });
    await waitForAppToSettle(page, 1000);
  }

  return input.locator;
}

async function expectInvoiceInputValue(locator, expectedValue) {
  await expect(locator).toHaveValue(expectedValue, { timeout: 10000 });
}

async function expectTextVisible(page, value) {
  await expect(page.getByText(new RegExp(escapeRegExp(value), 'i')).first()).toBeVisible({ timeout: 10000 });
}

async function openFirstRowActions(page) {
  const firstVisibleRow = await getFirstVisibleDataRow(page);

  await clickWithFallback(firstVisibleRow, proxyPayImremitNewSelectors.rowActions.menu, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(async () => {
    await clickWithFallback(page, proxyPayImremitNewSelectors.rowActions.menu, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  });

  await waitForAppToSettle(page, 500);
}

async function expectViewPaymentDetailsVisible(page) {
  const action = await resolveFirst(page, proxyPayImremitNewSelectors.detail.viewPaymentDetails, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(action.locator).toBeVisible({ timeout: 10000 });
}

async function openViewPaymentDetails(page) {
  await clickWithFallback(page, proxyPayImremitNewSelectors.detail.viewPaymentDetails, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectNoResults(page) {
  const noResults = await resolveFirst(page, proxyPayImremitNewSelectors.headings.noResults, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(noResults.locator).toBeVisible({ timeout: 10000 });
}

async function expectCustomerTagVisible(page, customerName) {
  await expect(page.getByText(new RegExp(`^${escapeRegExp(customerName)}$`, 'i')).first()).toBeVisible({ timeout: 10000 });
}

async function runTs48(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Verify the Invoice Count column is visible in the grid', async () => {
    await expectInvoiceCountColumnVisible(page);
  });
}

async function runTs49(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Apply ascending sort on the Invoice Count column', async () => {
    await clickHeaderAndChoose(page, INVOICE_COUNT_LABEL, proxyPayImremitNewSelectors.menus.ascending);
  });
  await reportStep('Verify Invoice Count values are sorted in ascending order', async () => {
    await expectInvoiceCountSorted(page, 'asc');
  });
}

async function runTs50(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Apply descending sort on the Invoice Count column', async () => {
    await clickHeaderAndChoose(page, INVOICE_COUNT_LABEL, proxyPayImremitNewSelectors.menus.descending);
  });
  await reportStep('Verify Invoice Count values are sorted in descending order', async () => {
    await expectInvoiceCountSorted(page, 'desc');
  });
}

async function runTs51(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Hide the Invoice Count column from the header menu', async () => {
    await openColumnVisibilityMenu(page);
    await toggleColumnOption(page, INVOICE_COUNT_LABEL);
    await page.keyboard.press('Escape').catch(() => null);
    await waitForAppToSettle(page, 750);
  });
  await reportStep('Verify the Invoice Count column is hidden from the grid', async () => {
    await expectInvoiceCountColumnHidden(page);
  });
}

async function runTs52(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Open the column visibility menu', async () => {
    await openColumnVisibilityMenu(page);
  });
  await reportStep('Verify Invoice Count appears in the column visibility list', async () => {
    await expectColumnOptionVisible(page, INVOICE_COUNT_LABEL);
  });
}

async function runTs53(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Open the column visibility menu', async () => {
    await openColumnVisibilityMenu(page);
  });
  await reportStep('Verify Invoice Count is checked by default in the column visibility list', async () => {
    await expectColumnOptionChecked(page, INVOICE_COUNT_LABEL);
  });
}

async function runTs54(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Open the row actions menu for a payment entry', async () => {
    await openFirstRowActions(page);
  });
  await reportStep('Verify View Payment Details is available, matching the expected payment-management behavior', async () => {
    await expectViewPaymentDetailsVisible(page);
  });
}

async function runTs55(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Open Advanced Search', async () => {
    await openAdvancedSearch(page);
  });
  await reportStep('Verify the Add Invoice Numbers field accepts input', async () => {
    const input = await fillInvoiceNumbers(page, TS55_INVOICE_INPUT);
    await expectInvoiceInputValue(input, TS55_INVOICE_INPUT);
  });
}

async function runTs56(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Search for a single invoice number in Advanced Search', async () => {
    await openAdvancedSearch(page);
    await fillInvoiceNumbers(page, TS56_INVOICE_INPUT);
  });
  await reportStep('Open payment details for the filtered row', async () => {
    await openFirstRowActions(page);
    await openViewPaymentDetails(page);
  });
  await reportStep('Verify the selected invoice number is visible in payment details', async () => {
    await expectTextVisible(page, TS56_INVOICE_INPUT);
  });
}

async function runTs57(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Search for multiple invoice numbers in Advanced Search', async () => {
    await openAdvancedSearch(page);
    await fillInvoiceNumbers(page, TS57_INVOICE_INPUT, { submit: true });
  });
  await reportStep('Verify the matching invoice rows are returned', async () => {
    await expectTextVisible(page, 'WEBTEST2');
    await expectTextVisible(page, 'P877387');
  });
}

async function runTs58(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Search for comma-separated invoice numbers in Advanced Search', async () => {
    await openAdvancedSearch(page);
    await fillInvoiceNumbers(page, TS58_INVOICE_INPUT, { submit: true });
  });
  await reportStep('Verify the matching invoice rows are returned', async () => {
    await expectTextVisible(page, 'WEBTEST2');
    await expectTextVisible(page, 'SRP3913011313QA');
  });
}

async function runTs59(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Search for an invoice number in Proxy Pay Dashboard Advanced Search', async () => {
    await openAdvancedSearch(page);
    await fillInvoiceNumbers(page, TS59_INVOICE_INPUT, { submit: true });
    await expectTextVisible(page, TS59_INVOICE_INPUT);
  });
  await reportStep('Open Payment Management and search for the same invoice number', async () => {
    await goToPaymentManagement(page);
    await openAdvancedSearch(page);
    await fillInvoiceNumbers(page, TS59_INVOICE_INPUT, { submit: true });
  });
  await reportStep('Verify the same invoice result is visible in Payment Management', async () => {
    await expectTextVisible(page, TS59_INVOICE_INPUT);
  });
}

async function runTs60(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Search for an invalid or non-existent invoice number', async () => {
    await openAdvancedSearch(page);
    await fillInvoiceNumbers(page, TS60_INVOICE_INPUT, { submit: true });
  });
  await reportStep('Verify the search returns no results', async () => {
    await expectNoResults(page);
  });
}

async function runTs61(page, data) {
  await reportStep('Open Proxy Pay Dashboard', async () => {
    await openProxyPayWorkspace(page, data, { customers: MULTI_CUSTOMERS });
  });
  await reportStep('Select multiple customers in the customer selector', async () => {
    await expectCustomerTagVisible(page, MULTI_CUSTOMERS[0]);
    await expectCustomerTagVisible(page, MULTI_CUSTOMERS[1]);
  });
}

const scenarioMap = {
  TS_48: runTs48,
  TS_49: runTs49,
  TS_50: runTs50,
  TS_51: runTs51,
  TS_52: runTs52,
  TS_53: runTs53,
  TS_54: runTs54,
  TS_55: runTs55,
  TS_56: runTs56,
  TS_57: runTs57,
  TS_58: runTs58,
  TS_59: runTs59,
  TS_60: runTs60,
  TS_61: runTs61
};

async function runScenario(page, data, testTitle) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => testTitle.includes(key));
  if (!scenarioKey) {
    throw new Error(`Unsupported scenario for Proxy Pay imREmit New: ${testTitle}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

const helperMap = {
  openModule,
  openProxyPayDashboard,
  openProxyPayWorkspace,
  selectCustomers,
  openAdvancedSearch,
  goToPaymentManagement
};

module.exports = {
  proxyPayImremitNewHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario,
    selectors: proxyPayImremitNewSelectors
  }
};
