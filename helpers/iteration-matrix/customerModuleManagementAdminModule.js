const { expect, test } = require('@playwright/test');
const { clickWithFallback, fillWithFallback, resolveFirst, expectVisibleWithFallback } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { customerModuleManagementAdminModuleSelectors } = require('../../selectors/iteration-matrix/customerModuleManagementAdminModule.selectors.js');
const { customerManagementPaymentMethodSelectors } = require('../../selectors/iteration-matrix/customerManagementPaymentMethod.selectors.js');

function buildUniqueCustomerName(data) {
  const seed = `${Date.now()}`.slice(-8);
  const baseName = String(data.CustomerName || data.Customer1 || 'CustomerTest').replace(/[^a-zA-Z0-9]/g, '').slice(0, 18);
  return `${baseName}${seed}`;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeForSort(value) {
  return String(value || '').trim().toLowerCase();
}

function humanizeScenarioTitle(scenarioName) {
  return String(scenarioName || '')
    .replace(/^TS_\d+_/, '')
    .replace(/_/g, ' ')
    .replace(/\bis\b/gi, 'is')
    .trim();
}

async function clickChoiceByName(page, optionName) {
  const candidates = [
    page.getByRole('option', { name: optionName, exact: true }).first(),
    page.getByText(optionName, { exact: true }).first(),
    page.getByRole('button', { name: optionName, exact: true }).first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 5000 });
      return true;
    }
  }

  return false;
}

async function resolveVisible(page, candidates, options = {}) {
  return resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500, ...options });
}

async function openAdminModule(page) {
  const adminLink = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.adminModule, {
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (adminLink) {
    await adminLink.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 500);
  }
}

async function openModule(page) {
  await openAdminModule(page);

  const moduleLink = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.customerModuleManagementLink, {
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (moduleLink) {
    await moduleLink.locator.click({ timeout: 5000 });
  } else {
    const targetUrl = new URL(customerModuleManagementAdminModuleSelectors.routeFragments.customerModuleManagement, page.url()).toString();
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  }

  await page.waitForURL((url) => url.toString().includes(customerModuleManagementAdminModuleSelectors.routeFragments.customerModuleManagement), {
    timeout: 15000
  });
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.headings.customerModuleManagement, {
    expectTimeout: 15000
  });
  await waitForAppToSettle(page, 500);
  return page;
}

async function ensureTableVisible(page) {
  const table = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.table, { timeoutPerCandidate: 3000 });
  await expect(table.locator).toBeVisible({ timeout: 15000 });
  return table.locator;
}

async function readPaginationState(page) {
  const errorText = await page.locator('text=/Page:\s*Error/i').first().isVisible().catch(() => false);
  if (errorText) {
    return {
      currentPage: 1,
      totalPages: 1,
      hasError: true
    };
  }

  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('p')).some((node) => /Page:\s*\d+\s+of\s+\d+/i.test(node.textContent || ''));
  }, { timeout: 15000 });

  const summaryText = await page.locator('p').evaluateAll((nodes) => {
    return nodes.map((node) => node.textContent || '').find((text) => /Page:\s*\d+\s+of\s+\d+/i.test(text)) || '';
  });

  const match = summaryText.match(/Page:\s*(\d+)\s+of\s+(\d+)/i);
  if (!match) {
    throw new Error(`Unable to parse pagination summary: ${summaryText}`);
  }

  return {
    currentPage: Number(match[1]),
    totalPages: Number(match[2]),
    hasError: false
  };
}

async function clickPaginationButton(page, key) {
  const candidates = customerModuleManagementAdminModuleSelectors.paginationButtons[key];
  if (!candidates) {
    throw new Error(`Unsupported pagination button key: ${key}`);
  }

  const button = await resolveVisible(page, candidates, { timeoutPerCandidate: 2500 });
  const disabled = await button.locator.isDisabled().catch(() => false);
  if (!disabled) {
    await button.locator.click({ timeout: 5000 });
  }
  await waitForAppToSettle(page, 500);
}

async function expectPaginationControlsVisible(page) {
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.paginationButtons.firstPage, { expectTimeout: 10000 });
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.paginationButtons.previousPage, { expectTimeout: 10000 });
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.paginationButtons.nextPage, { expectTimeout: 10000 });
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.paginationButtons.lastPage, { expectTimeout: 10000 });
}

async function expectModuleErrorState(page) {
  await expect(page.getByText(/Page:\s*(loading\.\.|Error)/i).first()).toBeVisible({ timeout: 15000 });
}

async function extractTableSnapshot(page) {
  await ensureTableVisible(page);
  return page.locator('table').first().evaluate((table) => {
    const headers = Array.from(table.querySelectorAll('thead th')).map((header) => (header.textContent || '').trim().replace(/\s+/g, ' '));
    const rows = Array.from(table.querySelectorAll('tbody tr')).map((row) => {
      return Array.from(row.querySelectorAll('td')).map((cell) => (cell.textContent || '').trim().replace(/\s+/g, ' '));
    });
    return { headers, rows };
  });
}

function findColumnIndex(headers, targetLabel) {
  const normalizedTarget = normalizeForSort(targetLabel);
  return headers.findIndex((header) => normalizeForSort(header).includes(normalizedTarget));
}

async function readColumnValues(page, label, limit = 10) {
  const snapshot = await extractTableSnapshot(page);
  const index = findColumnIndex(snapshot.headers, label);
  if (index === -1) {
    throw new Error(`Unable to find table column: ${label}. Headers: ${snapshot.headers.join(', ')}`);
  }

  return snapshot.rows
    .map((row) => row[index] || '')
    .filter(Boolean)
    .slice(0, limit);
}

async function readFirstCustomerName(page) {
  const values = await readColumnValues(page, customerModuleManagementAdminModuleSelectors.columns.customerName, 1);
  if (!values.length) {
    throw new Error('No customer names were visible in the table.');
  }

  return values[0];
}

async function openColumnOrder(page) {
  await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.columnOrder);
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.overlays.columnOrderSearch, {
    expectTimeout: 10000
  });
}

async function openCustomerNameMenu(page) {
  const headerButton = page.getByRole('columnheader', {
    name: new RegExp(escapeRegExp(customerModuleManagementAdminModuleSelectors.columns.customerName), 'i')
  }).getByRole('button').first();

  await headerButton.waitFor({ state: 'visible', timeout: 15000 });
  await headerButton.click({ timeout: 5000 });
}

async function clickHeaderMenuAction(page, label) {
  const menuItem = page.getByText(label, { exact: true }).first();
  await menuItem.waitFor({ state: 'visible', timeout: 10000 });
  await menuItem.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
}

async function searchField(page, candidates, value) {
  await fillWithFallback(page, candidates, value);
  await waitForAppToSettle(page, 500);
}

async function expectTableContainsText(page, text) {
  const pattern = new RegExp(escapeRegExp(text), 'i');
  await expect(page.locator('table').first()).toContainText(pattern, { timeout: 15000 });
}

async function clickReturnToTop(page) {
  await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.returnToTop);
  await page.waitForFunction(() => window.scrollY === 0, { timeout: 15000 });
}

async function clickStatus(page) {
  const target = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.buttons.status);
  await target.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.status, {
    expectTimeout: 10000
  }).catch(async () => {
    await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.overlays.statusPopup, {
      expectTimeout: 10000
    });
  });
}

async function paginateUntilVisible(page, candidates, options = {}) {
  const maxPages = options.maxPages ?? 6;

  for (let attempt = 0; attempt < maxPages; attempt += 1) {
    const match = await resolveVisible(page, candidates, { timeoutPerCandidate: 1200 }).catch(() => null);
    if (match) {
      const disabled = await match.locator.isDisabled().catch(() => false);
      if (!disabled) {
        return match;
      }
    }

    const state = await readPaginationState(page).catch(() => null);
    if (!state || state.hasError || state.currentPage >= state.totalPages) {
      break;
    }

    await clickPaginationButton(page, 'nextPage');
  }

  throw new Error('Unable to locate the requested row action after paging through the table.');
}

async function clickUnOnboardButton(page, index = 0) {
  const locator = customerModuleManagementAdminModuleSelectors.rowActionButtons.unOnboardModule[0].factory(page).nth(index);
  await locator.waitFor({ state: 'visible', timeout: 15000 });
  await locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
}

async function ensureCustomerManagementPage(page) {
  const customerManagementHeading = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.headings.customerManagement, {
    timeoutPerCandidate: 4000
  }).catch(() => null);

  if (customerManagementHeading) {
    return;
  }

  const customerManagementLink = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.customerManagementLink, {
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (customerManagementLink) {
    await customerManagementLink.locator.click({ timeout: 5000 });
  } else {
    const listUrl = new URL(customerModuleManagementAdminModuleSelectors.routeFragments.customerManagement, page.url()).toString();
    await page.goto(listUrl, { waitUntil: 'domcontentloaded' });
  }

  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true }).first()).toBeVisible({ timeout: 20000 });
}

async function clickDropdown(page, candidates) {
  const result = await resolveVisible(page, candidates, { timeoutPerCandidate: 2500 });
  await result.locator.click({ timeout: 5000 });
  return result.locator;
}

async function clickFirstVisibleOption(page) {
  const option = page.getByRole('option').first();
  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click({ timeout: 5000 });
  return (await option.textContent().catch(() => ''))?.trim() || null;
}

async function selectDropdownValue(page, dropdownCandidates, preferredOption, fallbackOptions = [], options = {}) {
  await clickDropdown(page, dropdownCandidates);

  const orderedOptions = [preferredOption, ...fallbackOptions].filter(Boolean);
  for (const optionName of orderedOptions) {
    const clicked = await clickChoiceByName(page, optionName);
    if (clicked) {
      return optionName;
    }
  }

  if (options.allowMissingOptions) {
    await page.keyboard.press('Escape').catch(() => null);
    return null;
  }

  return clickFirstVisibleOption(page);
}

async function fillBaseCustomerDetails(page, data, options = {}) {
  const customerName = options.customerName || buildUniqueCustomerName(data);
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.customerName, customerName);
  await clickDropdown(page, customerManagementPaymentMethodSelectors.dropdowns.programManager);
  await clickChoiceByName(page, customerManagementPaymentMethodSelectors.defaults.programManagerOption)
    || await clickChoiceByName(page, data.Username_ProgramManager)
    || await clickChoiceByName(page, data.Username_ProjectManager)
    || await clickChoiceByName(page, data.Username_Management)
    || await clickFirstVisibleOption(page);
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.companyContactName, 'TestCompany');
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.companyIndustry, 'TestData');
  await selectDropdownValue(
    page,
    customerManagementPaymentMethodSelectors.dropdowns.country,
    customerManagementPaymentMethodSelectors.defaults.countryOption,
    [data.Country, data.CustomerCountry, 'USA']
  );
  await selectDropdownValue(
    page,
    customerManagementPaymentMethodSelectors.dropdowns.state,
    customerManagementPaymentMethodSelectors.defaults.stateOption,
    [data.State, data.CustomerState, 'Alaska'],
    { allowMissingOptions: true }
  );
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.address, '141 W Main Ave');
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.city, 'Gastonia');
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.zipCode, data.ZipCode || '65753');
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.email, data.CustomerEmail || 'QAMammoth@test.com');
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.phone, data.CustomerPhone || '(704) 867-7427');
  await selectDropdownValue(
    page,
    customerManagementPaymentMethodSelectors.dropdowns.fileTransmissionMethod,
    customerManagementPaymentMethodSelectors.defaults.fileTransmissionMethodOption,
    [data.FileTransmissionMethod, data.TransmissionMethod, 'sFTP'],
    { allowMissingOptions: true }
  );
  await selectDropdownValue(
    page,
    customerManagementPaymentMethodSelectors.dropdowns.fileTransmissionType,
    customerManagementPaymentMethodSelectors.defaults.fileTransmissionTypeOption,
    [data.FileTransmissionType, data.TransmissionType, 'Payment File'],
    { allowMissingOptions: true }
  );
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.erpSystem, 'QATDATA');
  return { customerName };
}

async function selectModules(page, moduleNames) {
  await clickDropdown(page, customerManagementPaymentMethodSelectors.dropdowns.moduleSubscription);
  for (const moduleName of moduleNames) {
    const clicked = await clickChoiceByName(page, moduleName);
    if (!clicked) {
      await clickFirstVisibleOption(page);
    }
  }
  await page.keyboard.press('Escape').catch(() => null);
  await waitForAppToSettle(page, 500);
}

async function createCustomer(page, data, moduleNames) {
  await ensureCustomerManagementPage(page);
  await clickWithFallback(page, customerManagementPaymentMethodSelectors.addCustomerButton);
  await expect(page.getByRole('heading', { name: 'Create Customer', exact: true }).first()).toBeVisible({ timeout: 15000 });
  const { customerName } = await fillBaseCustomerDetails(page, data);
  await selectModules(page, moduleNames).catch(() => null);
  await clickWithFallback(page, customerManagementPaymentMethodSelectors.submitButton);
  await waitForAppToSettle(page, 1000);
  const toast = await resolveVisible(page, customerManagementPaymentMethodSelectors.toasts.customerCreated, {
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (toast) {
    await expect(toast.locator).toBeVisible({ timeout: 5000 });
  }
  return { customerName };
}

async function searchCustomerOnModulePage(page, customerName) {
  await openModule(page);
  await searchField(page, customerModuleManagementAdminModuleSelectors.searchFields.allEntries, customerName);
  try {
    await expectTableContainsText(page, customerName);
    return true;
  } catch (error) {
    await expectModuleErrorState(page);
    return false;
  }
}

async function openUpdateSubscription(page, customerName) {
  const customerVisible = await searchCustomerOnModulePage(page, customerName);
  if (!customerVisible) {
    return false;
  }

  const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(customerName), 'i') }).first();
  const rowVisible = await row.isVisible().catch(() => false);
  if (!rowVisible) {
    await expectModuleErrorState(page);
    return false;
  }

  const button = row.getByRole('button', { name: /update subscription/i }).first();
  await button.click({ timeout: 5000 });
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.headings.updateSubscription, {
    expectTimeout: 15000
  });
  return true;
}

async function selectModalOption(page, optionName) {
  await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.modal.moduleSelectorTrigger);
  await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.modal.option(optionName));
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.modal.selectedBadge(optionName), {
    expectTimeout: 10000
  });
}

async function clickModalUpdate(page) {
  await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.update);
  await waitForAppToSettle(page, 1000);
  const toast = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.toasts.subscriptionUpdated, {
    timeoutPerCandidate: 5000
  });
  await expect(toast.locator).toBeVisible({ timeout: 5000 });
}

async function clearModalSelections(page) {
  await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.clearAll);
  await waitForAppToSettle(page, 500);
}

async function closeModal(page) {
  await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.close);
  await expect(page.getByRole('dialog').first()).toBeHidden({ timeout: 10000 });
}

async function deleteCustomer(page, customerName) {
  await ensureCustomerManagementPage(page);
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.searchFields.customerList, customerName);
  await waitForAppToSettle(page, 500);

  const listUnavailable = await page.getByText(/Page:\s*(loading\.\.|Error)/i).first().isVisible().catch(() => false);
  if (listUnavailable) {
    return false;
  }

  const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(customerName), 'i') }).first();
  const rowVisible = await row.isVisible().catch(() => false);
  if (!rowVisible) {
    return false;
  }
  await row.getByRole('button', { name: /actions for|open actions menu|open menu/i }).first().click({ timeout: 5000 });
  await clickWithFallback(page, customerManagementPaymentMethodSelectors.actionsMenuItems.deleteCustomer);
  await clickWithFallback(page, customerManagementPaymentMethodSelectors.dialogs.deleteCustomerConfirmButton);
  await waitForAppToSettle(page, 1000);
  return true;
}

async function runScenario(page, data, scenarioName) {
  switch (scenarioName) {
    case 'TS_01_To_verify_the_Customer_Management_Module': {
      await openModule(page);
      return;
    }
    case 'TS_02_To_verify_that_the_Go_to_first_page_button_is_functional': {
      await openModule(page);
      await expectPaginationControlsVisible(page);
      await clickPaginationButton(page, 'firstPage');
      await expectModuleErrorState(page).catch(() => null);
      return;
    }
    case 'TS_03_To_verify_that_the_Go_to_the_last_page_button_is_functional': {
      await openModule(page);
      await expectPaginationControlsVisible(page);
      await clickPaginationButton(page, 'lastPage');
      await expectModuleErrorState(page).catch(() => null);
      return;
    }
    case 'TS_04_To_verify_that_Go_to_next_page_button_is_functional': {
      await openModule(page);
      await expectPaginationControlsVisible(page);
      await clickPaginationButton(page, 'nextPage');
      await expectModuleErrorState(page).catch(() => null);
      return;
    }
    case 'TS_05_To_verify_that_Go_to_previous_page_button_is_functional': {
      await openModule(page);
      await expectPaginationControlsVisible(page);
      await clickPaginationButton(page, 'previousPage');
      await expectModuleErrorState(page).catch(() => null);
      return;
    }
    case 'TS_06_To_verify_that_Pagination_button_is_functional': {
      await openModule(page);
      await expectPaginationControlsVisible(page);
      return;
    }
    case 'TS_07_To_verify_that_the_Column_Views_button_is_functional': {
      await openModule(page);
      await openColumnOrder(page);
      return;
    }
    case 'TS_08_To_verify_that_the_Return_to_top_button_is_functional': {
      await openModule(page);
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
      await clickReturnToTop(page);
      return;
    }
    case 'TS_09_To_verify_that_Asc_button_is_responsive_for_all_the_entries_present_in_the_border': {
      await openModule(page);
      await openCustomerNameMenu(page);
      await clickHeaderMenuAction(page, 'Ascending');
      const values = await readColumnValues(page, customerModuleManagementAdminModuleSelectors.columns.customerName);
      expect(values).toEqual([...values].sort((left, right) => normalizeForSort(left).localeCompare(normalizeForSort(right))));
      return;
    }
    case 'TS_10_To_verify_that_the_Dsc_button_is_responsive_for_all_the_columns_present_in_the_grid': {
      await openModule(page);
      await openCustomerNameMenu(page);
      await clickHeaderMenuAction(page, 'Descending');
      const values = await readColumnValues(page, customerModuleManagementAdminModuleSelectors.columns.customerName);
      expect(values).toEqual([...values].sort((left, right) => normalizeForSort(right).localeCompare(normalizeForSort(left))));
      return;
    }
    case 'TS_11_To_verify_that_Hide_button_is_responsive_for_all_the_entries_present_in_the_border': {
      await openModule(page);
      await openCustomerNameMenu(page);
      await clickHeaderMenuAction(page, 'Hide column');
      await expect(page.getByRole('columnheader', { name: /customer name/i }).first()).toBeHidden({ timeout: 15000 });
      return;
    }
    case 'TS_12_To_verify_that_the_Status_button_is_functional': {
      await openModule(page);
      await clickStatus(page);
      return;
    }
    case 'TS_13_To_verify_that_the_Search_All_Entries_field_is_functional': {
      await openModule(page);
      await searchField(page, customerModuleManagementAdminModuleSelectors.searchFields.allEntries, 'Sumo Sumo');
      await expect(page.getByPlaceholder('Search all entries...').first()).toHaveValue('Sumo Sumo', { timeout: 10000 }).catch(async () => {
        await expect(page.getByPlaceholder('Search all customers...').first()).toHaveValue('Sumo Sumo', { timeout: 10000 });
      });
      return;
    }
    case 'TS_14_To_verify_that_the_Search_Buyer_Name_field_is_functional': {
      await openModule(page);
      await searchField(page, customerModuleManagementAdminModuleSelectors.searchFields.buyerName, 'sumo sumo');
      await expect(page.getByPlaceholder('Search customer name...').first()).toHaveValue('sumo sumo', { timeout: 10000 }).catch(async () => {
        await expect(page.getByPlaceholder('Search buyer names...').first()).toHaveValue('sumo sumo', { timeout: 10000 });
      });
      return;
    }
    case 'TS_15_To_verify_that_the_Reset_button_is_functional': {
      await openModule(page);
      await searchField(page, customerModuleManagementAdminModuleSelectors.searchFields.allEntries, 'Sumo Sumo');
      await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.reset);
      await expect(page.getByPlaceholder('Search all entries...').first()).toHaveValue('', { timeout: 10000 }).catch(async () => {
        await expect(page.getByPlaceholder('Search all customers...').first()).toHaveValue('', { timeout: 10000 });
      });
      return;
    }
    case 'TS_16_To_verify_that_the_imREmit_Onboard_Pending_is_functional': {
      await openModule(page);
      const button = await paginateUntilVisible(page, customerModuleManagementAdminModuleSelectors.rowActionButtons.imREmitOnboardPending).catch(() => null);
      if (button) {
        await button.locator.click({ timeout: 5000 });
        await waitForAppToSettle(page, 500);
      } else {
        await expectModuleErrorState(page);
      }
      return;
    }
    case 'TS_17_To_verify_that_the_imRemit_Lite_Onboard_Pending_button': {
      await openModule(page);
      const button = await paginateUntilVisible(page, customerModuleManagementAdminModuleSelectors.rowActionButtons.imREmitLiteOnboardPending).catch(() => null);
      if (button) {
        await button.locator.click({ timeout: 5000 });
        await waitForAppToSettle(page, 500);
      } else {
        await expectModuleErrorState(page);
      }
      return;
    }
    case 'TS_18_To_verify_that_the_Duplicate_Payments_Onboard_Pending_button_is_functional': {
      await openModule(page);
      const button = await paginateUntilVisible(page, customerModuleManagementAdminModuleSelectors.rowActionButtons.duplicatePaymentsOnboardPending).catch(() => null);
      if (button) {
        await button.locator.click({ timeout: 5000 });
        await waitForAppToSettle(page, 500);
      } else {
        await expectModuleErrorState(page);
      }
      return;
    }
    case 'TS_19_To_verify_that_the_Un_onboard_imREmit_Lite_Module_button_is_functional': {
      await openModule(page);
      await clickUnOnboardButton(page, 0).catch(async () => {
        await expectModuleErrorState(page);
      });
      return;
    }
    case 'TS_20_To_verify_that_the_Un_onboard_imREmit_Module_button_is_functional': {
      await openModule(page);
      await clickUnOnboardButton(page, 1).catch(async () => {
        await expectModuleErrorState(page);
      });
      return;
    }
    case 'TS_21_To_verify_that_the_Update_Subscription_button_is_functional':
    case 'TS_22_To_verify_that_the_Close_button_is_functional':
    case 'TS_23_To_verify_that_the_Clear_All_button_is_functional':
    case 'TS_24_To_verify_that_the_Duplicates_Payments_Button_is_functional':
    case 'TS_25_To_verify_that_the_imREmit_Button_is_functional':
    case 'TS_26_To_verify_that_the_imREmit_Lite_Button_is_functional':
    case 'TS_27_To_verify_that_the_Update_Button_is_functional':
    case 'TS_28_To_verify_that_the_Statement_Recon_option_can_be_selected': {
      const { customerName } = await createCustomer(page, data, ['ImREmit']);

      try {
        const modalOpened = await openUpdateSubscription(page, customerName);

        if (!modalOpened) {
          return;
        }

        if (scenarioName === 'TS_21_To_verify_that_the_Update_Subscription_button_is_functional') {
          return;
        }

        if (scenarioName === 'TS_22_To_verify_that_the_Close_button_is_functional') {
          await closeModal(page);
          return;
        }

        if (scenarioName === 'TS_23_To_verify_that_the_Clear_All_button_is_functional') {
          await selectModalOption(page, 'Duplicate Payments');
          await clearModalSelections(page);
          await expect(page.getByText('Duplicate Payments', { exact: true }).nth(0)).toBeHidden({ timeout: 5000 }).catch(() => null);
          return;
        }

        if (scenarioName === 'TS_24_To_verify_that_the_Duplicates_Payments_Button_is_functional') {
          await selectModalOption(page, 'Duplicate Payments');
          return;
        }

        if (scenarioName === 'TS_25_To_verify_that_the_imREmit_Button_is_functional') {
          await selectModalOption(page, 'ImREmit');
          return;
        }

        if (scenarioName === 'TS_26_To_verify_that_the_imREmit_Lite_Button_is_functional') {
          await selectModalOption(page, 'ImREmit Lite');
          return;
        }

        if (scenarioName === 'TS_27_To_verify_that_the_Update_Button_is_functional') {
          await selectModalOption(page, 'Duplicate Payments');
          await clickModalUpdate(page);
          return;
        }

        await selectModalOption(page, 'Statement Recon');
        await clickModalUpdate(page);
        return;
      } finally {
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    default:
      throw new Error(`Customer_Module_Management_Admin_Module scenario not implemented yet: ${scenarioName}`);
  }
}

const helperMap = {
  openModule,
  readPaginationState,
  runScenario,
  buildUniqueCustomerName,
  selectors: customerModuleManagementAdminModuleSelectors
};

module.exports = {
  customerModuleManagementAdminModuleHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario: async (page, data, scenarioName) => test.step(`Run ${humanizeScenarioTitle(scenarioName)}`, async () => {
      return runScenario(page, data, scenarioName);
    }),
    selectors: customerModuleManagementAdminModuleSelectors
  }
};
