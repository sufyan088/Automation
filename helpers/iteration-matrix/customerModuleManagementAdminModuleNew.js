const { expect, test } = require('@playwright/test');
const { clickWithFallback, fillWithFallback, resolveFirst, expectVisibleWithFallback } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { customerModuleManagementAdminModuleNewSelectors } = require('../../selectors/iteration-matrix/customerModuleManagementAdminModuleNew.selectors.js');
const { customerManagementAdminNewHelpers } = require('./customerManagementAdminNew.js');
const { customerManagementPaymentMethodSelectors } = require('../../selectors/iteration-matrix/customerManagementPaymentMethod.selectors.js');

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
    .trim();
}

function getRenderedModuleName(moduleName) {
  if (moduleName === customerModuleManagementAdminModuleNewSelectors.modules.statementRecon) {
    return customerModuleManagementAdminModuleNewSelectors.labels.statementReconRendered;
  }

  return moduleName;
}

function getModuleAliases(moduleName) {
  const aliases = [moduleName, getRenderedModuleName(moduleName)].filter(Boolean);
  return [...new Set(aliases)];
}

async function resolveVisible(page, candidates, options = {}) {
  return resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500, ...options });
}

async function clickChoiceByName(page, optionName) {
  const candidates = [
    page.getByRole('option', { name: optionName, exact: true }).first(),
    page.getByRole('button', { name: optionName, exact: true }).first(),
    page.getByText(optionName, { exact: true }).first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 5000 });
      return true;
    }
  }

  return false;
}

async function openAdminModule(page) {
  const adminLink = await resolveVisible(page, customerModuleManagementAdminModuleNewSelectors.modulePage.adminModule, {
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (adminLink) {
    await adminLink.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 500);
  }
}

async function openModule(page) {
  await openAdminModule(page);

  const moduleLink = await resolveVisible(page, customerModuleManagementAdminModuleNewSelectors.modulePage.customerModuleManagementLink, {
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (moduleLink) {
    await moduleLink.locator.click({ timeout: 5000 });
  } else {
    const targetUrl = new URL(customerModuleManagementAdminModuleNewSelectors.modulePage.routeFragments.customerModuleManagement, page.url()).toString();
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  }

  await page.waitForURL((url) => url.toString().includes(customerModuleManagementAdminModuleNewSelectors.modulePage.routeFragments.customerModuleManagement), {
    timeout: 15000
  });
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleNewSelectors.modulePage.headings.customerModuleManagement, {
    expectTimeout: 15000
  });
  await waitForAppToSettle(page, 500);
  return page;
}

async function ensureTableVisible(page) {
  const table = await resolveVisible(page, customerModuleManagementAdminModuleNewSelectors.modulePage.table, { timeoutPerCandidate: 3000 });
  await expect(table.locator).toBeVisible({ timeout: 15000 });
  return table.locator;
}

async function extractTableSnapshot(page) {
  await ensureTableVisible(page);
  return page.locator('table').first().evaluate((table) => {
    const headers = Array.from(table.querySelectorAll('thead th')).map((header) => (header.textContent || '').trim().replace(/\s+/g, ' '));
    const rows = Array.from(table.querySelectorAll('tbody tr')).map((row) => (
      Array.from(row.querySelectorAll('td')).map((cell) => (cell.textContent || '').trim().replace(/\s+/g, ' '))
    ));

    return { headers, rows };
  });
}

function findColumnIndex(headers, targetLabel) {
  const normalizedTarget = normalizeForSort(targetLabel);
  return headers.findIndex((header) => normalizeForSort(header).includes(normalizedTarget));
}

function findRowByCustomerName(rows, customerName) {
  const normalizedCustomerName = normalizeForSort(customerName);
  return rows.find((row) => normalizeForSort(row[0] || '').includes(normalizedCustomerName));
}

async function searchField(page, candidates, value) {
  await fillWithFallback(page, candidates, value);
  await waitForAppToSettle(page, 500);
}

async function expectTableHeaderVisible(page, headerText) {
  await ensureTableVisible(page);
  await expect(page.getByRole('columnheader', { name: new RegExp(escapeRegExp(headerText), 'i') }).first()).toBeVisible({ timeout: 15000 }).catch(async () => {
    await expect(page.getByText(headerText, { exact: true }).first()).toBeVisible({ timeout: 15000 });
  });
}

async function expectCustomerRow(page, customerName) {
  await openModule(page);
  await searchField(page, customerModuleManagementAdminModuleNewSelectors.modulePage.searchFields.allEntries, customerName);
  const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(customerName), 'i') }).first();
  await row.waitFor({ state: 'visible', timeout: 15000 });
  return row;
}

async function expectCustomerRowColumnContains(page, customerName, columnLabel, expectedValues) {
  const snapshot = await extractTableSnapshot(page);
  const row = findRowByCustomerName(snapshot.rows, customerName);
  if (!row) {
    throw new Error(`Unable to find customer row for ${customerName}.`);
  }

  const columnIndex = findColumnIndex(snapshot.headers, columnLabel);
  if (columnIndex === -1) {
    throw new Error(`Unable to find column ${columnLabel}. Headers: ${snapshot.headers.join(', ')}`);
  }

  const cellText = row[columnIndex] || '';
  for (const expectedValue of expectedValues) {
    if (new RegExp(escapeRegExp(expectedValue), 'i').test(cellText)) {
      return cellText;
    }
  }

  throw new Error(`Expected ${columnLabel} to contain one of ${expectedValues.join(', ')} for ${customerName}. Received: ${cellText}`);
}

async function expectCustomerRowColumnNotContains(page, customerName, columnLabel, excludedValues) {
  const snapshot = await extractTableSnapshot(page);
  const row = findRowByCustomerName(snapshot.rows, customerName);
  if (!row) {
    throw new Error(`Unable to find customer row for ${customerName}.`);
  }

  const columnIndex = findColumnIndex(snapshot.headers, columnLabel);
  if (columnIndex === -1) {
    throw new Error(`Unable to find column ${columnLabel}. Headers: ${snapshot.headers.join(', ')}`);
  }

  const cellText = row[columnIndex] || '';
  for (const excludedValue of excludedValues) {
    expect(cellText).not.toMatch(new RegExp(escapeRegExp(excludedValue), 'i'));
  }

  return cellText;
}

async function createCustomerWithModules(page, data, moduleNames, selfFundingModules = []) {
  const { customerName } = await customerManagementAdminNewHelpers.openCreateCustomerForm(page, data);
  await customerManagementAdminNewHelpers.selectModules(page, moduleNames);

  for (const moduleName of selfFundingModules) {
    await customerManagementAdminNewHelpers.expectSelfFundingControls(page, moduleName, customerModuleManagementAdminModuleNewSelectors.labels.selfFundingDisabled);
    await customerManagementAdminNewHelpers.toggleSelfFunding(page, moduleName);
  }

  await customerManagementAdminNewHelpers.expectCreateCustomerButtonVisible(page);
  await customerManagementAdminNewHelpers.submitCustomer(page);
  return { customerName };
}

async function openUpdateSubscription(page, customerName) {
  const row = await expectCustomerRow(page, customerName);
  const button = row.getByRole('button', { name: /update subscription/i }).first();
  await button.click({ timeout: 5000 });
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleNewSelectors.modulePage.headings.updateSubscription, {
    expectTimeout: 15000
  });
}

async function expectModalOpen(page) {
  const dialog = await resolveVisible(page, customerModuleManagementAdminModuleNewSelectors.modulePage.overlays.dialog, {
    timeoutPerCandidate: 5000
  });
  await expect(dialog.locator).toBeVisible({ timeout: 15000 });
  return dialog.locator;
}

async function selectModalOption(page, moduleName) {
  await expectModalOpen(page);
  await clickWithFallback(page, customerModuleManagementAdminModuleNewSelectors.modulePage.modal.moduleSelectorTrigger);

  for (const optionName of getModuleAliases(moduleName)) {
    if (await clickChoiceByName(page, optionName)) {
      await waitForAppToSettle(page, 500);
      return;
    }
  }

  throw new Error(`Unable to select modal option for ${moduleName}.`);
}

async function removeModalSelection(page, moduleName) {
  const dialog = await expectModalOpen(page);

  for (const optionName of getModuleAliases(moduleName)) {
    const removable = dialog.locator(`[aria-label="Remove ${optionName}"]`).first();
    if (await removable.isVisible().catch(() => false)) {
      await removable.click({ timeout: 5000 });
      await waitForAppToSettle(page, 500);
      return;
    }
  }

  throw new Error(`Unable to remove modal selection for ${moduleName}.`);
}

async function expectModalSelfFundingLabel(page, moduleName) {
  const dialog = await expectModalOpen(page);

  for (const optionName of getModuleAliases(moduleName)) {
    const label = dialog.getByText(new RegExp(`${escapeRegExp(optionName)} Self Fund`, 'i')).first();
    if (await label.isVisible().catch(() => false)) {
      await expect(label).toBeVisible({ timeout: 15000 });
      return label;
    }
  }

  throw new Error(`Unable to find self-funding label for ${moduleName}.`);
}

async function toggleModalSelfFunding(page, moduleName) {
  const label = await expectModalSelfFundingLabel(page, moduleName);
  await label.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
}

async function clickModalUpdate(page) {
  await clickWithFallback(page, customerModuleManagementAdminModuleNewSelectors.modulePage.buttons.update);
  await waitForAppToSettle(page, 1000);
}

async function closeModal(page) {
  await clickWithFallback(page, customerModuleManagementAdminModuleNewSelectors.modulePage.buttons.close);
  await expect(page.getByRole('dialog').first()).toBeHidden({ timeout: 10000 });
}

async function ensureCustomerManagementPage(page) {
  const customerManagementHeading = await resolveVisible(page, customerModuleManagementAdminModuleNewSelectors.modulePage.headings.customerManagement, {
    timeoutPerCandidate: 3000
  }).catch(() => null);

  if (customerManagementHeading) {
    return;
  }

  const customerManagementLink = await resolveVisible(page, customerModuleManagementAdminModuleNewSelectors.modulePage.customerManagementLink, {
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (customerManagementLink) {
    await customerManagementLink.locator.click({ timeout: 5000 });
  } else {
    const targetUrl = new URL(customerModuleManagementAdminModuleNewSelectors.modulePage.routeFragments.customerManagement, page.url()).toString();
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  }

  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true }).first()).toBeVisible({ timeout: 20000 });
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
  const modules = customerModuleManagementAdminModuleNewSelectors.modules;
  const columns = customerModuleManagementAdminModuleNewSelectors.columns;

  switch (scenarioName) {
    case 'TS_29_To_verify_that_Management_Role_has_access_to_Customer_Module_Management': {
      await openModule(page);
      return;
    }
    case 'TS_30_To_verify_a_new_column_called_Self_Funding_in_Customer_Module_Table':
    case 'TS_31_To_verify_new_column_called_Self_Funding_in_Customer_Module_Table': {
      await openModule(page);
      await expectTableHeaderVisible(page, columns.selfFunding);
      return;
    }
    case 'TS_32_verify_Self_Funding_column_only_populate_if_customer_Subscriptions_for_below_where_Self_Funding_enabled': {
      const { customerName } = await createCustomerWithModules(page, data, [modules.statementRecon], [modules.statementRecon]);
      try {
        await expectCustomerRow(page, customerName);
        await expectTableHeaderVisible(page, columns.selfFunding);
        await expectCustomerRowColumnContains(page, customerName, columns.selfFunding, getModuleAliases(modules.statementRecon));
        return;
      } finally {
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    case 'TS_33_verify_user_clicks_Update_Sub_then_proceeds_to_remove_DP_should_removed_from_Sub_Col': {
      const { customerName } = await createCustomerWithModules(page, data, [modules.duplicatePayments]);
      try {
        await openUpdateSubscription(page, customerName);
        await removeModalSelection(page, modules.duplicatePayments);
        await clickModalUpdate(page);
        await expectCustomerRow(page, customerName);
        await expectCustomerRowColumnNotContains(page, customerName, columns.subscriptions, getModuleAliases(modules.duplicatePayments));
        return;
      } finally {
        await closeModal(page).catch(() => null);
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    case 'TS_34_verify_user_clicks_on_Update_Sub_then_proceeds_to_remove_SR_then_Sub_removed_from_Sub_col': {
      const { customerName } = await createCustomerWithModules(page, data, [modules.statementRecon]);
      try {
        await openUpdateSubscription(page, customerName);
        await removeModalSelection(page, modules.statementRecon);
        await clickModalUpdate(page);
        await expectCustomerRow(page, customerName);
        await expectCustomerRowColumnNotContains(page, customerName, columns.subscriptions, getModuleAliases(modules.statementRecon));
        return;
      } finally {
        await closeModal(page).catch(() => null);
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    case 'TS_35_To_verify_that_If_user_clicks_on_Update_Sub_then_proceeds_to_remove_DP_and_SR': {
      const { customerName } = await createCustomerWithModules(page, data, [modules.duplicatePayments, modules.statementRecon]);
      try {
        await openUpdateSubscription(page, customerName);
        await removeModalSelection(page, modules.duplicatePayments);
        await removeModalSelection(page, modules.statementRecon);
        await clickModalUpdate(page);
        await expectCustomerRow(page, customerName);
        await expectCustomerRowColumnNotContains(page, customerName, columns.subscriptions, getModuleAliases(modules.duplicatePayments));
        await expectCustomerRowColumnNotContains(page, customerName, columns.subscriptions, getModuleAliases(modules.statementRecon));
        return;
      } finally {
        await closeModal(page).catch(() => null);
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    case 'TS_36_To_verify_user_click_Update_Sub_and_remove_DP_then_Sub_removed_from_Self_Funding_Column': {
      const { customerName } = await createCustomerWithModules(page, data, [modules.duplicatePayments], [modules.duplicatePayments]);
      try {
        await openUpdateSubscription(page, customerName);
        await expectModalSelfFundingLabel(page, modules.duplicatePayments);
        await toggleModalSelfFunding(page, modules.duplicatePayments);
        await clickModalUpdate(page);
        await expectCustomerRow(page, customerName);
        await expectCustomerRowColumnNotContains(page, customerName, columns.selfFunding, getModuleAliases(modules.duplicatePayments));
        return;
      } finally {
        await closeModal(page).catch(() => null);
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    case 'TS_37_To_verify_user_click_Update_Sub_and_remove_SR_then_Sub_removed_from_Self_Funding_Column': {
      const { customerName } = await createCustomerWithModules(page, data, [modules.statementRecon], [modules.statementRecon]);
      try {
        await openUpdateSubscription(page, customerName);
        await expectModalSelfFundingLabel(page, modules.statementRecon);
        await toggleModalSelfFunding(page, modules.statementRecon);
        await clickModalUpdate(page);
        await expectCustomerRow(page, customerName);
        await expectCustomerRowColumnNotContains(page, customerName, columns.selfFunding, getModuleAliases(modules.statementRecon));
        return;
      } finally {
        await closeModal(page).catch(() => null);
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    case 'TS_38_To_verify_user_click_Update_Sub_and_remove_SR_and_DP_then_Sub_removed_from_Self_Funding_Column': {
      const { customerName } = await createCustomerWithModules(page, data, [modules.duplicatePayments, modules.statementRecon], [modules.duplicatePayments, modules.statementRecon]);
      try {
        await openUpdateSubscription(page, customerName);
        await expectModalSelfFundingLabel(page, modules.statementRecon);
        await toggleModalSelfFunding(page, modules.statementRecon);
        await expectModalSelfFundingLabel(page, modules.duplicatePayments);
        await toggleModalSelfFunding(page, modules.duplicatePayments);
        await clickModalUpdate(page);
        await expectCustomerRow(page, customerName);
        await expectCustomerRowColumnNotContains(page, customerName, columns.selfFunding, getModuleAliases(modules.statementRecon));
        await expectCustomerRowColumnNotContains(page, customerName, columns.selfFunding, getModuleAliases(modules.duplicatePayments));
        return;
      } finally {
        await closeModal(page).catch(() => null);
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    case 'TS_39_To_verify_that_if_user_clicks_on_Update_Sub_and_then_proceeds_to_add_DP_same_toggle_for_Self_Funding_appear': {
      const { customerName } = await createCustomerWithModules(page, data, [modules.imREmit]);
      try {
        await openUpdateSubscription(page, customerName);
        await selectModalOption(page, modules.duplicatePayments);
        await expectModalSelfFundingLabel(page, modules.duplicatePayments);
        await toggleModalSelfFunding(page, modules.duplicatePayments);
        return;
      } finally {
        await closeModal(page).catch(() => null);
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    case 'TS_40_To_verify_that_if_user_clicks_on_Update_Sub_and_then_proceeds_to_add_SR_same_toggle_for_Self_Funding_appear': {
      const { customerName } = await createCustomerWithModules(page, data, [modules.imREmit]);
      try {
        await openUpdateSubscription(page, customerName);
        await selectModalOption(page, modules.statementRecon);
        await expectModalSelfFundingLabel(page, modules.statementRecon);
        await toggleModalSelfFunding(page, modules.statementRecon);
        return;
      } finally {
        await closeModal(page).catch(() => null);
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    case 'TS_41_To_verify_if_user_clicks_on_Update_Sub_and_then_proceeds_to_add_SRand_DP_same_toggle_for_Self_Funding_appear': {
      const { customerName } = await createCustomerWithModules(page, data, [modules.imREmit]);
      try {
        await openUpdateSubscription(page, customerName);
        await selectModalOption(page, modules.statementRecon);
        await expectModalSelfFundingLabel(page, modules.statementRecon);
        await toggleModalSelfFunding(page, modules.statementRecon);
        await selectModalOption(page, modules.duplicatePayments);
        await expectModalSelfFundingLabel(page, modules.duplicatePayments);
        await toggleModalSelfFunding(page, modules.duplicatePayments);
        return;
      } finally {
        await closeModal(page).catch(() => null);
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    default:
      throw new Error(`Customer_Module_Management_Admin_Module_New scenario not implemented yet: ${scenarioName}`);
  }
}

const helperMap = {
  openModule,
  runScenario,
  buildUniqueCustomerName: customerManagementAdminNewHelpers.buildUniqueCustomerName,
  selectors: customerModuleManagementAdminModuleNewSelectors
};

module.exports = {
  customerModuleManagementAdminModuleNewHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario: async (page, data, scenarioName) => test.step(`Run ${humanizeScenarioTitle(scenarioName)}`, async () => {
      return runScenario(page, data, scenarioName);
    }),
    selectors: customerModuleManagementAdminModuleNewSelectors
  }
};
