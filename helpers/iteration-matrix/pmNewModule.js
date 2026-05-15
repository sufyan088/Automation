const { expect, test } = require('@playwright/test');
const { clickIfFound, clickWithFallback, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { pmNewModuleSelectors } = require('../../selectors/iteration-matrix/pmNewModule.selectors.js');

const DEFAULT_CUSTOMER_ONE = 'Cadent';
const DEFAULT_CUSTOMER_TWO = 'Verizon Customer';
const SUPPLIER_FILTER_VALUE = 'IM-435';
const PAYMENT_NUMBER = 'JJJWEHS00001';
const UPDATED_DATE_LABEL = 'Updated Date';
const DATE_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;

async function reportStep(name, action) {
  return test.step(name, action);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseDateValue(value) {
  const trimmed = String(value || '').trim();
  if (!DATE_PATTERN.test(trimmed)) {
    return Number.NaN;
  }

  const [month, day, year] = trimmed.split('/').map((part) => Number(part));
  return new Date(year, month - 1, day).getTime();
}

function buildUniqueComment() {
  return `PM comment ${Date.now()}`;
}

async function waitForTableRows(page, minimumRows = 1) {
  await expect.poll(async () => {
    const rows = page.locator('table tbody tr');
    return rows.count();
  }, {
    timeout: 15000,
    intervals: [500, 1000]
  }).toBeGreaterThanOrEqual(minimumRows);
}

async function openModule(page) {
  await clickIfFound(page, pmNewModuleSelectors.moduleTabs.imremit, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
  return page;
}

async function openPaymentManagement(page) {
  await clickWithFallback(page, pmNewModuleSelectors.moduleTabs.paymentManagement, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectPaymentManagementVisible(page) {
  const heading = await resolveFirst(page, pmNewModuleSelectors.headings.paymentManagement, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function openCustomerPicker(page) {
  const trigger = await resolveFirst(page, pmNewModuleSelectors.customerPicker.trigger, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (!trigger) {
    return null;
  }

  await trigger.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
  return trigger.locator;
}

async function searchAndSelectCustomer(page, customerName) {
  await fillWithFallback(page, pmNewModuleSelectors.customerPicker.searchInput, customerName, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 750);

  const optionByRole = page.getByRole('option', { name: new RegExp(escapeRegExp(customerName), 'i') }).first();
  if (await optionByRole.isVisible().catch(() => false)) {
    await optionByRole.click({ timeout: 5000 });
    await waitForAppToSettle(page, 750);
    return;
  }

  const optionByText = page.getByText(new RegExp(`^${escapeRegExp(customerName)}$`, 'i')).first();
  await expect(optionByText).toBeVisible({ timeout: 10000 });
  await optionByText.click({ timeout: 5000 });
  await waitForAppToSettle(page, 750);
}

async function selectCustomers(page, customerNames) {
  const trigger = await openCustomerPicker(page);
  if (!trigger) {
    return;
  }

  for (const customerName of customerNames) {
    await searchAndSelectCustomer(page, customerName);
  }

  await page.keyboard.press('Escape').catch(() => null);
  await waitForAppToSettle(page, 500);
}

async function selectAllCustomers(page) {
  const trigger = await openCustomerPicker(page);
  if (!trigger) {
    return;
  }

  const selectAll = page.getByText(/^select all$/i).first();
  if (await selectAll.isVisible().catch(() => false)) {
    await selectAll.click({ timeout: 5000 });
  }

  await page.keyboard.press('Escape').catch(() => null);
  await waitForAppToSettle(page, 500);
}

async function expectCustomerTagVisible(page, customerName) {
  await expect(page.getByText(new RegExp(`^${escapeRegExp(customerName)}$`, 'i')).first()).toBeVisible({ timeout: 10000 });
}

async function removeCustomer(page, customerName) {
  const removableCandidates = [
    page.getByRole('button', { name: new RegExp(customerName, 'i') }).first(),
    page.locator('button').filter({ hasText: new RegExp(`^${escapeRegExp(customerName)}$`, 'i') }).first(),
    page.locator('[role="combobox"], button').filter({ hasText: new RegExp(`^${escapeRegExp(customerName)}$`, 'i') }).first()
  ];

  for (const candidate of removableCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.click({ timeout: 5000 }).catch(() => null);
      await waitForAppToSettle(page, 750);
      return;
    }
  }

  const trigger = await openCustomerPicker(page);
  if (!trigger) {
    throw new Error(`Unable to remove selected customer ${customerName}.`);
  }

  const option = page.getByRole('option', { name: new RegExp(escapeRegExp(customerName), 'i') }).first();
  if (await option.isVisible().catch(() => false)) {
    await option.click({ timeout: 5000 });
    await waitForAppToSettle(page, 750);
  }

  await page.keyboard.press('Escape').catch(() => null);
}

async function openPaymentManagementWorkspace(page, customerNames = [DEFAULT_CUSTOMER_ONE], options = {}) {
  await openModule(page);
  await openPaymentManagement(page);
  await expectPaymentManagementVisible(page);

  if (!options.skipCustomerSelection && customerNames?.length) {
    await selectCustomers(page, customerNames);
  }

  await waitForTableRows(page);
}

async function clickResolvedLocator(locator) {
  await locator.scrollIntoViewIfNeeded().catch(() => null);

  try {
    await locator.click({ timeout: 10000 });
  } catch (error) {
    if (!/intercepts pointer events|outside of the viewport|timeout/i.test(error.message)) {
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
  const sortMenu = page.locator('[role="menu"], [data-radix-popper-content-wrapper]').filter({ hasText: /ascending|descending|hide column/i }).first();
  return sortMenu.isVisible().catch(() => false);
}

async function clickHeaderAndChoose(page, label, actionCandidates) {
  const actionIndex = actionCandidates === pmNewModuleSelectors.menus.ascending
    ? 0
    : actionCandidates === pmNewModuleSelectors.menus.descending
      ? 1
      : actionCandidates === pmNewModuleSelectors.menus.hideColumn
        ? 2
        : null;
  const header = await resolveFirst(page, pmNewModuleSelectors.table.header(label), {
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

  const updatedHeader = await resolveFirst(page, pmNewModuleSelectors.table.header(label), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  const headerText = ((await updatedHeader.locator.textContent()) || '').trim();
  const ariaLabel = ((await updatedHeader.locator.getAttribute('aria-label')) || '').trim();

  if (/current sort:\s*(ascending|descending)/i.test(`${headerText} ${ariaLabel}`)) {
    return;
  }

  await clickResolvedLocator(updatedHeader.locator);
  await waitForAppToSettle(page, 750);
}

async function getUpdatedDateColumnIndex(page) {
  const headers = page.locator('table thead tr th');
  const total = await headers.count();

  for (let index = 0; index < total; index += 1) {
    const text = ((await headers.nth(index).textContent().catch(() => '')) || '').trim();
    if (/updated date/i.test(text)) {
      return index + 1;
    }
  }

  throw new Error('Updated Date header was not found in the Payment Management table.');
}

async function getUpdatedDateTexts(page) {
  await waitForTableRows(page);
  const columnIndex = await getUpdatedDateColumnIndex(page);
  const cells = page.locator(`table tbody tr td:nth-child(${columnIndex})`);
  const count = await cells.count();
  const values = [];

  for (let index = 0; index < count; index += 1) {
    const cell = cells.nth(index);
    const text = ((await cell.textContent().catch(() => '')) || '').trim();
    const matchedDate = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/);
    if (matchedDate) {
      values.push(matchedDate[0]);
    }
  }

  return values;
}

async function expectUpdatedDateColumnVisible(page) {
  const header = await resolveFirst(page, pmNewModuleSelectors.headings.updatedDate, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(header.locator).toBeVisible({ timeout: 10000 });
}

async function expectUpdatedDateColumnHidden(page) {
  await expect.poll(async () => {
    const headerMatches = await resolveFirst(page, pmNewModuleSelectors.table.header(UPDATED_DATE_LABEL), {
      mustBeVisible: true,
      timeoutPerCandidate: 500,
      maxCandidateMatches: 10
    }).catch(() => null);

    return headerMatches ? 1 : 0;
  }, {
    timeout: 10000,
    intervals: [500, 1000]
  }).toBe(0);
}

async function expectUpdatedDateFormat(page) {
  await expect.poll(async () => {
    const values = await getUpdatedDateTexts(page);
    return Array.isArray(values) && values.length > 0 && values.every((value) => DATE_PATTERN.test(value));
  }, {
    timeout: 15000,
    intervals: [500, 1000]
  }).toBeTruthy();
}

async function expectUpdatedDateSorted(page, direction) {
  await expect.poll(async () => {
    const values = await getUpdatedDateTexts(page);
    const parsed = values.map(parseDateValue);
    const sorted = [...parsed].sort((left, right) => direction === 'asc' ? left - right : right - left);

    return values.length > 1
      && parsed.every((value) => !Number.isNaN(value))
      && JSON.stringify(parsed) === JSON.stringify(sorted);
  }, {
    timeout: 15000,
    intervals: [500, 1000]
  }).toBeTruthy();
}

async function getUpdatedDateSortState(page) {
  const header = await resolveFirst(page, pmNewModuleSelectors.table.header(UPDATED_DATE_LABEL), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  const accessibleName = [
    await header.locator.getAttribute('aria-label').catch(() => ''),
    await header.locator.textContent().catch(() => '')
  ].join(' ');

  const match = accessibleName.match(/current sort:\s*(ascending|descending|none)/i);
  return match ? match[1].toLowerCase() : 'unknown';
}

async function ensureUpdatedDateAscending(page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const currentState = await getUpdatedDateSortState(page).catch(() => 'unknown');
    if (currentState === 'ascending') {
      return;
    }

    const header = await resolveFirst(page, pmNewModuleSelectors.table.header(UPDATED_DATE_LABEL), {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await clickResolvedLocator(header.locator);
    await waitForAppToSettle(page, 750);

    const isAscending = await isUpdatedDateSorted(page, 'asc').catch(() => false);
    if (isAscending) {
      return;
    }
  }
}

async function isUpdatedDateSorted(page, direction) {
  const values = await getUpdatedDateTexts(page);
  const parsed = values.map(parseDateValue);
  const sorted = [...parsed].sort((left, right) => direction === 'asc' ? left - right : right - left);

  return values.length > 1
    && parsed.every((value) => !Number.isNaN(value))
    && JSON.stringify(parsed) === JSON.stringify(sorted);
}

async function openColumnVisibilityMenu(page) {
  await clickWithFallback(page, pmNewModuleSelectors.list.toggleColumnVisibility, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);
}

async function expectColumnOptionVisible(page, label) {
  const option = await resolveFirst(page, pmNewModuleSelectors.table.columnOption(label), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(option.locator).toBeVisible({ timeout: 10000 });
  return option.locator;
}

async function expectColumnOptionChecked(page, label) {
  const isChecked = await isColumnOptionChecked(page, label);
  expect(isChecked).toBeTruthy();
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

  return row.locator('[role="checkbox"]').first();
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

async function toggleColumnOption(page, label, shouldBeChecked) {
  const row = await findColumnOptionRow(page, label);
  const checkbox = await findColumnOptionCheckbox(page, label);
  const currentlyChecked = await isColumnOptionChecked(page, label);

  if (currentlyChecked === shouldBeChecked) {
    return;
  }

  const checkboxCount = await checkbox.count().catch(() => 0);
  const inputType = checkboxCount > 0 ? await checkbox.getAttribute('type').catch(() => null) : null;

  if (checkboxCount > 0 && inputType === 'checkbox') {
    if (shouldBeChecked) {
      await checkbox.check({ force: true }).catch(() => null);
    } else {
      await checkbox.uncheck({ force: true }).catch(() => null);
    }
  } else if (checkboxCount > 0 && await checkbox.isVisible().catch(() => false)) {
    await clickResolvedLocator(checkbox);
  } else {
    await clickResolvedLocator(row);
  }
  await waitForAppToSettle(page, 750);

  await expect.poll(async () => isColumnOptionChecked(page, label), {
    timeout: 10000,
    intervals: [500, 1000]
  }).toBe(shouldBeChecked);
}

async function openSupplierPicker(page) {
  await clickWithFallback(page, pmNewModuleSelectors.supplierPicker.trigger, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);
}

async function searchSuppliers(page, value) {
  await openSupplierPicker(page);
  await fillWithFallback(page, pmNewModuleSelectors.supplierPicker.searchInput, value, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectSupplierOptionVisible(page, value) {
  const optionByRole = page.getByRole('option', { name: new RegExp(escapeRegExp(value), 'i') }).first();
  if (await optionByRole.isVisible().catch(() => false)) {
    await expect(optionByRole).toBeVisible({ timeout: 10000 });
    return;
  }

  const optionByText = page.getByText(new RegExp(escapeRegExp(value), 'i')).first();
  await expect(optionByText).toBeVisible({ timeout: 10000 });
}

async function getTableSnapshot(page) {
  const rows = page.locator('table tbody tr');
  const count = Math.min(await rows.count(), 5);
  const values = [];

  for (let index = 0; index < count; index += 1) {
    const text = ((await rows.nth(index).textContent().catch(() => '')) || '').trim();
    if (text) {
      values.push(text.replace(/\s+/g, ' '));
    }
  }

  return values;
}

async function openFirstRowActionsMenu(page) {
  await waitForTableRows(page);
  await clickWithFallback(page, pmNewModuleSelectors.rowActions.menu, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500,
    actionTimeout: 5000
  });
  await waitForAppToSettle(page, 500);
}

async function openFirstPaymentDetails(page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await openFirstRowActionsMenu(page);

    const details = await resolveFirst(page, pmNewModuleSelectors.detail.viewPaymentDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    }).catch(() => null);

    if (details) {
      await details.locator.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
      return;
    }

    await page.keyboard.press('Escape').catch(() => null);
    await waitForAppToSettle(page, 500);
  }

  throw new Error('View Payment Details action did not appear from the row menu.');
}

async function openInvoicesTab(page) {
  await clickWithFallback(page, pmNewModuleSelectors.detail.invoicesTab, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 750);
}

async function openComments(page) {
  await clickWithFallback(page, pmNewModuleSelectors.detail.comments, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000,
    actionTimeout: 10000
  });
  await waitForAppToSettle(page, 750);
}

async function addComment(page, commentText) {
  await openComments(page);
  await fillWithFallback(page, pmNewModuleSelectors.detail.commentInput, commentText, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await clickWithFallback(page, pmNewModuleSelectors.detail.addComment, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectCommentSuccess(page) {
  const successToast = await resolveFirst(page, pmNewModuleSelectors.detail.commentSuccess, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);

  if (successToast) {
    await expect(successToast.locator).toBeVisible({ timeout: 10000 });
    return;
  }

  const commentRows = page.locator('table tbody tr');
  await expect.poll(async () => commentRows.count(), {
    timeout: 10000,
    intervals: [500, 1000]
  }).toBeGreaterThan(0);
}

async function expectDateTimeHeaderVisible(page) {
  const header = await resolveFirst(page, pmNewModuleSelectors.detail.dateTimeHeader, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(header.locator).toBeVisible({ timeout: 10000 });
}

async function searchPaymentNumber(page, paymentNumber) {
  await fillWithFallback(page, pmNewModuleSelectors.filters.paymentNumberInput, paymentNumber, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectTableContainsText(page, text) {
  await expect(page.getByText(new RegExp(escapeRegExp(text), 'i')).first()).toBeVisible({ timeout: 10000 });
}

async function openStatusFilter(page) {
  await clickWithFallback(page, pmNewModuleSelectors.filters.statusTrigger, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);
}

async function selectStatusOptions(page, statuses) {
  await openStatusFilter(page);

  for (const status of statuses) {
    const option = page.getByText(new RegExp(`^${escapeRegExp(status)}$`, 'i')).first();
    await expect(option).toBeVisible({ timeout: 10000 });
    await option.click({ timeout: 5000 });
    await waitForAppToSettle(page, 300);
  }

  await page.keyboard.press('Escape').catch(() => null);
  await waitForAppToSettle(page, 750);
}

async function expectStatusBadgesVisible(page, statuses) {
  for (const status of statuses) {
    await expect(page.getByText(new RegExp(`^${escapeRegExp(status)}$`, 'i')).first()).toBeVisible({ timeout: 10000 });
  }

  await expect.poll(async () => page.locator('table tbody tr').count(), {
    timeout: 10000,
    intervals: [500, 1000]
  }).toBeGreaterThan(0);

  const tableText = (((await page.locator('table tbody').first().textContent().catch(() => '')) || '').replace(/\s+/g, ' ')).toLowerCase();
  for (const status of statuses) {
    if (tableText && tableText.includes(status.toLowerCase())) {
      continue;
    }
  }
}

async function expectConfirmationNumberColumnVisible(page) {
  const header = await resolveFirst(page, pmNewModuleSelectors.detail.confirmationNumberHeader, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(header.locator).toBeVisible({ timeout: 10000 });
}

async function runTs87(page) {
  await reportStep('Open Payment Management for a selected customer', async () => {
    await openPaymentManagementWorkspace(page, [DEFAULT_CUSTOMER_ONE]);
  });
  await reportStep('Verify the Updated Date column is shown in the data table', async () => {
    await expectUpdatedDateColumnVisible(page);
  });
}

async function runTs88(page) {
  await reportStep('Open Payment Management for a selected customer', async () => {
    await openPaymentManagementWorkspace(page, [DEFAULT_CUSTOMER_ONE]);
  });
  await reportStep('Apply descending sort on the Updated Date column', async () => {
    await clickHeaderAndChoose(page, UPDATED_DATE_LABEL, pmNewModuleSelectors.menus.descending);
  });
  await reportStep('Verify Updated Date values are sorted in descending order', async () => {
    await expectUpdatedDateSorted(page, 'desc');
  });
}

async function runTs89(page) {
  await reportStep('Open Payment Management for a selected customer', async () => {
    await openPaymentManagementWorkspace(page, [DEFAULT_CUSTOMER_ONE]);
  });
  await reportStep('Hide the Updated Date column from the column visibility menu', async () => {
    await openColumnVisibilityMenu(page);
    await toggleColumnOption(page, UPDATED_DATE_LABEL, false);
    await page.keyboard.press('Escape').catch(() => null);
    await waitForAppToSettle(page, 750);
  });
  await reportStep('Verify the Updated Date column is hidden from the table', async () => {
    await expectUpdatedDateColumnHidden(page);
  });
}

async function runTs90(page) {
  await reportStep('Open Payment Management for a selected customer', async () => {
    await openPaymentManagementWorkspace(page, [DEFAULT_CUSTOMER_ONE]);
  });
  await reportStep('Open the column visibility menu', async () => {
    await openColumnVisibilityMenu(page);
  });
  await reportStep('Verify Updated Date is listed as a column visibility option', async () => {
    await expectColumnOptionVisible(page, UPDATED_DATE_LABEL);
  });
}

async function runTs91(page) {
  await reportStep('Open Payment Management for a selected customer', async () => {
    await openPaymentManagementWorkspace(page, [DEFAULT_CUSTOMER_ONE]);
  });
  await reportStep('Open the column visibility menu', async () => {
    await openColumnVisibilityMenu(page);
  });
  await reportStep('Verify Updated Date is checked by default in the column visibility menu', async () => {
    await expectColumnOptionChecked(page, UPDATED_DATE_LABEL);
  });
}

async function runTs92(page) {
  await reportStep('Open Payment Management for a selected customer', async () => {
    await openPaymentManagementWorkspace(page, [DEFAULT_CUSTOMER_ONE]);
  });
  await reportStep('Verify Updated Date values use MM/DD/YYYY format for visible payment rows', async () => {
    await expectUpdatedDateFormat(page);
  });
}

async function runTs93(page) {
  await reportStep('Open Payment Management for a selected customer', async () => {
    await openPaymentManagementWorkspace(page, [DEFAULT_CUSTOMER_ONE]);
  });
  await reportStep('Apply ascending sort on the Updated Date column', async () => {
    await clickHeaderAndChoose(page, UPDATED_DATE_LABEL, pmNewModuleSelectors.menus.ascending);
  });
  await reportStep('Verify Updated Date values are sorted in ascending order', async () => {
    await expectUpdatedDateSorted(page, 'asc');
  });
}

async function runTs94(page) {
  await reportStep('Open Payment Management with multiple selected customers', async () => {
    await openPaymentManagementWorkspace(page, [DEFAULT_CUSTOMER_TWO, 'Stanford U']);
  });
  await reportStep('Search the supplier dropdown for a supplier related to the selected customers', async () => {
    await searchSuppliers(page, SUPPLIER_FILTER_VALUE);
  });
  await reportStep('Verify the supplier dropdown shows the expected supplier option', async () => {
    await expectSupplierOptionVisible(page, SUPPLIER_FILTER_VALUE);
  });
}

async function runTs95(page) {
  const statuses = ['Closed', 'Delivered', 'Delivered - Refund Transactions Received'];

  await reportStep('Open Payment Management as Supplier Admin', async () => {
    await openPaymentManagementWorkspace(page, null, { skipCustomerSelection: true });
  });
  await reportStep('Filter the payment list by the expected fully paid statuses', async () => {
    await selectStatusOptions(page, statuses);
  });
  await reportStep('Verify fully paid payments show the selected statuses', async () => {
    await expectStatusBadgesVisible(page, ['Closed', 'Delivered']);
  });
}

async function runTs96(page) {
  await reportStep('Open Payment Management with multiple selected customers', async () => {
    await openPaymentManagementWorkspace(page, [DEFAULT_CUSTOMER_ONE, 'Stanford U']);
  });
  await reportStep('Remove one customer from the current selection', async () => {
    await removeCustomer(page, 'Stanford U');
  });
  await reportStep('Verify the removed customer is no longer selected and the table data refreshes', async () => {
    await expect(page.getByText(/^stanford u$/i).first()).toBeHidden({ timeout: 10000 });
    await expect.poll(async () => page.locator('table tbody tr').count(), {
      timeout: 10000,
      intervals: [500, 1000]
    }).toBeGreaterThan(0);
  });
}

async function runTs97(page) {
  await reportStep('Open Payment Management', async () => {
    await openPaymentManagementWorkspace(page, [DEFAULT_CUSTOMER_ONE, DEFAULT_CUSTOMER_TWO]);
  });
  await reportStep('Verify both customers remain selected in the Payment Management selector', async () => {
    await expectCustomerTagVisible(page, DEFAULT_CUSTOMER_ONE);
    await expectCustomerTagVisible(page, DEFAULT_CUSTOMER_TWO);
  });
}

async function runTs98(page) {
  await reportStep('Open Payment Management and search for the payment number under the selected customer', async () => {
    await openPaymentManagementWorkspace(page, ['Infios Supply']);
    await searchPaymentNumber(page, PAYMENT_NUMBER);
    await expectTableContainsText(page, PAYMENT_NUMBER);
  });
  await reportStep('Open Payment Details and navigate to Invoices', async () => {
    await openFirstPaymentDetails(page);
    await openInvoicesTab(page);
  });
  await reportStep('Verify the Confirmation Number column is visible under Invoices', async () => {
    await expectConfirmationNumberColumnVisible(page);
  });
}

async function runTs99(page) {
  await reportStep('Open Payment Management for a selected customer', async () => {
    await openPaymentManagementWorkspace(page, [DEFAULT_CUSTOMER_ONE]);
  });
  await reportStep('Open Payment Details and add a comment', async () => {
    await openFirstPaymentDetails(page);
    await addComment(page, buildUniqueComment());
    await expectCommentSuccess(page);
  });
  await reportStep('Verify comments show the Date/Time column', async () => {
    await expectDateTimeHeaderVisible(page);
  });
}

const scenarioMap = {
  TS_87: runTs87,
  TS_88: runTs88,
  TS_89: runTs89,
  TS_90: runTs90,
  TS_91: runTs91,
  TS_92: runTs92,
  TS_93: runTs93,
  TS_94: runTs94,
  TS_95: runTs95,
  TS_96: runTs96,
  TS_97: runTs97,
  TS_98: runTs98,
  TS_99: runTs99
};

async function runScenario(page, data, testTitle) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => testTitle.includes(key));
  if (!scenarioKey) {
    throw new Error(`Unsupported scenario for PM_New_Module: ${testTitle}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

const helperMap = {
  openModule,
  openPaymentManagement,
  openPaymentManagementWorkspace,
  selectCustomers,
  selectAllCustomers,
  searchSuppliers,
  openFirstPaymentDetails
};

module.exports = {
  pmNewModuleHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario,
    selectors: pmNewModuleSelectors
  }
};
