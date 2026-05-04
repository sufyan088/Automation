const { safeClick, safeFill, safeExpectVisible } = require('./actions');
const { clickIfFound } = require('./fallback');
const { customerModuleManagementSelectors } = require('../selectors/customerModuleManagement.selectors');

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildUniqueCustomerName(baseName = 'CustomerTest') {
  const stem = String(baseName).replace(/[^a-zA-Z0-9]/g, '').slice(0, 18) || 'CustomerTest';
  return `${stem}${Date.now().toString().slice(-6)}`;
}

function customerRowSelectors(customerName) {
  return [
    { type: 'text', value: customerName, name: `text:${customerName}` },
    { type: 'xpath', value: `//*[text()="${customerName}"]`, name: `xpath:${customerName}` }
  ];
}

function programManagerOptionSelectors(programManager) {
  return [
    { type: 'text', value: programManager, name: `text:${programManager}` },
    { type: 'custom', factory: (page) => page.getByRole('option', { name: programManager }).first(), name: `role option:${programManager}` }
  ];
}

function moduleOptionSelectors(moduleName) {
  return [
    { type: 'text', value: moduleName, name: `text:${moduleName}` },
    { type: 'custom', factory: (page) => page.getByRole('option', { name: new RegExp(`^${escapeRegExp(moduleName)}$`, 'i') }).first(), name: `role option:${moduleName}` }
  ];
}

function selfFundingLabelSelectors(moduleName) {
  const switchPattern = new RegExp(`(?:is\\s+)?${escapeRegExp(moduleName)}.*self-funded`, 'i');
  const labelPattern = moduleName === 'Statement Recon'
    ? /Statement Reconciliation Self Fund|Statement Recon.*self-funded/i
    : /Duplicate Payments Self Funding Sub|Duplicate Payments.*self-funded/i;

  return [
    { type: 'custom', factory: (page) => page.getByRole('switch', { name: switchPattern }).first(), name: `switch:${moduleName} self funding` },
    { type: 'custom', factory: (page) => page.getByText(labelPattern).first(), name: `label:${moduleName} self funding` },
    { type: 'custom', factory: (page) => page.locator('label').filter({ hasText: labelPattern }).first(), name: `label locator:${moduleName} self funding` }
  ];
}

async function closeModulePickerPopover(page) {
  const popover = page.locator('[data-radix-popper-content-wrapper]').filter({
    has: page.locator('[role="option"], [cmdk-item]')
  }).last();

  if (await popover.count()) {
    const mainDialogHeading = page.getByRole('dialog', { name: /update customer module subscription/i }).first()
      .getByRole('heading', { name: /update customer module subscription/i })
      .first();

    if (await mainDialogHeading.count()) {
      await mainDialogHeading.click({ timeout: 5000, force: true }).catch(() => {});
    }

    await popover.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }
}

async function openColumnOrder(page) {
  await safeClick(page, customerModuleManagementSelectors.columnOrderButton, 'Column Order button');
  await page.waitForTimeout(1000);
}

async function toggleSelfFundingColumn(page) {
  await openColumnOrder(page);
  const menuItem = page.getByRole('menuitemcheckbox', { name: /self funding/i }).first();

  if (await menuItem.count()) {
    await menuItem.click({ timeout: 10000, force: true });
    await page.waitForTimeout(1000);
    return true;
  }

  const fallbackMenuItem = page.locator('[role="menuitemcheckbox"], [role="option"], [data-radix-collection-item]').filter({ hasText: /self funding/i }).first();

  if (await fallbackMenuItem.count()) {
    await fallbackMenuItem.click({ timeout: 10000, force: true });
    await page.waitForTimeout(1000);
    return true;
  }

  console.log('Self Funding dropdown option was not exposed as a clickable popup item; keeping Column Order open state only.');
  await page.waitForTimeout(1000);
  return false;
}

async function searchCustomer(page, customerName) {
  await safeFill(page, customerModuleManagementSelectors.searchAllEntries, customerName, 'Search all entries');
  await page.waitForTimeout(2000);
  await safeExpectVisible(page, customerRowSelectors(customerName), `Customer row: ${customerName}`);
}

async function openCreateCustomer(page) {
  await safeClick(page, customerModuleManagementSelectors.addCustomerButton, 'Add customer button');
  await safeExpectVisible(page, customerModuleManagementSelectors.createCustomerHeading, 'Create Customer heading');
  await safeExpectVisible(page, customerModuleManagementSelectors.customerDetailsHeading, 'Customer Details heading');
}

async function openModuleSubscriptionControl(page) {
  await safeClick(page, customerModuleManagementSelectors.moduleSubscriptionControl, 'Module subscription control');
  await page.waitForTimeout(1000);
}

async function selectModule(page, moduleName) {
  const visibleOption = await clickIfFound(page, moduleOptionSelectors(moduleName), {
    timeoutPerCandidate: 500,
    actionTimeout: 3000
  });

  if (!visibleOption.clicked) {
    await openModuleSubscriptionControl(page);
    await safeClick(page, moduleOptionSelectors(moduleName), `${moduleName} module option`);
  }

  await page.waitForTimeout(1000);
}

async function toggleSelfFundingForModule(page, moduleName) {
  await closeModulePickerPopover(page);
  await safeExpectVisible(page, selfFundingLabelSelectors(moduleName), `${moduleName} self funding label`);
  await safeClick(page, selfFundingLabelSelectors(moduleName), `${moduleName} self funding toggle`);
  await page.waitForTimeout(1000);
}

async function createCustomerWithModules(page, options) {
  const { customerName, programManager, modules = [], selfFundingModules = [] } = options;

  await openCreateCustomer(page);
  await safeFill(page, customerModuleManagementSelectors.customerNameInput, customerName, 'Customer Name');
  let selectedProgramManager = false;

  for (let attempt = 1; attempt <= 3 && !selectedProgramManager; attempt += 1) {
    await safeClick(page, customerModuleManagementSelectors.programManagerSelect, 'Program Manager dropdown');
    await page.waitForTimeout(1000 * attempt);

    const requestedProgramManager = await clickIfFound(page, programManagerOptionSelectors(programManager), {
      timeoutPerCandidate: 2000,
      actionTimeout: 5000
    });

    if (requestedProgramManager.clicked) {
      console.log(`[CLICK] Program Manager option -> ${requestedProgramManager.matchedBy}`);
      selectedProgramManager = true;
      break;
    }

    const fallbackProgramManager = page.locator('[role="option"], [cmdk-item]').first();
    await fallbackProgramManager.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});

    if (await fallbackProgramManager.count()) {
      await fallbackProgramManager.click({ timeout: 10000, force: true });
      console.log('[CLICK] Program Manager option -> first visible option');
      selectedProgramManager = true;
      break;
    }

    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(500);
  }

  if (!selectedProgramManager) {
    throw new Error(`No Program Manager option was available. Requested: ${programManager}`);
  }

  await page.waitForTimeout(1000);

  for (const moduleName of modules) {
    await selectModule(page, moduleName);
  }

  for (const moduleName of selfFundingModules) {
    await toggleSelfFundingForModule(page, moduleName);
  }

  await safeClick(page, customerModuleManagementSelectors.createCustomerSubmit, 'Create Customer button');
  try {
    await safeExpectVisible(page, customerModuleManagementSelectors.customerCreatedToast, 'Customer created toast', { timeoutPerCandidate: 5000, expectTimeout: 5000 });
  } catch (error) {
    const returnedToList = page.getByRole('heading', { name: 'Customer Management' }).first();
    await returnedToList.waitFor({ state: 'visible', timeout: 10000 });
    console.log('Customer creation completed without toast; Customer Management page is visible.');
  }

  await page.waitForTimeout(2000);
}

async function openUpdateSubscription(page) {
  await safeClick(page, customerModuleManagementSelectors.updateSubscriptionButton, 'Update Subscription button');
  await page.waitForTimeout(1500);
}

async function openUpdateSubscriptionModuleDropdown(page) {
  const dialog = page.getByRole('dialog').first();
  const dropdownButton = dialog.locator('button').filter({ has: page.locator('svg.lucide-chevron-down, svg.lucide-chevrons-up-down') }).first();
  await dropdownButton.click({ timeout: 10000 });
  await page.waitForTimeout(1000);
}

async function addSubscriptionModule(page, moduleName) {
  await openUpdateSubscriptionModuleDropdown(page);
  await safeClick(page, moduleOptionSelectors(moduleName), `${moduleName} module option in update dialog`);
  await closeModulePickerPopover(page);
  await page.waitForTimeout(1000);
}

async function removeSubscriptionModule(page, moduleName) {
  await page.locator(`[aria-label="Remove ${moduleName}"]`).first().click({ timeout: 10000 });
  await page.waitForTimeout(2000);
}

async function confirmUpdateSubscription(page) {
  const dialog = page.getByRole('dialog', { name: /update customer module subscription/i }).first();
  const dialogUpdateButton = dialog.getByRole('button', { name: /update( update subscriptions)?/i }).first();

  await dialogUpdateButton.waitFor({ state: 'visible', timeout: 10000 });
  await dialogUpdateButton.click({ timeout: 10000, force: true });
  await dialog.waitFor({ state: 'hidden', timeout: 20000 });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(2000);
}

async function expectNoDataInSelfFundingColumn(page) {
  await safeExpectVisible(page, customerModuleManagementSelectors.noDataBadge, 'No data badge in Self Funding column');
}

module.exports = {
  buildUniqueCustomerName,
  createCustomerWithModules,
  toggleSelfFundingColumn,
  searchCustomer,
  openUpdateSubscription,
  addSubscriptionModule,
  removeSubscriptionModule,
  toggleSelfFundingForModule,
  confirmUpdateSubscription,
  expectNoDataInSelfFundingColumn
};