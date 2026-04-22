const { expect } = require('@playwright/test');
const { criteriaSettingsSelectors } = require('../../selectors/iteration-matrix/criteriaSettings.selectors.js');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resolveCriteriaDisplayName(criteriaName) {
  const aliases = new Map([
    ['Inv Sequential Threshold', 'Inv# Sequential Threshold'],
    ['Invoice Char Diff', 'Invoice# Char Diff'],
    ['Credit Pair Logic', 'Matched Credit Logic']
  ]);

  return aliases.get(criteriaName) || criteriaName;
}

async function waitForFirstVisible(page, selectors, timeout = 15000) {
  const startedAt = Date.now();

  while ((Date.now() - startedAt) < timeout) {
    for (const selector of selectors) {
      const locator = page.locator(selector).first();
      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error(`None of the selectors became visible within ${timeout}ms: ${selectors.join(', ')}`);
}

async function clickFirstVisible(page, selectors, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  await locator.click({ timeout: 5000 });
  return locator;
}

async function getVisibleDialog(page, timeout = 15000) {
  const startedAt = Date.now();

  while ((Date.now() - startedAt) < timeout) {
    const dialogs = page.getByRole('dialog');
    const count = await dialogs.count().catch(() => 0);

    for (let index = 0; index < count; index += 1) {
      const dialog = dialogs.nth(index);
      if (await dialog.isVisible().catch(() => false)) {
        return dialog;
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error('No visible dialog was found on the Criteria Settings page.');
}

async function getVisibleComboboxes(page) {
  const comboboxes = page.getByRole('combobox');
  const total = await comboboxes.count();
  const visibleComboboxes = [];

  for (let index = 0; index < total; index += 1) {
    const combobox = comboboxes.nth(index);
    if (await combobox.isVisible().catch(() => false)) {
      visibleComboboxes.push(combobox);
    }
  }

  return visibleComboboxes;
}

async function openDuplicatePayments(page) {
  const moduleLink = await waitForFirstVisible(page, criteriaSettingsSelectors.duplicatePaymentsModule);
  await moduleLink.click({ timeout: 5000 });
  await page.waitForURL(/duplicate-payments/i, { timeout: 15000 });
}

async function openModule(page) {
  await openDuplicatePayments(page);
  await openCriteriaSettings(page);
  return page;
}

async function openCriteriaSettings(page) {
  await waitForFirstVisible(page, criteriaSettingsSelectors.subrouteNavigation);
  await clickFirstVisible(page, criteriaSettingsSelectors.criteriaSettingsLink);
  await page.waitForURL(/criteria-settings/i, { timeout: 15000 });
  await waitForCriteriaSettingsShell(page);
}

async function verifyCriteriaSettingsVisible(page) {
  await waitForFirstVisible(page, criteriaSettingsSelectors.criteriaSettingsLink);
}

async function waitForCriteriaSettingsShell(page) {
  await Promise.all([
    waitForFirstVisible(page, criteriaSettingsSelectors.subrouteNavigation),
    waitForFirstVisible(page, criteriaSettingsSelectors.customerCombobox)
  ]);
}

async function waitForResultsTable(page) {
  await waitForFirstVisible(page, criteriaSettingsSelectors.resultsTable);
}

async function waitForSearchControls(page) {
  await Promise.all([
    waitForFirstVisible(page, criteriaSettingsSelectors.searchFields.allEntries),
    waitForFirstVisible(page, criteriaSettingsSelectors.searchFields.character)
  ]);
}

async function selectCustomer(page, preferredCustomer = 'Stanford U') {
  const visibleComboboxes = await getVisibleComboboxes(page);
  const customerCombobox = visibleComboboxes[visibleComboboxes.length - 1];

  if (!customerCombobox) {
    throw new Error('No visible customer combobox was found on the Criteria Settings page.');
  }

  const currentText = ((await customerCombobox.textContent().catch(() => '')) || '').trim();
  if (currentText && !/select customer/i.test(currentText) && currentText.toLowerCase().includes(preferredCustomer.toLowerCase())) {
    return currentText;
  }

  await customerCombobox.click({ timeout: 5000 });

  const searchInput = await waitForFirstVisible(page, criteriaSettingsSelectors.customerSearchInput);
  await searchInput.fill('');
  await searchInput.type(preferredCustomer, { delay: 40 });
  await page.waitForTimeout(500);

  const preferredOption = page.getByRole('option', {
    name: new RegExp(escapeRegExp(preferredCustomer), 'i')
  }).first();

  if (await preferredOption.isVisible().catch(() => false)) {
    await preferredOption.click({ timeout: 5000 });
  } else {
    const firstOption = await waitForFirstVisible(page, criteriaSettingsSelectors.customerOptions);
    await firstOption.click({ timeout: 5000 });
  }

  await page.waitForTimeout(500);

  const selectedText = ((await customerCombobox.textContent().catch(() => '')) || '').trim();
  if (!selectedText || /select customer/i.test(selectedText)) {
    throw new Error(`Customer selection did not apply. Current trigger text: ${selectedText}`);
  }

  await waitForSearchControls(page);
  return selectedText;
}

async function fillSearchField(page, key, value) {
  const fieldSelectors = criteriaSettingsSelectors.searchFields[key];
  if (!fieldSelectors) {
    throw new Error(`Unsupported search field key: ${key}`);
  }

  const input = await waitForFirstVisible(page, fieldSelectors);
  await input.fill(value, { timeout: 5000 });
  await page.waitForTimeout(500);
  return input;
}

async function searchAllEntries(page, value) {
  return fillSearchField(page, 'allEntries', value);
}

async function searchCharacter(page, value) {
  return fillSearchField(page, 'character', value);
}

async function expectTableContainsText(page, text) {
  await waitForResultsTable(page);
  await page.waitForFunction((expectedText) => {
    const tables = Array.from(document.querySelectorAll('table'));
    return tables.some((table) => (table.textContent || '').includes(expectedText));
  }, text, { timeout: 15000 });
}

async function expectSearchFieldValue(page, key, expectedValue) {
  const fieldSelectors = criteriaSettingsSelectors.searchFields[key];
  const input = await waitForFirstVisible(page, fieldSelectors);
  await expect(input).toHaveValue(expectedValue);
}

async function clickResetSearchFilters(page) {
  await clickFirstVisible(page, criteriaSettingsSelectors.resetButton);
  await page.waitForTimeout(500);
}

async function openColumnViewsMenu(page) {
  const button = await waitForFirstVisible(page, criteriaSettingsSelectors.columnViewsButton);
  const expanded = await button.getAttribute('aria-expanded').catch(() => null);

  if (expanded === 'true') {
    return;
  }

  await button.click({ timeout: 5000 });
}

async function verifyColumnViewOptionVisible(page, label) {
  await page.getByText(label, { exact: true }).first().waitFor({ state: 'visible', timeout: 15000 });
}

async function clickColumnViewOption(page, label) {
  const option = page.getByRole('checkbox', {
    name: new RegExp(`(?:Hide|Show)\\s+${escapeRegExp(label)}\\s+column`, 'i')
  }).first();
  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click({ timeout: 5000 });
  await page.waitForTimeout(300);
}

async function getPaginationCombobox(page) {
  const triggers = page.getByRole('combobox');
  const count = await triggers.count();

  for (let index = 0; index < count; index += 1) {
    const trigger = triggers.nth(index);
    if (!await trigger.isVisible().catch(() => false)) {
      continue;
    }

    const text = ((await trigger.textContent().catch(() => '')) || '').trim();
    if (/^\d+$/.test(text)) {
      return trigger;
    }
  }

  throw new Error('No visible pagination size combobox was found on the Criteria Settings page.');
}

async function openPageSizeMenu(page) {
  const trigger = await getPaginationCombobox(page);
  await trigger.click({ timeout: 5000 });
}

async function verifyPageSizeOptions(page, expectedOptions) {
  for (const option of expectedOptions) {
    await page.getByRole('option', { name: String(option), exact: true }).first().waitFor({
      state: 'visible',
      timeout: 15000
    });
  }
}

async function choosePageSize(page, option) {
  const optionText = String(option);
  const optionLocator = page.getByRole('option', { name: optionText, exact: true }).first();
  await optionLocator.waitFor({ state: 'visible', timeout: 15000 });
  await optionLocator.click({ timeout: 5000 });
  await page.waitForTimeout(750);
}

async function readPaginationState(page) {
  await page.waitForFunction(() => {
    const summaries = Array.from(document.querySelectorAll('p'));
    return summaries.some((node) => /Page:\s*\d+\s+of\s+\d+/i.test(node.textContent || ''));
  }, { timeout: 15000 });

  const summary = await waitForFirstVisible(page, criteriaSettingsSelectors.paginationSummary);
  const text = (await summary.textContent())?.trim() || '';
  const match = text.match(/Page:\s*(\d+)\s+of\s+(\d+)/i);

  if (!match) {
    throw new Error(`Unable to parse pagination summary: ${text}`);
  }

  return {
    currentPage: Number(match[1]),
    totalPages: Number(match[2])
  };
}

async function clickPaginationButton(page, buttonKey) {
  const buttonName = criteriaSettingsSelectors.paginationButtons[buttonKey];
  if (!buttonName) {
    throw new Error(`Unsupported pagination button key: ${buttonKey}`);
  }

  const button = page.getByRole('button', { name: buttonName }).first();
  await button.waitFor({ state: 'visible', timeout: 15000 });
  await button.click({ timeout: 5000 });
  await page.waitForTimeout(750);
}

async function expectPageNumber(page, expectedPage) {
  await page.waitForFunction((pageNumber) => {
    const summaries = Array.from(document.querySelectorAll('p'));
    return summaries.some((node) => {
      const text = node.textContent || '';
      return new RegExp(`Page:\\s*${pageNumber}\\s+of\\s+\\d+`, 'i').test(text);
    });
  }, expectedPage, { timeout: 15000 });
}

async function openTableHeaderMenu(page, label) {
  const headerButton = page.getByRole('columnheader', {
    name: new RegExp(escapeRegExp(label), 'i')
  }).getByRole('button').first();
  await headerButton.waitFor({ state: 'visible', timeout: 15000 });
  await headerButton.click({ timeout: 5000 });
}

async function chooseTableHeaderAction(page, actionLabel) {
  const option = page.getByText(actionLabel, { exact: true }).first();
  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click({ timeout: 5000 });
  await page.waitForTimeout(500);
}

async function verifyTableHeaderVisible(page, label) {
  await page.waitForFunction((headerLabel) => {
    const headers = Array.from(document.querySelectorAll('[role="columnheader"], th'));
    return headers.some((header) => {
      const text = header.textContent || '';
      const isVisible = Boolean(header.offsetParent);
      return isVisible && text.toLowerCase().includes(String(headerLabel).toLowerCase());
    });
  }, label, { timeout: 15000 });
}

async function verifyTableHeaderHidden(page, label) {
  await page.waitForFunction((headerLabel) => {
    const headers = Array.from(document.querySelectorAll('[role="columnheader"], th'));
    return !headers.some((header) => {
      const text = header.textContent || '';
      const isVisible = Boolean(header.offsetParent);
      return isVisible && text.toLowerCase().includes(String(headerLabel).toLowerCase());
    });
  }, label, { timeout: 15000 });
}

async function readColumnValues(page, label) {
  await waitForResultsTable(page);
  return page.locator('table').first().evaluate((table, headerLabel) => {
    const headers = Array.from(table.querySelectorAll('thead th'));
    const headerIndex = headers.findIndex((header) =>
      (header.textContent || '').toLowerCase().includes(String(headerLabel).toLowerCase())
    );

    if (headerIndex === -1) {
      throw new Error(`Column not found: ${headerLabel}`);
    }

    return Array.from(table.querySelectorAll('tbody tr'))
      .map((row) => {
        const cell = row.querySelectorAll('td')[headerIndex];
        return (cell?.textContent || '').trim();
      })
      .filter(Boolean);
  }, label);
}

function sortValues(values, direction) {
  const copy = [...values];
  copy.sort((left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' }));
  return direction === 'desc' ? copy.reverse() : copy;
}

async function expectColumnSorted(page, label, direction) {
  const values = await readColumnValues(page, label);
  expect(values).toEqual(sortValues(values, direction));
}

async function showCriteriaForm(page) {
  const button = page.getByRole('button', { name: /show criteria form|hide criteria form/i }).first();
  await button.waitFor({ state: 'visible', timeout: 15000 });
  const text = ((await button.textContent().catch(() => '')) || '').trim();

  if (/hide criteria form/i.test(text)) {
    return;
  }

  await button.click({ timeout: 5000 });
  await page.waitForTimeout(500);
}

async function expectCriteriaFormButtonText(page, pattern) {
  const button = page.getByRole('button', { name: /show criteria form|hide criteria form/i }).first();
  await button.waitFor({ state: 'visible', timeout: 15000 });
  await expect(button).toHaveText(pattern);
}

async function openCriteriaCardAction(page, criteriaName, preferredAction = 'Add Criteria') {
  await showCriteriaForm(page);

  const resolvedCriteriaName = resolveCriteriaDisplayName(criteriaName);
  const cardTitle = page.getByText(new RegExp(escapeRegExp(resolvedCriteriaName), 'i')).first();
  await cardTitle.waitFor({ state: 'visible', timeout: 15000 });

  const card = cardTitle.locator('xpath=ancestor::div[contains(@class,"rounded-lg")][1]');
  const actionButton = card.getByRole('button', {
    name: new RegExp(preferredAction, 'i')
  }).first();

  if (await actionButton.isVisible().catch(() => false)) {
    await actionButton.click({ timeout: 5000 });
  } else {
    const fallbackButton = card.getByRole('button', { name: /add criteria|edit criteria/i }).first();
    await fallbackButton.waitFor({ state: 'visible', timeout: 15000 });
    await fallbackButton.click({ timeout: 5000 });
  }

  const dialog = await getVisibleDialog(page);
  await dialog.getByRole('button', { name: /submit/i }).first().waitFor({ state: 'visible', timeout: 15000 });
}

async function fillCharacterField(page, value) {
  const dialog = await getVisibleDialog(page);
  const input = dialog.locator('input[name="character"]').first();
  await input.waitFor({ state: 'visible', timeout: 15000 });
  await input.fill(value, { timeout: 5000 });
}

async function fillThresholdField(page, value) {
  const dialog = await getVisibleDialog(page);
  const spinbutton = dialog.getByRole('spinbutton').first();

  if (await spinbutton.isVisible().catch(() => false)) {
    await spinbutton.fill(String(value), { timeout: 5000 });
    return;
  }

  const textbox = dialog.getByRole('textbox').first();
  await textbox.waitFor({ state: 'visible', timeout: 15000 });
  await textbox.fill(String(value), { timeout: 5000 });
}

async function fillRecurringPaymentsFields(page, values) {
  const dialog = await getVisibleDialog(page);
  const supplierIdInput = dialog.getByRole('textbox', { name: /supplier id/i }).first();
  const invoiceAmountInput = dialog.getByRole('spinbutton', { name: /invoice amount/i }).first();
  const facilityIdInput = dialog.getByRole('textbox', { name: /facility id/i }).first();

  await supplierIdInput.waitFor({ state: 'visible', timeout: 15000 });
  await supplierIdInput.fill(String(values.supplierId), { timeout: 5000 });
  await invoiceAmountInput.waitFor({ state: 'visible', timeout: 15000 });
  await invoiceAmountInput.fill(String(values.invoiceAmount), { timeout: 5000 });
  await facilityIdInput.waitFor({ state: 'visible', timeout: 15000 });
  await facilityIdInput.fill(String(values.facilityId), { timeout: 5000 });
}

async function submitCriteriaDialog(page) {
  const dialog = await getVisibleDialog(page);
  const button = dialog.getByRole('button', { name: /^submit$/i }).first();
  await button.waitFor({ state: 'visible', timeout: 15000 });
  await button.click({ timeout: 5000 });
  await expect(dialog).toBeHidden({ timeout: 15000 });
}

async function waitForToastText(page, textPattern) {
  const toastBody = page.locator('[data-sonner-toast], [aria-label="Notifications (F8)"]');
  await toastBody.first().waitFor({ state: 'visible', timeout: 15000 });

  if (textPattern) {
    await expect(toastBody.first()).toContainText(textPattern);
  }
}

async function openFirstRowActionsMenu(page) {
  const buttons = page.locator(criteriaSettingsSelectors.rowActionButtons.join(', '));
  const count = await buttons.count();

  for (let index = 0; index < count; index += 1) {
    const button = buttons.nth(index);
    if (await button.isVisible().catch(() => false)) {
      await button.click({ timeout: 5000 });
      return;
    }
  }

  throw new Error('No visible criteria row actions button was found.');
}

async function chooseRowAction(page, actionLabel) {
  const action = page.getByText(actionLabel, { exact: true }).first();
  await action.waitFor({ state: 'visible', timeout: 15000 });
  await action.click({ timeout: 5000 });
}

async function expectDialogText(page, text) {
  await page.getByText(text, { exact: true }).first().waitFor({ state: 'visible', timeout: 15000 });
}

module.exports = {
  criteriaSettingsHelpers: wrapHelperMapWithReadableSteps({
    openModule,
    openCriteriaSettings,
    verifyCriteriaSettingsVisible,
    selectCustomer,
    searchAllEntries,
    searchCharacter,
    expectSearchFieldValue,
    expectTableContainsText,
    clickResetSearchFilters,
    openColumnViewsMenu,
    verifyColumnViewOptionVisible,
    clickColumnViewOption,
    openPageSizeMenu,
    verifyPageSizeOptions,
    choosePageSize,
    readPaginationState,
    clickPaginationButton,
    expectPageNumber,
    openTableHeaderMenu,
    chooseTableHeaderAction,
    verifyTableHeaderVisible,
    verifyTableHeaderHidden,
    readColumnValues,
    expectColumnSorted,
    showCriteriaForm,
    expectCriteriaFormButtonText,
    openCriteriaCardAction,
    fillCharacterField,
    fillThresholdField,
    fillRecurringPaymentsFields,
    submitCriteriaDialog,
    waitForToastText,
    openFirstRowActionsMenu,
    chooseRowAction,
    expectDialogText,
    waitForCriteriaSettingsShell,
    waitForResultsTable,
    waitForSearchControls,
    selectors: criteriaSettingsSelectors
  }, {
    openModule: 'Open Duplicate Payments and Criteria Settings',
    openCriteriaSettings: 'Open Criteria Settings tab',
    verifyCriteriaSettingsVisible: 'Verify Criteria Settings tab is visible',
    selectCustomer: 'Select customer',
    searchAllEntries: 'Search all entries',
    searchCharacter: 'Search by character',
    expectSearchFieldValue: 'Verify search field value',
    expectTableContainsText: 'Verify results table contains expected text',
    clickResetSearchFilters: 'Reset search filters',
    openColumnViewsMenu: 'Open column settings menu',
    verifyColumnViewOptionVisible: 'Verify column option is visible',
    clickColumnViewOption: 'Toggle column option',
    openPageSizeMenu: 'Open pagination size menu',
    verifyPageSizeOptions: 'Verify pagination size options',
    choosePageSize: 'Choose pagination size',
    readPaginationState: 'Read pagination state',
    clickPaginationButton: 'Click pagination button',
    expectPageNumber: 'Verify current page number',
    openTableHeaderMenu: 'Open table header menu',
    chooseTableHeaderAction: 'Choose table header action',
    verifyTableHeaderVisible: 'Verify table header is visible',
    verifyTableHeaderHidden: 'Verify table header is hidden',
    readColumnValues: 'Read column values',
    expectColumnSorted: 'Verify column is sorted',
    showCriteriaForm: 'Show criteria form',
    expectCriteriaFormButtonText: 'Verify criteria form button text',
    openCriteriaCardAction: 'Open criteria card action dialog',
    fillCharacterField: 'Fill character field',
    fillThresholdField: 'Fill threshold field',
    fillRecurringPaymentsFields: 'Fill recurring payments fields',
    submitCriteriaDialog: 'Submit criteria dialog',
    waitForToastText: 'Verify success notification',
    openFirstRowActionsMenu: 'Open first row actions menu',
    chooseRowAction: 'Choose row action',
    expectDialogText: 'Verify dialog text',
    waitForCriteriaSettingsShell: 'Wait for Criteria Settings page shell',
    waitForResultsTable: 'Wait for results table',
    waitForSearchControls: 'Wait for search controls'
  })
};
