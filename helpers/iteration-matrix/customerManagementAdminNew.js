const { expect, test } = require('@playwright/test');
const { resolveFirst, clickWithFallback, fillWithFallback } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { customerManagementAdminNewSelectors } = require('../../selectors/iteration-matrix/customerManagementAdminNew.selectors.js');

function buildUniqueCustomerName(data) {
  const seed = `${Date.now()}`.slice(-8);
  const baseName = String(data.CustomerName || data.Customer1 || 'CustomerTest').replace(/[^a-zA-Z0-9]/g, '').slice(0, 18);
  return `${baseName}${seed}`;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toXPathLiteral(value) {
  const text = String(value);
  if (!text.includes('"')) {
    return `"${text}"`;
  }

  if (!text.includes("'")) {
    return `'${text}'`;
  }

  const parts = text.split('"');
  return `concat(${parts.map((part, index) => {
    const literals = [];
    if (part) {
      literals.push(`"${part}"`);
    }
    if (index < parts.length - 1) {
      literals.push(`'"'`);
    }
    return literals.join(', ');
  }).filter(Boolean).join(', ')})`;
}

function getRenderedModuleName(moduleName) {
  if (moduleName === customerManagementAdminNewSelectors.modules.statementRecon) {
    return 'Statement Reconciliation';
  }

  return moduleName;
}

async function clickOptionByName(page, optionName) {
  const option = page.getByRole('option', { name: optionName, exact: true }).first();
  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click();
}

async function optionOrButtonIsVisible(page, optionName) {
  const candidates = [
    page.getByRole('option', { name: optionName, exact: true }).first(),
    page.getByRole('button', { name: optionName, exact: true }).first(),
    page.getByText(optionName, { exact: true }).first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      return true;
    }
  }

  return false;
}

async function clickFirstVisibleOption(page) {
  const option = page.getByRole('option').first();
  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click();
}

async function clickOptionWithFallback(page, optionNames) {
  for (const optionName of optionNames) {
    if (!String(optionName || '').trim()) {
      continue;
    }

    const option = page.getByRole('option', { name: String(optionName), exact: true }).first();
    if (await option.isVisible().catch(() => false)) {
      await option.click();
      return;
    }
  }

  await clickFirstVisibleOption(page);
}

async function selectDropdownValue(page, dropdownCandidates, preferredOption, fallbackOptions = [], options = {}) {
  await clickDropdown(page, dropdownCandidates);

  if (preferredOption && await optionOrButtonIsVisible(page, preferredOption)) {
    await clickOptionByName(page, preferredOption);
    return preferredOption;
  }

  for (const optionName of fallbackOptions) {
    if (!String(optionName || '').trim()) {
      continue;
    }

    if (await optionOrButtonIsVisible(page, optionName)) {
      await clickOptionByName(page, optionName);
      return optionName;
    }
  }

  try {
    await clickFirstVisibleOption(page);
    return null;
  } catch (error) {
    if (!options.allowMissingOptions) {
      throw error;
    }

    await page.keyboard.press('Escape').catch(() => null);
    return null;
  }
}

async function clickDropdown(page, candidates) {
  const result = await resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500 });
  await result.locator.click();
  return result.locator;
}

async function waitForStateControlReady(page) {
  await expect(async () => {
    const stateControl = await resolveFirst(page, customerManagementAdminNewSelectors.dropdowns.state, {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    });
    const disabled = await stateControl.locator.isDisabled().catch(() => false);
    const text = ((await stateControl.locator.textContent().catch(() => '')) || '').trim();

    expect(disabled).toBe(false);
    expect(text).not.toMatch(/please select country first/i);
  }).toPass({ timeout: 10000 });
}

async function ensureDropdownValueSelected(page, dropdownCandidates, expectedValue, fallbackOptions = []) {
  await waitForAppToSettle(page, 500);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const control = await clickDropdown(page, dropdownCandidates);
    await clickOptionWithFallback(page, [expectedValue, ...fallbackOptions]);
    await waitForAppToSettle(page, 500);

    const text = ((await control.textContent().catch(() => '')) || '').trim();
    if (new RegExp(escapeRegExp(expectedValue), 'i').test(text)) {
      return;
    }
  }

  const control = await resolveFirst(page, dropdownCandidates, { mustBeVisible: true, timeoutPerCandidate: 1500 });
  const text = ((await control.locator.textContent().catch(() => '')) || '').trim();
  throw new Error(`Expected dropdown to select ${expectedValue}, but current text is: ${text || '[empty]'}`);
}

async function moduleDropdownIsReady(page) {
  const matched = await resolveFirst(page, customerManagementAdminNewSelectors.dropdowns.moduleSubscription, {
    mustBeVisible: true,
    timeoutPerCandidate: 1500
  }).catch(() => null);

  return Boolean(matched);
}

async function ensureModulesLoaded(page) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (await moduleDropdownIsReady(page)) {
      return;
    }

    const loadErrorVisible = await page.getByText(/Error loading modules/i).first().isVisible().catch(() => false);
    if (loadErrorVisible) {
      throw new Error('Create Customer page showed Error loading modules.');
    }

    await waitForAppToSettle(page, 750);
  }

  const headingVisible = await page.getByRole('heading', { name: 'Create Customer', exact: true }).first().isVisible().catch(() => false);
  const statePrompt = await page.getByRole('button', { name: /please select country first|select address state/i }).first().textContent().catch(() => '');
  throw new Error(
    `Create Customer page never exposed the module selector on the filled form. Create heading visible: ${headingVisible}. State control: ${String(statePrompt || '').trim() || 'n/a'}. URL: ${page.url()}`
  );
}

async function ensureCreateCustomerPage(page) {
  const customerManagementLink = page.getByRole('link', { name: 'Customer Management', exact: true }).first();
  if (!(await customerManagementLink.isVisible().catch(() => false))) {
    await clickWithFallback(page, customerManagementAdminNewSelectors.adminModule);
    await waitForAppToSettle(page, 1000);
  }

  if (!(await customerManagementLink.isVisible().catch(() => false))) {
    const createUrl = new URL('/app/admin/customer-management/create', page.url()).toString();
    await page.goto(createUrl, { waitUntil: 'domcontentloaded' });
  }

  if (!(await page.getByRole('heading', { name: 'Create Customer', exact: true }).first().isVisible().catch(() => false))) {
    await clickWithFallback(page, customerManagementAdminNewSelectors.customerManagementLink);
  }

  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true })).toBeVisible({ timeout: 15000 });
  if (!(await page.getByRole('heading', { name: 'Create Customer', exact: true }).first().isVisible().catch(() => false))) {
    await clickWithFallback(page, customerManagementAdminNewSelectors.addCustomerButton);
  }
  await expect(page.getByRole('heading', { name: 'Create Customer', exact: true })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Customer Details', exact: true })).toBeVisible({ timeout: 15000 });
}

async function fillBaseCustomerDetails(page, data, options = {}) {
  const customerName = options.customerName || buildUniqueCustomerName(data);

  await fillWithFallback(page, customerManagementAdminNewSelectors.fields.customerName, customerName);
  await clickDropdown(page, customerManagementAdminNewSelectors.dropdowns.programManager);
  await clickOptionWithFallback(page, [
    customerManagementAdminNewSelectors.programManagerOption,
    data.Username_ProgramManager,
    data.Username_ProjectManager,
    data.Username_Management
  ]);

  await fillWithFallback(page, customerManagementAdminNewSelectors.fields.companyContactName, 'TestCompany');
  await fillWithFallback(page, customerManagementAdminNewSelectors.fields.companyIndustry, 'TestData');

  await selectDropdownValue(
    page,
    customerManagementAdminNewSelectors.dropdowns.country,
    customerManagementAdminNewSelectors.countryOption,
    [data.Country, data.CustomerCountry, 'USA']
  );

  await waitForStateControlReady(page);

  await ensureDropdownValueSelected(
    page,
    customerManagementAdminNewSelectors.dropdowns.state,
    customerManagementAdminNewSelectors.stateOption,
    [data.State, data.CustomerState, 'Alaska']
  );

  await fillWithFallback(page, customerManagementAdminNewSelectors.fields.address, '141 W Main Ave');
  await fillWithFallback(page, customerManagementAdminNewSelectors.fields.city, 'Gastonia');
  await fillWithFallback(page, customerManagementAdminNewSelectors.fields.zipCode, data.ZipCode || '65753');
  await fillWithFallback(page, customerManagementAdminNewSelectors.fields.email, data.CustomerEmail || 'QAMammoth@test.com');
  await fillWithFallback(page, customerManagementAdminNewSelectors.fields.phone, data.CustomerPhone || '(704) 867-7427');

  await selectDropdownValue(
    page,
    customerManagementAdminNewSelectors.dropdowns.fileTransmissionMethod,
    customerManagementAdminNewSelectors.fileTransmissionMethodOption,
    [data.FileTransmissionMethod, data.TransmissionMethod, 'sFTP'],
    { allowMissingOptions: true }
  );
  await selectDropdownValue(
    page,
    customerManagementAdminNewSelectors.dropdowns.fileTransmissionType,
    customerManagementAdminNewSelectors.fileTransmissionTypeOption,
    [data.FileTransmissionType, data.TransmissionType, 'Payment File'],
    { allowMissingOptions: true }
  );
  await fillWithFallback(page, customerManagementAdminNewSelectors.fields.erpSystem, 'QATDATA');

  return { customerName };
}

async function openModuleDropdown(page) {
  await ensureModulesLoaded(page);
  await clickDropdown(page, customerManagementAdminNewSelectors.dropdowns.moduleSubscription);

  await expect(async () => {
    const optionCount = await page.getByRole('option').count();
    expect(optionCount).toBeGreaterThan(0);
  }).toPass({ timeout: 15000 });
}

async function expectModuleOptions(page, moduleNames) {
  await openModuleDropdown(page);

  for (const moduleName of moduleNames) {
    await expect(page.getByRole('option', { name: moduleName, exact: true }).first()).toBeVisible({ timeout: 15000 });
  }
}

async function selectModules(page, moduleNames) {
  await openModuleDropdown(page);
  for (const moduleName of moduleNames) {
    await clickOptionByName(page, moduleName);
  }

  await page.keyboard.press('Escape').catch(() => null);
  await waitForAppToSettle(page, 500);
}

function moduleCard(page, moduleName) {
  const switchLocator = page.getByRole('switch', {
    name: new RegExp(`^Is ${escapeRegExp(moduleName)} self-funded\\?$`)
  }).first();
  const renderedModuleName = getRenderedModuleName(moduleName);
  const description = customerManagementAdminNewSelectors.labels.selfFundingDescription;

  return switchLocator.locator(
    `xpath=ancestor::div[.//*[normalize-space()=${toXPathLiteral(renderedModuleName)}] and .//*[normalize-space()=${toXPathLiteral(description)}]][1]`
  );
}

async function expectModuleSelected(page, moduleName) {
  const card = moduleCard(page, moduleName);
  const renderedModuleName = getRenderedModuleName(moduleName);
  await expect(card).toBeVisible({ timeout: 15000 });
  await expect(card).toContainText(renderedModuleName, { timeout: 15000 });
  return card;
}

async function expectRoleBadge(page, roleName) {
  await expect(page.getByText(roleName, { exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function expectCreateCustomerButtonVisible(page) {
  const matchedButton = await resolveFirst(page, customerManagementAdminNewSelectors.submitButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });

  await expect(matchedButton.locator).toBeVisible({ timeout: 15000 });
}

async function expectSelfFundingControls(page, moduleName, expectedStatus = customerManagementAdminNewSelectors.labels.selfFundingDisabled) {
  const card = await expectModuleSelected(page, moduleName);
  await expect(card.getByText(customerManagementAdminNewSelectors.labels.selfFundingDescription, { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(card.getByText(expectedStatus, { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(card.getByRole('switch')).toBeVisible({ timeout: 15000 });
  return card;
}

async function toggleSelfFunding(page, moduleName) {
  const card = await expectModuleSelected(page, moduleName);
  await card.getByRole('switch').click();
  await expect(card.getByText(customerManagementAdminNewSelectors.labels.selfFundingEnabled, { exact: true })).toBeVisible({ timeout: 15000 });
}

async function submitCustomer(page) {
  await clickWithFallback(page, customerManagementAdminNewSelectors.submitButton);
  await waitForAppToSettle(page, 1000);

  try {
    const matchedToast = await resolveFirst(page, customerManagementAdminNewSelectors.successToast, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });

    await expect(matchedToast.locator).toBeVisible({ timeout: 5000 });
    return;
  } catch (error) {
    await expect(page.getByRole('heading', { name: 'Customer Management', exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/app\/admin\/customer-management(?:\?.*)?$/i, { timeout: 15000 });
  }
}

async function openCreateCustomerForm(page, data) {
  await ensureCreateCustomerPage(page);
  return fillBaseCustomerDetails(page, data);
}

module.exports = {
  customerManagementAdminNewHelpers: {
    openCreateCustomerForm: async (page, data) => test.step('Open Create Customer page', async () => {
      return openCreateCustomerForm(page, data);
    }),
    openModuleDropdown: async (page) => test.step('Open module subscription dropdown', async () => {
      return openModuleDropdown(page);
    }),
    expectModuleOptions: async (page, moduleNames) => test.step(
      `Verify available modules ${moduleNames.join(', ')}`,
      async () => expectModuleOptions(page, moduleNames)
    ),
    selectModules: async (page, moduleNames) => test.step(
      `Select modules ${moduleNames.join(', ')}`,
      async () => selectModules(page, moduleNames)
    ),
    expectModuleSelected: async (page, moduleName) => test.step(
      `Verify module ${moduleName} is selected`,
      async () => expectModuleSelected(page, moduleName)
    ),
    expectSelfFundingControls: async (page, moduleName, expectedStatus) => test.step(
      `Verify self-funding controls for ${moduleName}`,
      async () => expectSelfFundingControls(page, moduleName, expectedStatus)
    ),
    toggleSelfFunding: async (page, moduleName) => test.step(
      `Select self-funding Yes for ${moduleName}`,
      async () => toggleSelfFunding(page, moduleName)
    ),
    expectRoleBadge: async (page, roleName) => test.step(
      `Verify role ${roleName}`,
      async () => expectRoleBadge(page, roleName)
    ),
    expectCreateCustomerButtonVisible: async (page) => test.step('Verify Create Customer button is visible', async () => {
      return expectCreateCustomerButtonVisible(page);
    }),
    submitCustomer: async (page) => test.step('Submit Create Customer form', async () => {
      return submitCustomer(page);
    }),
    buildUniqueCustomerName,
    selectors: customerManagementAdminNewSelectors
  }
};
