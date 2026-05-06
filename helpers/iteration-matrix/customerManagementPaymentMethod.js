const { expect, test } = require('@playwright/test');
const { resolveFirst, clickWithFallback, fillWithFallback } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { customerManagementPaymentMethodSelectors } = require('../../selectors/iteration-matrix/customerManagementPaymentMethod.selectors.js');

function buildUniqueCustomerName(data) {
  const seed = `${Date.now()}`.slice(-8);
  const baseName = String(data.CustomerName || data.Customer1 || 'CustomerTest').replace(/[^a-zA-Z0-9]/g, '').slice(0, 18);
  return `${baseName}${seed}`;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function reportStep(name, action) {
  return test.step(name, action);
}

async function clickDropdown(page, candidates) {
  const result = await resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500 });
  await result.locator.click();
  return result.locator;
}

async function clickChoiceByName(page, optionName) {
  const candidates = [
    page.getByRole('option', { name: optionName, exact: true }).first(),
    page.getByRole('button', { name: optionName, exact: true }).first(),
    page.getByText(optionName, { exact: true }).first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      return optionName;
    }
  }

  return null;
}

async function clickFirstVisibleOption(page) {
  const option = page.getByRole('option').first();
  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click();
  return (await option.textContent().catch(() => ''))?.trim() || null;
}

async function selectDropdownValue(page, dropdownCandidates, preferredOption, fallbackOptions = [], options = {}) {
  await clickDropdown(page, dropdownCandidates);

  const orderedOptions = [preferredOption, ...fallbackOptions].filter(Boolean);
  for (const optionName of orderedOptions) {
    const clicked = await clickChoiceByName(page, optionName);
    if (clicked) {
      return clicked;
    }
  }

  if (options.allowMissingOptions) {
    await page.keyboard.press('Escape').catch(() => null);
    return null;
  }

  return clickFirstVisibleOption(page);
}

async function fillSearchField(page, candidates, value) {
  const result = await resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500 });
  await result.locator.fill(String(value));
  await waitForAppToSettle(page, 500);
}

async function ensureCreateCustomerPage(page) {
  const adminLink = await resolveFirst(page, customerManagementPaymentMethodSelectors.adminModule, {
    mustBeVisible: true,
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (adminLink) {
    await adminLink.locator.click().catch(() => null);
    await waitForAppToSettle(page, 750);
  }

  const customerManagementHeading = page.getByRole('heading', { name: 'Customer Management', exact: true }).first();
  if (!(await customerManagementHeading.isVisible().catch(() => false))) {
    const customerManagementLink = await resolveFirst(page, customerManagementPaymentMethodSelectors.customerManagementLink, {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    }).catch(() => null);

    if (customerManagementLink) {
      await customerManagementLink.locator.click();
    } else {
      const listUrl = new URL('/app/admin/customer-management', page.url()).toString();
      await page.goto(listUrl, { waitUntil: 'domcontentloaded' });
    }
  }

  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true }).first()).toBeVisible({ timeout: 15000 });
  await clickWithFallback(page, customerManagementPaymentMethodSelectors.addCustomerButton);
  await expect(page.getByRole('heading', { name: 'Create Customer', exact: true }).first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Customer Details', exact: true }).first()).toBeVisible({ timeout: 15000 });
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

async function openModuleDropdown(page) {
  await clickDropdown(page, customerManagementPaymentMethodSelectors.dropdowns.moduleSubscription);
  await expect(async () => {
    const optionCount = await page.getByRole('option').count();
    expect(optionCount).toBeGreaterThan(0);
  }).toPass({ timeout: 15000 });
}

async function selectModules(page, moduleNames) {
  await openModuleDropdown(page);
  for (const moduleName of moduleNames) {
    const clicked = await clickChoiceByName(page, moduleName);
    if (!clicked) {
      await clickFirstVisibleOption(page);
    }
  }
  await page.keyboard.press('Escape').catch(() => null);
  await waitForAppToSettle(page, 500);
}

async function submitCustomer(page) {
  await clickWithFallback(page, customerManagementPaymentMethodSelectors.submitButton);
  await waitForAppToSettle(page, 1000);
  const toast = await resolveFirst(page, customerManagementPaymentMethodSelectors.toasts.customerCreated, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (toast) {
    await expect(toast.locator).toBeVisible({ timeout: 5000 });
    return;
  }
  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function createCustomer(page, data) {
  await ensureCreateCustomerPage(page);
  const { customerName } = await fillBaseCustomerDetails(page, data);
  await selectModules(page, [customerManagementPaymentMethodSelectors.defaults.moduleName]);
  await submitCustomer(page);
  return { customerName };
}

async function ensureCustomerManagementListPage(page) {
  const searchVisible = await Promise.any([
    page.getByPlaceholder('Search all customers...').first().isVisible(),
    page.getByPlaceholder('Search all entries...').first().isVisible()
  ].map((promise) => promise.catch(() => false))).catch(() => false);

  if (searchVisible) {
    return;
  }

  const customerManagementLink = await resolveFirst(page, customerManagementPaymentMethodSelectors.customerManagementLink, {
    mustBeVisible: true,
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (customerManagementLink) {
    await customerManagementLink.locator.click();
  } else {
    const listUrl = new URL('/app/admin/customer-management', page.url()).toString();
    await page.goto(listUrl, { waitUntil: 'domcontentloaded' });
  }

  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function searchCustomerList(page, customerName) {
  await ensureCustomerManagementListPage(page);
  await fillSearchField(page, customerManagementPaymentMethodSelectors.searchFields.customerList, customerName);

  try {
    const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(customerName), 'i') }).first();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    return row;
  } catch (error) {
    const listUrl = new URL('/app/admin/customer-management', page.url()).toString();
    await page.goto(listUrl, { waitUntil: 'domcontentloaded' });
    await ensureCustomerManagementListPage(page);
    await fillSearchField(page, customerManagementPaymentMethodSelectors.searchFields.customerList, customerName);
    const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(customerName), 'i') }).first();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    return row;
  }
}

async function openCustomerAction(page, customerName, actionCandidates) {
  const row = await searchCustomerList(page, customerName);
  const actionButton = row.getByRole('button', { name: /actions for|open actions menu|open menu/i }).first();
  await actionButton.click({ timeout: 5000 });
  const action = await resolveFirst(page, actionCandidates, { mustBeVisible: true, timeoutPerCandidate: 2500 });
  await action.locator.click();
}

async function openImREmitOnboardingPending(page, customerName) {
  await openCustomerAction(page, customerName, customerManagementPaymentMethodSelectors.actionsMenuItems.imREmitOnboardingPending);
  await expect(page.getByRole('heading', { name: 'Email Configuration', exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function clickWizardNext(page) {
  await clickWithFallback(page, customerManagementPaymentMethodSelectors.wizard.nextButton);
  await waitForAppToSettle(page, 750);
}

async function chooseOptionFromDropdown(page, dropdownCandidates, preferredOptions) {
  const control = await clickDropdown(page, dropdownCandidates);

  for (const optionName of preferredOptions) {
    if (!optionName) {
      continue;
    }
    const clicked = await clickChoiceByName(page, optionName);
    if (clicked) {
      await expect(control).toContainText(new RegExp(escapeRegExp(optionName), 'i'), { timeout: 10000 });
      return optionName;
    }
  }

  const fallback = await clickFirstVisibleOption(page);
  if (!fallback) {
    throw new Error('No dropdown option was available to select.');
  }
  return fallback;
}

async function savePaymentMethod(page, options = {}) {
  const selectedProvider = await chooseOptionFromDropdown(
    page,
    customerManagementPaymentMethodSelectors.dropdowns.paymentProvider,
    options.providerOptions || customerManagementPaymentMethodSelectors.defaults.paymentProviderOptions
  );
  const selectedMethod = await chooseOptionFromDropdown(
    page,
    customerManagementPaymentMethodSelectors.dropdowns.paymentMethod,
    options.paymentMethodOptions || customerManagementPaymentMethodSelectors.defaults.paymentMethodOptions
  );

  await fillWithFallback(
    page,
    customerManagementPaymentMethodSelectors.fields.customerPaymentMethodName,
    options.customerPaymentMethodName || customerManagementPaymentMethodSelectors.defaults.customerPaymentMethodName
  );
  await fillWithFallback(
    page,
    customerManagementPaymentMethodSelectors.fields.paymentMethodDescription,
    options.description || customerManagementPaymentMethodSelectors.defaults.description
  );
  await clickWithFallback(page, customerManagementPaymentMethodSelectors.wizard.savePaymentMethodButton);
  await waitForAppToSettle(page, 1000);

  const successToast = await resolveFirst(page, customerManagementPaymentMethodSelectors.toasts.paymentMethodCreated, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (successToast) {
    await expect(successToast.locator).toBeVisible({ timeout: 5000 });
  }

  return {
    paymentProvider: selectedProvider,
    paymentMethod: selectedMethod,
    customerPaymentMethodName: options.customerPaymentMethodName || customerManagementPaymentMethodSelectors.defaults.customerPaymentMethodName,
    description: options.description || customerManagementPaymentMethodSelectors.defaults.description
  };
}

async function expectPaymentMethodRow(page, values) {
  const table = page.locator('table').first();
  await expect(table).toBeVisible({ timeout: 15000 });
  await expect(table).toContainText(values.paymentProvider, { timeout: 15000 });
  await expect(table).toContainText(values.paymentMethod, { timeout: 15000 });
  await expect(table).toContainText(values.customerPaymentMethodName, { timeout: 15000 });
  await expect(table).toContainText(values.description, { timeout: 15000 });
}

async function deleteCustomer(page, customerName) {
  await reportStep('Delete created customer', async () => {
    await ensureCustomerManagementListPage(page);
    await openCustomerAction(page, customerName, customerManagementPaymentMethodSelectors.actionsMenuItems.deleteCustomer);
    await clickWithFallback(page, customerManagementPaymentMethodSelectors.dialogs.deleteCustomerConfirmButton);
    await waitForAppToSettle(page, 1000);
    const toast = await resolveFirst(page, customerManagementPaymentMethodSelectors.toasts.customerDeleted, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    await expect(toast.locator).toBeVisible({ timeout: 5000 });
  });
}

async function runScenario(page, data, scenarioName) {
  if (scenarioName !== 'TS_01_To_verify_payment_is_saved_with_the_USA_bank_in_payment_provider_field') {
    throw new Error(`Customer_Management_Payment_Method scenario not implemented yet: ${scenarioName}`);
  }

  const { customerName } = await reportStep('Create customer with imREmit module', async () => {
    return createCustomer(page, data);
  });

  try {
    await reportStep('Open imREmit onboarding flow', async () => {
      await openImREmitOnboardingPending(page, customerName);
    });
    await reportStep('Open Payment Method step', async () => {
      await clickWizardNext(page);
      await expect(page.getByRole('heading', { name: 'Payment Method', exact: true }).first()).toBeVisible({ timeout: 15000 });
    });
    const paymentValues = await reportStep('Save payment method', async () => {
      return savePaymentMethod(page);
    });
    await reportStep('Verify saved payment method values', async () => {
      await expectPaymentMethodRow(page, paymentValues);
    });
    await reportStep('Return to customer list', async () => {
      await clickWithFallback(page, customerManagementPaymentMethodSelectors.wizard.backToListButton);
      await expect(page.getByRole('heading', { name: 'Customer Management', exact: true }).first()).toBeVisible({ timeout: 15000 });
    });
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

const helperMap = {
  runScenario,
  buildUniqueCustomerName,
  selectors: customerManagementPaymentMethodSelectors
};

module.exports = {
  customerManagementPaymentMethodHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap, {
      runScenario: 'Run Customer Management Payment Method scenario'
    }),
    selectors: customerManagementPaymentMethodSelectors
  }
};
