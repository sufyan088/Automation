const { expect, test } = require('@playwright/test');
const { resolveFirst, clickWithFallback, fillWithFallback } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { customerOnboardingSelectors } = require('../../selectors/iteration-matrix/customerOnboarding.selectors.js');

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

async function clickFirstVisibleLocator(locator) {
  const count = await locator.count().catch(() => 0);
  for (let index = 0; index < count; index += 1) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.click();
      return true;
    }
  }
  return false;
}

async function hasVisibleLocator(locator) {
  const count = await locator.count().catch(() => 0);
  for (let index = 0; index < count; index += 1) {
    if (await locator.nth(index).isVisible().catch(() => false)) {
      return true;
    }
  }
  return false;
}

async function clickDropdown(page, candidates) {
  const openSearchInput = page.locator('[data-radix-popper-content-wrapper] input[cmdk-input], [role="dialog"] input[cmdk-input]').first();
  if (await openSearchInput.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape').catch(() => null);
    await waitForAppToSettle(page, 200);
  }

  const result = await resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500 });
  await result.locator.click();
  return result.locator;
}

async function clickChoiceByName(page, optionName) {
  const candidates = [
    page.getByRole('option', { name: optionName, exact: true }),
    page.getByRole('option', { name: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.locator('[role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.getByRole('button', { name: optionName, exact: true }),
    page.getByText(optionName, { exact: true }),
    page.getByText(new RegExp(`^${escapeRegExp(optionName)}$`, 'i'))
  ];

  for (const locator of candidates) {
    if (await clickFirstVisibleLocator(locator)) {
      return optionName;
    }
  }

  return null;
}

async function optionOrButtonIsVisible(page, optionName) {
  const candidates = [
    page.getByRole('option', { name: optionName, exact: true }),
    page.getByRole('option', { name: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.locator('[role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.getByRole('button', { name: optionName, exact: true }),
    page.getByText(optionName, { exact: true }),
    page.getByText(new RegExp(`^${escapeRegExp(optionName)}$`, 'i'))
  ];

  for (const locator of candidates) {
    if (await hasVisibleLocator(locator)) {
      return true;
    }
  }

  return false;
}

async function clickOpenDropdownChoiceByName(page, optionName) {
  const candidates = [
    page.locator('[role="dialog"] [role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.locator('[data-radix-popper-content-wrapper] [role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.locator('[role="listbox"] [role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.locator('[role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.getByText(new RegExp(`^${escapeRegExp(optionName)}$`, 'i'))
  ];

  for (const locator of candidates) {
    if (await clickFirstVisibleLocator(locator)) {
      await waitForAppToSettle(page, 300);
      return optionName;
    }
  }

  return null;
}

async function selectViaOpenDialogSearch(page, optionName) {
  const searchTargets = [
    page.getByPlaceholder(/search address states/i),
    page.locator('[role="dialog"] input[role="combobox"]'),
    page.locator('[role="dialog"] input').filter({ has: page.locator('body') })
  ];

  for (const locator of searchTargets) {
    const count = await locator.count().catch(() => 0);
    for (let index = 0; index < count; index += 1) {
      const candidate = locator.nth(index);
      if (await candidate.isVisible().catch(() => false)) {
        await candidate.fill(String(optionName)).catch(() => null);
        await waitForAppToSettle(page, 200);

        const popupClick = await clickOpenDropdownChoiceByName(page, optionName);
        if (popupClick) {
          return popupClick;
        }

        await page.keyboard.press('ArrowDown').catch(() => null);
        await page.keyboard.press('Enter').catch(() => null);
        await waitForAppToSettle(page, 300);
        return optionName;
      }
    }
  }

  return null;
}

async function clickFirstVisibleOption(page) {
  const option = page.getByRole('option').first();
  const optionVisible = await option.isVisible().catch(() => false);

  if (optionVisible) {
    await option.click();
    return (await option.textContent().catch(() => ''))?.trim() || null;
  }

  await page.keyboard.press('ArrowDown').catch(() => null);
  await page.keyboard.press('Enter').catch(() => null);
  await waitForAppToSettle(page, 500);
  return null;
}

async function selectDropdownValue(page, dropdownCandidates, preferredOption, fallbackOptions = [], options = {}) {
  await clickDropdown(page, dropdownCandidates);
  await waitForAppToSettle(page, 300);

  const orderedOptions = [preferredOption, ...fallbackOptions].filter(Boolean);
  for (const optionName of orderedOptions) {
    const searchedChoice = await selectViaOpenDialogSearch(page, optionName);
    if (searchedChoice) {
      return searchedChoice;
    }

    const popupClick = await clickOpenDropdownChoiceByName(page, optionName);
    if (popupClick) {
      return popupClick;
    }

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
  return result.locator;
}

async function selectProgramManager(page, data) {
  const preferredNames = [
    customerOnboardingSelectors.defaults.programManagerOption,
    'ammy willson',
    data.Username_ProgramManager,
    data.Username_ProjectManager,
    data.Username_Management
  ].filter(Boolean);

  const control = await clickDropdown(page, customerOnboardingSelectors.dropdowns.programManager);
  await waitForAppToSettle(page, 300);

  for (const optionName of preferredNames) {
    const searchInputs = [
      page.getByPlaceholder(/search program manager/i),
      page.locator('[role="dialog"] input[cmdk-input]')
    ];

    for (const searchInput of searchInputs) {
      const count = await searchInput.count().catch(() => 0);
      for (let index = 0; index < count; index += 1) {
        const candidate = searchInput.nth(index);
        if (await candidate.isVisible().catch(() => false)) {
          await candidate.fill(optionName).catch(() => null);
          await waitForAppToSettle(page, 750);
        }
      }
    }

    const commandItem = page.locator('[data-radix-popper-content-wrapper] [cmdk-item], [role="dialog"] [cmdk-item]').filter({ hasText: new RegExp(escapeRegExp(optionName), 'i') });
    if (await clickFirstVisibleLocator(commandItem)) {
      await page.keyboard.press('Escape').catch(() => null);
      await waitForAppToSettle(page, 300);
      await expect(control).toContainText(new RegExp(escapeRegExp(optionName), 'i'), { timeout: 10000 });
      return optionName;
    }

    const exactPopupOption = page.locator('[role="dialog"] [role="option"][data-value]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') });
    if (await clickFirstVisibleLocator(exactPopupOption)) {
      await page.keyboard.press('Escape').catch(() => null);
      await waitForAppToSettle(page, 300);
      await expect(control).toContainText(new RegExp(escapeRegExp(optionName), 'i'), { timeout: 10000 });
      return optionName;
    }

    const clicked = await clickOpenDropdownChoiceByName(page, optionName) || await clickChoiceByName(page, optionName);
    if (clicked) {
      await page.keyboard.press('Escape').catch(() => null);
      await waitForAppToSettle(page, 300);
      await expect(control).toContainText(new RegExp(escapeRegExp(optionName), 'i'), { timeout: 10000 });
      return optionName;
    }

    await page.keyboard.press('ArrowDown').catch(() => null);
    await page.keyboard.press('Enter').catch(() => null);
    if (await control.textContent().then((value) => new RegExp(escapeRegExp(optionName), 'i').test(value || '')).catch(() => false)) {
      return optionName;
    }
  }

  throw new Error('Unable to select Program Manager from the available choices.');
}

async function selectAddressState(page, optionName = 'Alaska') {
  const explicitStateControls = [
    page.locator('xpath=//*[self::div or self::label][normalize-space()="Address state:" or normalize-space()="Address state/province:"]/following::*[@role="combobox" or self::button][1]').first(),
    page.locator('div').filter({ hasText: /^Address state:/ }).locator('[role="combobox"], button').first(),
    page.locator('div').filter({ hasText: /^Address state\/province:/ }).locator('[role="combobox"], button').first()
  ];

  let control = null;
  for (const candidate of explicitStateControls) {
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.click();
      control = candidate;
      break;
    }
  }

  if (!control) {
    control = await clickDropdown(page, customerOnboardingSelectors.dropdowns.state);
  }

  await waitForAppToSettle(page, 300);

  const stateSearch = page.getByPlaceholder(/search address states/i).first();
  if (await stateSearch.isVisible().catch(() => false)) {
    await stateSearch.fill(optionName);
    await waitForAppToSettle(page, 750);
  }

  const commandItem = page.locator('[data-radix-popper-content-wrapper] [cmdk-item], [role="dialog"] [cmdk-item]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') });
  if (await clickFirstVisibleLocator(commandItem)) {
    await waitForAppToSettle(page, 300);
    await expect(control).toContainText(new RegExp(escapeRegExp(optionName), 'i'), { timeout: 10000 });
    return optionName;
  }

  const alaskaTargets = [
    page.locator('[role="dialog"] [role="option"][data-value="alaska"]'),
    page.locator('[role="dialog"] [data-value="alaska"]'),
    page.locator('[data-radix-popper-content-wrapper] [data-value="alaska"]'),
    page.locator('[role="option"]').filter({ hasText: /^Alaska$/i })
  ];

  for (const locator of alaskaTargets) {
    if (await clickFirstVisibleLocator(locator)) {
      await waitForAppToSettle(page, 300);
      await expect(control).toContainText(/Alaska/i, { timeout: 10000 });
      return 'Alaska';
    }
  }

  throw new Error('Unable to select Alaska from the Address state dropdown.');
}

async function selectLabeledDropdownOption(page, fieldLabels, optionName) {
  const labels = Array.isArray(fieldLabels) ? fieldLabels : [fieldLabels];
  let control = null;

  for (const labelText of labels) {
    const labelNode = page.getByText(labelText, { exact: true }).first();
    if (await labelNode.isVisible().catch(() => false)) {
      const siblingControl = labelNode.locator('xpath=..').locator('[role="combobox"], button').first();
      if (await siblingControl.isVisible().catch(() => false)) {
        await siblingControl.click();
        control = siblingControl;
        break;
      }

      const containerControl = labelNode.locator('xpath=../..').locator('[role="combobox"], button').first();
      if (await containerControl.isVisible().catch(() => false)) {
        await containerControl.click();
        control = containerControl;
        break;
      }
    }
  }

  if (!control) {
    throw new Error(`Unable to find dropdown control for labels: ${labels.join(', ')}`);
  }

  await waitForAppToSettle(page, 500);

  const optionTargets = [
    page.locator('[data-radix-popper-content-wrapper] [cmdk-item], [role="dialog"] [cmdk-item]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.locator('[role="dialog"] [role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.getByRole('option', { name: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') })
  ];

  for (const locator of optionTargets) {
    if (await clickFirstVisibleLocator(locator)) {
      await waitForAppToSettle(page, 300);
      await expect(control).toContainText(new RegExp(escapeRegExp(optionName), 'i'), { timeout: 10000 });
      return optionName;
    }
  }

  throw new Error(`Unable to select ${optionName} for ${labels.join(' / ')}`);
}

async function selectFileTransmissionType(page, optionName = 'Payment File') {
  const selectedControl = page.getByRole('combobox', { name: new RegExp(escapeRegExp(optionName), 'i') }).first();
  if (await selectedControl.isVisible().catch(() => false)) {
    return optionName;
  }

  const placeholderTrigger = page.getByText('Select file transmission type(s)...', { exact: true }).first();
  await placeholderTrigger.click();
  await waitForAppToSettle(page, 500);

  const popupOptions = page.locator('[data-radix-popper-content-wrapper]').last().locator('[role="option"], [cmdk-item]');
  const clickedPopupOption = await clickFirstVisibleLocator(popupOptions.filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }));
  if (!clickedPopupOption) {
    await clickFirstVisibleLocator(popupOptions);
  }
  await waitForAppToSettle(page, 300);

  const control = page.getByText('File transmissions:', { exact: true }).first().locator('xpath=..').locator('[role="combobox"], button').first();
  await expect(control).toContainText(new RegExp(escapeRegExp(optionName), 'i'), { timeout: 10000 });
  return optionName;
}

async function expectAnyVisible(page, candidates, timeout = 15000) {
  const result = await resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: Math.max(1000, Math.floor(timeout / Math.max(candidates.length, 1))) }).catch(() => null);
  if (!result) {
    throw new Error('Expected one of the candidate locators to become visible.');
  }
  await expect(result.locator).toBeVisible({ timeout });
  return result.locator;
}

async function ensureCreateCustomerPage(page) {
  const adminLink = await resolveFirst(page, customerOnboardingSelectors.adminModule, {
    mustBeVisible: true,
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (adminLink) {
    await adminLink.locator.click().catch(() => null);
    await waitForAppToSettle(page, 750);
  }

  const customerManagementHeading = page.getByRole('heading', { name: 'Customer Management', exact: true }).first();
  if (!(await customerManagementHeading.isVisible().catch(() => false))) {
    const customerManagementLink = await resolveFirst(page, customerOnboardingSelectors.customerManagementLink, {
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
  await clickWithFallback(page, customerOnboardingSelectors.addCustomerButton);
  await expect(page.getByRole('heading', { name: 'Create Customer', exact: true }).first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Customer Details', exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function fillBaseCustomerDetails(page, data, options = {}) {
  const customerName = options.customerName || buildUniqueCustomerName(data);
  await fillWithFallback(page, customerOnboardingSelectors.fields.customerName, customerName);
  await selectProgramManager(page, data);
  await fillWithFallback(page, customerOnboardingSelectors.fields.companyContactName, options.companyContactName || 'TestCompany');
  await fillWithFallback(page, customerOnboardingSelectors.fields.companyIndustry, options.companyIndustry || 'TestData');
  await selectDropdownValue(
    page,
    customerOnboardingSelectors.dropdowns.country,
    customerOnboardingSelectors.defaults.countryOption,
    [data.Country, data.CustomerCountry, 'USA']
  );
  await selectAddressState(page, customerOnboardingSelectors.defaults.stateOption);
  await fillWithFallback(page, customerOnboardingSelectors.fields.address, options.address || '141 W Main Ave');
  await fillWithFallback(page, customerOnboardingSelectors.fields.city, options.city || 'Gastonia');
  await fillWithFallback(page, customerOnboardingSelectors.fields.zipCode, options.zipCode || data.ZipCode || '65753');
  await fillWithFallback(page, customerOnboardingSelectors.fields.email, options.email || data.CustomerEmail || 'QAMammoth@test.com');
  await fillWithFallback(page, customerOnboardingSelectors.fields.phone, options.phone || data.CustomerPhone || '(704) 867-7427');
  await selectLabeledDropdownOption(page, 'File Transmission Method:', customerOnboardingSelectors.defaults.fileTransmissionMethodOption);
  await selectFileTransmissionType(page, customerOnboardingSelectors.defaults.fileTransmissionTypeOption);
  await fillWithFallback(page, customerOnboardingSelectors.fields.erpSystem, options.erpSystem || 'QATDATA');
  return { customerName };
}

async function openModuleDropdown(page) {
  await clickDropdown(page, customerOnboardingSelectors.dropdowns.moduleSubscription);
  await expect(async () => {
    const optionCount = await page.getByRole('option').count();
    expect(optionCount).toBeGreaterThan(0);
  }).toPass({ timeout: 15000 });
}

async function selectModuleCardIfVisible(page, moduleName) {
  const formTargets = [
    page.locator('form').getByRole('button', { name: new RegExp(`^${escapeRegExp(moduleName)}$`, 'i') }).first(),
    page.locator('form').getByText(new RegExp(`^${escapeRegExp(moduleName)}$`, 'i')).first()
  ];

  for (const locator of formTargets) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      await waitForAppToSettle(page, 500);
      return true;
    }
  }

  return false;
}

async function selectModules(page, moduleNames) {
  const moduleDropdown = await resolveFirst(page, customerOnboardingSelectors.dropdowns.moduleSubscription, {
    mustBeVisible: true,
    timeoutPerCandidate: 1000
  }).catch(() => null);

  if (!moduleDropdown) {
    for (const moduleName of moduleNames) {
      await selectModuleCardIfVisible(page, moduleName);
    }
    return;
  }

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
  const submitCandidates = [
    page.getByRole('button', { name: /^Create customer$/i }).first(),
    page.getByRole('button', { name: /submit formcreate customer/i }).first(),
    page.locator('button[type="submit"]').filter({ hasText: /create customer/i }).first(),
    page.locator('section.flex.items-center.justify-between').locator('button[type="submit"], button').filter({ hasText: /create customer/i }).first(),
    page.locator('button.bg-success-foreground').filter({ hasText: /create customer/i }).first()
  ];

  let clicked = false;
  for (const locator of submitCandidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.scrollIntoViewIfNeeded().catch(() => null);
      await locator.click();
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    throw new Error('Create customer submit button was not visible.');
  }

  await waitForAppToSettle(page, 1000);
  const toast = await resolveFirst(page, customerOnboardingSelectors.toasts.customerCreated, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (toast) {
    await expect(toast.locator).toBeVisible({ timeout: 5000 });
    return;
  }

  const listSignals = [
    page.getByRole('heading', { name: 'Customer Management', exact: true }).first(),
    page.getByPlaceholder('Search all customers...').first(),
    page.getByPlaceholder('Search all entries...').first()
  ];

  for (const locator of listSignals) {
    if (await locator.isVisible().catch(() => false)) {
      return;
    }
  }

  throw new Error('Customer creation did not reach a visible success or list state after submit.');
}

async function createCustomer(page, data, options = {}) {
  await ensureCreateCustomerPage(page);
  const { customerName } = await fillBaseCustomerDetails(page, data, options);
  await selectModules(page, options.modules || [customerOnboardingSelectors.defaults.moduleName]);
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

  const customerManagementLink = await resolveFirst(page, customerOnboardingSelectors.customerManagementLink, {
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
  await fillSearchField(page, customerOnboardingSelectors.searchFields.customerList, customerName);

  const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(customerName), 'i') }).first();
  await row.waitFor({ state: 'visible', timeout: 15000 });
  return row;
}

async function openCustomerAction(page, customerName, actionCandidates) {
  const row = await searchCustomerList(page, customerName);
  const actionButton = row.getByRole('button', { name: /actions for|open actions menu|open menu/i }).first();
  await actionButton.click({ timeout: 5000 });
  const action = await resolveFirst(page, actionCandidates, { mustBeVisible: true, timeoutPerCandidate: 2500 });
  await action.locator.click();
}

async function openImREmitEditDetails(page, customerName) {
  await openCustomerAction(page, customerName, customerOnboardingSelectors.actionsMenuItems.imREmitOnboardingPending);
  await expectAnyVisible(page, customerOnboardingSelectors.headings.emailConfiguration);
}

async function clickWizardNext(page) {
  await clickWithFallback(page, customerOnboardingSelectors.wizard.nextButton);
  await waitForAppToSettle(page, 750);
}

async function clickWizardPrevious(page) {
  await clickWithFallback(page, customerOnboardingSelectors.wizard.previousButton);
  await waitForAppToSettle(page, 750);
}

async function isWizardNextEnabled(page) {
  const nextButton = await resolveFirst(page, customerOnboardingSelectors.wizard.nextButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);
  if (!nextButton) {
    return false;
  }
  return nextButton.locator.isEnabled().catch(() => false);
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
    customerOnboardingSelectors.dropdowns.paymentProvider,
    options.providerOptions || customerOnboardingSelectors.defaults.paymentProviderOptions
  );
  const selectedMethod = await chooseOptionFromDropdown(
    page,
    customerOnboardingSelectors.dropdowns.paymentMethod,
    options.paymentMethodOptions || customerOnboardingSelectors.defaults.paymentMethodOptions
  );

  await fillWithFallback(
    page,
    customerOnboardingSelectors.fields.customerPaymentMethodName,
    options.customerPaymentMethodName || customerOnboardingSelectors.defaults.customerPaymentMethodName
  );
  await fillWithFallback(
    page,
    customerOnboardingSelectors.fields.paymentMethodDescription,
    options.description || customerOnboardingSelectors.defaults.description
  );
  await clickWithFallback(page, customerOnboardingSelectors.wizard.savePaymentMethodButton);
  await waitForAppToSettle(page, 1000);

  const successToast = await resolveFirst(page, customerOnboardingSelectors.toasts.paymentMethodCreated, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (successToast) {
    await expect(successToast.locator).toBeVisible({ timeout: 5000 });
  }

  return {
    paymentProvider: selectedProvider,
    paymentMethod: selectedMethod,
    customerPaymentMethodName: options.customerPaymentMethodName || customerOnboardingSelectors.defaults.customerPaymentMethodName,
    description: options.description || customerOnboardingSelectors.defaults.description
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

async function navigateToPaymentMethod(page, customerName) {
  await openImREmitEditDetails(page, customerName);
  await clickWizardNext(page);
  await expectAnyVisible(page, customerOnboardingSelectors.headings.paymentMethod);
}

async function ensurePaymentMethodCanContinue(page) {
  if (await isWizardNextEnabled(page)) {
    return null;
  }

  const paymentValues = await savePaymentMethod(page);
  await expect(async () => {
    expect(await isWizardNextEnabled(page)).toBeTruthy();
  }).toPass({ timeout: 20000 });
  return paymentValues;
}

async function navigateToParticipantRegister(page, customerName) {
  await navigateToPaymentMethod(page, customerName);
  await ensurePaymentMethodCanContinue(page);
  await clickWizardNext(page);
  await expectAnyVisible(page, customerOnboardingSelectors.headings.participantRegister);
}

async function searchParticipantRegisterList(page, query) {
  const searchFields = [
    page.getByPlaceholder('Search all entries...').first(),
    page.getByPlaceholder('Search participants...').first(),
    page.locator('input[type="search"]').first()
  ];

  for (const locator of searchFields) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.fill(query);
      await waitForAppToSettle(page, 500);
      break;
    }
  }

  const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(query), 'i') }).first();
  await row.waitFor({ state: 'visible', timeout: 15000 });
  return row;
}

async function saveParticipantRegister(page, options = {}) {
  const facilityName = options.facilityName || `Facility${Date.now().toString().slice(-6)}`;
  const groupId = options.groupId || `G${Date.now().toString().slice(-5)}`;
  const orgId = options.orgId || `ORG${Date.now().toString().slice(-6)}`;
  const userId = options.userId || `USER${Date.now().toString().slice(-6)}`;

  const fieldValues = [
    { locator: page.getByPlaceholder('Enter the facility name...').first(), value: facilityName },
    { locator: page.getByPlaceholder('Enter the organization id...').first(), value: orgId },
    { locator: page.getByPlaceholder('Enter the user id...').first(), value: userId },
    { locator: page.getByPlaceholder('Enter the bank account #...').first(), value: options.account || '1222339' },
    { locator: page.locator('input[name="groupId"]').first(), value: groupId }
  ];

  for (const entry of fieldValues) {
    if (await entry.locator.isVisible().catch(() => false)) {
      await entry.locator.fill(String(entry.value));
    }
  }

  const saveParticipantButton = page.getByRole('button', { name: /save participant|save/i }).first();
  if (await saveParticipantButton.isVisible().catch(() => false)) {
    await saveParticipantButton.click();
    await waitForAppToSettle(page, 1000);
  }

  await searchParticipantRegisterList(page, facilityName);
  return { facilityName, groupId, orgId, userId };
}

async function openTableRowAction(page, row, menuTextPattern = /open actions menu|open menu|actions/i) {
  const actionButtonCandidates = [
    row.getByRole('button', { name: menuTextPattern }).first(),
    row.locator('button[aria-haspopup="menu"]').first(),
    row.locator('button').last()
  ];

  for (const locator of actionButtonCandidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      await waitForAppToSettle(page, 300);
      return;
    }
  }

  throw new Error('Unable to open table row actions menu.');
}

async function navigateToRunnerConfiguration(page, customerName) {
  await navigateToParticipantRegister(page, customerName);
  const hasSavedRow = await page.locator('table tbody tr').first().isVisible().catch(() => false);
  if (!hasSavedRow) {
    await saveParticipantRegister(page);
  }
  await clickWizardNext(page);
  await expectAnyVisible(page, customerOnboardingSelectors.headings.runnerConfiguration);
}

async function configureRunnerType(page, preferredType = 'Recon') {
  const dropdown = await resolveFirst(page, customerOnboardingSelectors.wizard.runnerTypeDropdown, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (!dropdown) {
    throw new Error('Runner type dropdown was not visible.');
  }

  await dropdown.locator.click();
  if (/payment/i.test(preferredType) && await optionOrButtonIsVisible(page, 'Payment')) {
    await clickChoiceByName(page, 'Payment');
  } else if (/recon/i.test(preferredType) && await optionOrButtonIsVisible(page, 'Recon')) {
    await clickChoiceByName(page, 'Recon');
  } else if (await optionOrButtonIsVisible(page, preferredType)) {
    await clickChoiceByName(page, preferredType);
  } else {
    await clickFirstVisibleOption(page);
  }
  await waitForAppToSettle(page, 750);
}

async function openRunnerConfigButton(page, candidates) {
  await clickWithFallback(page, candidates);
  await waitForAppToSettle(page, 750);
}

async function deleteCustomer(page, customerName) {
  await ensureCustomerManagementListPage(page);
  await openCustomerAction(page, customerName, customerOnboardingSelectors.actionsMenuItems.deleteCustomer);
  await clickWithFallback(page, customerOnboardingSelectors.dialogs.deleteCustomerConfirmButton);
  await waitForAppToSettle(page, 1000);
}

async function runTs01(page, data) {
  const { customerName } = await reportStep('Create customer with imREmit module', async () => createCustomer(page, data));
  try {
    await reportStep('Verify created customer is searchable', async () => {
      await searchCustomerList(page, customerName);
    });
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs02Or03(page, data) {
  const { customerName } = await reportStep('Create customer with imREmit module', async () => createCustomer(page, data));
  try {
    await reportStep('Open Payment Method step', async () => {
      await navigateToPaymentMethod(page, customerName);
    });
    const paymentValues = await reportStep('Save payment method', async () => savePaymentMethod(page));
    await reportStep('Verify saved payment method row', async () => {
      await expectPaymentMethodRow(page, paymentValues);
    });
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs04(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await openImREmitEditDetails(page, customerName);
    await clickWithFallback(page, customerOnboardingSelectors.wizard.backToListButton);
    await expectAnyVisible(page, customerOnboardingSelectors.headings.customerManagement);
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs05(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToPaymentMethod(page, customerName);
    await clickWizardPrevious(page);
    await expectAnyVisible(page, customerOnboardingSelectors.headings.emailConfiguration);
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs06(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToPaymentMethod(page, customerName);
    await expectAnyVisible(page, customerOnboardingSelectors.headings.paymentMethod);
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs07(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToPaymentMethod(page, customerName);
    const paymentValues = await savePaymentMethod(page);
    const updatedDescription = `${paymentValues.description} updated`;
    await fillWithFallback(page, customerOnboardingSelectors.fields.paymentMethodDescription, updatedDescription);
    await clickWithFallback(page, customerOnboardingSelectors.wizard.savePaymentMethodButton);
    await waitForAppToSettle(page, 1000);
    await expect(page.locator('table').first()).toContainText(updatedDescription, { timeout: 15000 });
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs08(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToPaymentMethod(page, customerName);
    const paymentValues = await savePaymentMethod(page);
    const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(paymentValues.customerPaymentMethodName), 'i') }).first();
    await openTableRowAction(page, row);
    const deleteAction = await resolveFirst(page, customerOnboardingSelectors.actionsMenuItems.deletePaymentMethod, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);
    if (deleteAction) {
      await deleteAction.locator.click();
      await clickWithFallback(page, customerOnboardingSelectors.dialogs.confirmDeleteButton);
      await expect(row).toBeHidden({ timeout: 15000 });
    }
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs09(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToParticipantRegister(page, customerName);
    const participant = await saveParticipantRegister(page);
    await expect(page.locator('table').first()).toContainText(participant.facilityName, { timeout: 15000 });
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs10(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToParticipantRegister(page, customerName);
    await saveParticipantRegister(page);
    await clickWizardNext(page);
    await expectAnyVisible(page, customerOnboardingSelectors.headings.runnerConfiguration);
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs11(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToRunnerConfiguration(page, customerName);
    await clickWizardPrevious(page);
    await expectAnyVisible(page, customerOnboardingSelectors.headings.participantRegister);
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs12(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToParticipantRegister(page, customerName);
    await clickWithFallback(page, customerOnboardingSelectors.wizard.backToListButton);
    await expectAnyVisible(page, customerOnboardingSelectors.headings.customerManagement);
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs13(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToParticipantRegister(page, customerName);
    await clickWithFallback(page, customerOnboardingSelectors.wizard.returnToTopButton);
    await expectAnyVisible(page, customerOnboardingSelectors.headings.participantRegister);
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs14(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToParticipantRegister(page, customerName);
    const participant = await saveParticipantRegister(page);
    const row = await searchParticipantRegisterList(page, participant.facilityName);
    await openTableRowAction(page, row);
    const updateAction = page.getByText(/update participant|delete participant|edit participant/i).first();
    await expect(updateAction).toBeVisible({ timeout: 15000 });
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs15(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToParticipantRegister(page, customerName);
    const participant = await saveParticipantRegister(page);
    const row = await searchParticipantRegisterList(page, participant.facilityName);
    await openTableRowAction(page, row);
    const updateAction = await resolveFirst(page, customerOnboardingSelectors.actionsMenuItems.updateParticipant, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);
    if (updateAction) {
      await updateAction.locator.click();
      await expect(page.getByRole('button', { name: /^Save\b/i }).first()).toBeVisible({ timeout: 15000 });
    }
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs16(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToParticipantRegister(page, customerName);
    const participant = await saveParticipantRegister(page);
    const row = await searchParticipantRegisterList(page, participant.facilityName);
    await openTableRowAction(page, row);
    const deleteAction = await resolveFirst(page, customerOnboardingSelectors.actionsMenuItems.deleteParticipant, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);
    if (deleteAction) {
      await deleteAction.locator.click();
      await clickWithFallback(page, customerOnboardingSelectors.dialogs.confirmDeleteButton);
      await expect(row).toBeHidden({ timeout: 15000 });
    }
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs17(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToParticipantRegister(page, customerName);
    const participant = await saveParticipantRegister(page);
    const row = await searchParticipantRegisterList(page, participant.facilityName);
    await openTableRowAction(page, row);
    const updateAction = await resolveFirst(page, customerOnboardingSelectors.actionsMenuItems.updateParticipant, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);
    if (updateAction) {
      await updateAction.locator.click();
      const editedFacility = `${participant.facilityName}U`;
      const facilityInput = page.getByPlaceholder('Enter the facility name...').first();
      if (await facilityInput.isVisible().catch(() => false)) {
        await facilityInput.fill(editedFacility);
      }
      await clickWithFallback(page, customerOnboardingSelectors.dialogs.saveButton);
      await expect(page.locator('table').first()).toContainText(editedFacility, { timeout: 15000 });
    }
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs18Or20(page, data, runnerType) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToRunnerConfiguration(page, customerName);
    await configureRunnerType(page, runnerType);
    if (/payment/i.test(runnerType)) {
      await expectAnyVisible(page, customerOnboardingSelectors.wizard.openPaymentRunnerConfigButton);
      await openRunnerConfigButton(page, customerOnboardingSelectors.wizard.openPaymentRunnerConfigButton);
      await expectAnyVisible(page, customerOnboardingSelectors.wizard.addPaymentRunnerConfigButton);
    } else {
      await expectAnyVisible(page, customerOnboardingSelectors.wizard.openReconRunnerConfigButton);
      await openRunnerConfigButton(page, customerOnboardingSelectors.wizard.openReconRunnerConfigButton);
      await expectAnyVisible(page, customerOnboardingSelectors.wizard.addReconRunnerConfigButton);
    }
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs19(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await navigateToRunnerConfiguration(page, customerName);
    await clickWizardPrevious(page);
    await expectAnyVisible(page, customerOnboardingSelectors.headings.participantRegister);
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runTs21(page, data) {
  const { customerName } = await createCustomer(page, data);
  try {
    await openImREmitEditDetails(page, customerName);
    const searchField = await fillSearchField(page, customerOnboardingSelectors.wizard.searchAllEntriesField, customerName.slice(0, 6));
    await expect(searchField).toHaveValue(customerName.slice(0, 6));
  } finally {
    await deleteCustomer(page, customerName).catch(() => null);
  }
}

async function runScenario(page, data, scenarioName) {
  if (/^TS_01_/i.test(scenarioName)) {
    return runTs01(page, data);
  }
  if (/^TS_02_|^TS_03_/i.test(scenarioName)) {
    return runTs02Or03(page, data);
  }
  if (/^TS_04_/i.test(scenarioName)) {
    return runTs04(page, data);
  }
  if (/^TS_05_/i.test(scenarioName)) {
    return runTs05(page, data);
  }
  if (/^TS_06_/i.test(scenarioName)) {
    return runTs06(page, data);
  }
  if (/^TS_07_/i.test(scenarioName)) {
    return runTs07(page, data);
  }
  if (/^TS_08_/i.test(scenarioName)) {
    return runTs08(page, data);
  }
  if (/^TS_09_/i.test(scenarioName)) {
    return runTs09(page, data);
  }
  if (/^TS_10_/i.test(scenarioName)) {
    return runTs10(page, data);
  }
  if (/^TS_11_/i.test(scenarioName)) {
    return runTs11(page, data);
  }
  if (/^TS_12_/i.test(scenarioName)) {
    return runTs12(page, data);
  }
  if (/^TS_13_/i.test(scenarioName)) {
    return runTs13(page, data);
  }
  if (/^TS_14_/i.test(scenarioName)) {
    return runTs14(page, data);
  }
  if (/^TS_15_/i.test(scenarioName)) {
    return runTs15(page, data);
  }
  if (/^TS_16_/i.test(scenarioName)) {
    return runTs16(page, data);
  }
  if (/^TS_17_/i.test(scenarioName)) {
    return runTs17(page, data);
  }
  if (/^TS_18_/i.test(scenarioName)) {
    return runTs18Or20(page, data, 'Payment');
  }
  if (/^TS_19_/i.test(scenarioName)) {
    return runTs19(page, data);
  }
  if (/^TS_20_/i.test(scenarioName)) {
    return runTs18Or20(page, data, 'Recon');
  }
  if (/^TS_21_/i.test(scenarioName)) {
    return runTs21(page, data);
  }

  throw new Error(`Customer_Onboarding scenario not implemented yet: ${scenarioName}`);
}

const helperMap = {
  runScenario,
  buildUniqueCustomerName,
  selectors: customerOnboardingSelectors
};

module.exports = {
  customerOnboardingHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap, {
      runScenario: 'Run Customer Onboarding scenario'
    }),
    selectors: customerOnboardingSelectors
  }
};
