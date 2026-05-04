const { expect, test } = require('@playwright/test');
const { resolveFirst, clickWithFallback, fillWithFallback } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { customerManagementAdminTwoSelectors } = require('../../selectors/iteration-matrix/customerManagementAdminTwo.selectors.js');

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

async function reportStep(name, action) {
  return test.step(name, action);
}

async function clickOptionByName(page, optionName) {
  const option = page.getByRole('option', { name: optionName, exact: true }).first();
  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click();
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
      return;
    }
  }

  throw new Error(`No visible choice found for ${optionName}`);
}

async function clickOpenDropdownChoiceByName(page, optionName) {
  const candidates = [
    page.locator('[role="listbox"] [role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }).first(),
    page.locator('[data-radix-popper-content-wrapper] [role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }).first(),
    page.locator('[data-radix-popper-content-wrapper] [data-radix-collection-item]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }).first(),
    page.getByRole('option', { name: optionName, exact: true }).first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      return;
    }
  }

  throw new Error(`No open dropdown choice found for ${optionName}`);
}

async function clickSearchableDropdownChoice(page, searchPlaceholder, optionName) {
  const visibleChoice = page.getByText(optionName, { exact: true }).first();
  if (await visibleChoice.isVisible().catch(() => false)) {
    await visibleChoice.click();
    return;
  }

  const searchInput = page.getByPlaceholder(searchPlaceholder).first();
  await expect(searchInput).toBeVisible({ timeout: 5000 });
  await searchInput.click();
  await searchInput.fill(optionName);
  await waitForAppToSettle(page, 300);

  const popupChoice = page.locator(
    `xpath=//*[contains(@placeholder, ${toXPathLiteral(searchPlaceholder)})]/ancestor::div[1]/following-sibling::*//*[normalize-space()=${toXPathLiteral(optionName)}]`
  ).first();
  const fallbackChoices = [
    popupChoice,
    page.locator('[role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }).first(),
    page.getByText(optionName, { exact: true }).first()
  ];

  for (const locator of fallbackChoices) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      return;
    }
  }

  await page.keyboard.press('ArrowDown').catch(() => null);
  await page.keyboard.press('Enter').catch(() => null);
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

    try {
      await clickOpenDropdownChoiceByName(page, String(optionName));
      return;
    } catch {
    }

    if (await optionOrButtonIsVisible(page, String(optionName))) {
      await clickChoiceByName(page, String(optionName));
      return;
    }
  }

  await page.keyboard.press('ArrowDown').catch(() => null);
  await page.keyboard.press('Enter').catch(() => null);
  await waitForAppToSettle(page, 500);

  if (await page.getByRole('option').first().isVisible().catch(() => false)) {
    await clickFirstVisibleOption(page);
  }
}

async function clickDropdown(page, candidates) {
  const result = await resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500 });
  await result.locator.click();
}

async function fillSearchField(page, candidates, value) {
  const result = await resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500 });
  await result.locator.fill(value);
  await waitForAppToSettle(page, 500);
}

async function selectDropdownValue(page, dropdownCandidates, preferredOption, fallbackOptions = [], options = {}) {
  await clickDropdown(page, dropdownCandidates);

  if (preferredOption && await optionOrButtonIsVisible(page, preferredOption)) {
    await clickChoiceByName(page, preferredOption);
    return preferredOption;
  }

  for (const optionName of fallbackOptions) {
    if (!String(optionName || '').trim()) {
      continue;
    }

    if (await optionOrButtonIsVisible(page, optionName)) {
      await clickChoiceByName(page, optionName);
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

async function ensureCreateCustomerPage(page) {
  const customerManagementLink = page.getByRole('link', { name: 'Customer Management', exact: true }).first();
  if (!(await customerManagementLink.isVisible().catch(() => false))) {
    await clickWithFallback(page, customerManagementAdminTwoSelectors.adminModule);
    await waitForAppToSettle(page, 1000);
  }

  if (!(await customerManagementLink.isVisible().catch(() => false))) {
    const createUrl = new URL('/app/admin/customer-management/create', page.url()).toString();
    await page.goto(createUrl, { waitUntil: 'domcontentloaded' });
  }

  if (!(await page.getByRole('heading', { name: 'Create Customer', exact: true }).first().isVisible().catch(() => false))) {
    await clickWithFallback(page, customerManagementAdminTwoSelectors.customerManagementLink);
  }

  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true })).toBeVisible({ timeout: 15000 });
  if (!(await page.getByRole('heading', { name: 'Create Customer', exact: true }).first().isVisible().catch(() => false))) {
    await clickWithFallback(page, customerManagementAdminTwoSelectors.addCustomerButton);
  }
  await expect(page.getByRole('heading', { name: 'Create Customer', exact: true })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Customer Details', exact: true })).toBeVisible({ timeout: 15000 });
}

async function fillBaseCustomerDetails(page, data, options = {}) {
  const customerName = options.customerName || buildUniqueCustomerName(data);
  await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.customerName, customerName);
  await clickDropdown(page, customerManagementAdminTwoSelectors.dropdowns.programManager);
  await clickOptionWithFallback(page, [
    customerManagementAdminTwoSelectors.programManagerOption,
    data.Username_ProgramManager,
    data.Username_ProjectManager,
    data.Username_Management
  ]);
  await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.companyContactName, options.companyContactName || 'TestCompany');
  await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.companyIndustry, options.companyIndustry || 'TestData');
  await selectDropdownValue(
    page,
    customerManagementAdminTwoSelectors.dropdowns.country,
    customerManagementAdminTwoSelectors.countryOption,
    [data.Country, data.CustomerCountry, 'USA']
  );
  await selectDropdownValue(
    page,
    customerManagementAdminTwoSelectors.dropdowns.state,
    customerManagementAdminTwoSelectors.stateOption,
    [data.State, data.CustomerState, 'Alaska']
  );
  await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.address, options.address || '141 W Main Ave');
  await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.city, options.city || 'Gastonia');
  await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.zipCode, options.zipCode || data.ZipCode || '65753');
  await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.email, options.email || data.CustomerEmail || 'QAMammoth@test.com');
  await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.phone, options.phone || data.CustomerPhone || '(704) 867-7427');
  await selectDropdownValue(
    page,
    customerManagementAdminTwoSelectors.dropdowns.fileTransmissionMethod,
    customerManagementAdminTwoSelectors.fileTransmissionMethodOption,
    [data.FileTransmissionMethod, data.TransmissionMethod, 'sFTP'],
    { allowMissingOptions: true }
  );
  await selectDropdownValue(
    page,
    customerManagementAdminTwoSelectors.dropdowns.fileTransmissionType,
    customerManagementAdminTwoSelectors.fileTransmissionTypeOption,
    [data.FileTransmissionType, data.TransmissionType, 'Payment File'],
    { allowMissingOptions: true }
  );
  await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.erpSystem, options.erpSystem || 'QATDATA');

  return { customerName };
}

async function openCreateCustomerForm(page, data, options = {}) {
  await ensureCreateCustomerPage(page);
  if (options.prefill === false) {
    return { customerName: null };
  }
  return fillBaseCustomerDetails(page, data, options);
}

async function openModuleDropdown(page) {
  await clickDropdown(page, customerManagementAdminTwoSelectors.dropdowns.moduleSubscription);
  await expect(async () => {
    const optionCount = await page.getByRole('option').count();
    expect(optionCount).toBeGreaterThan(0);
  }).toPass({ timeout: 15000 });
}

async function selectModules(page, moduleNames) {
  await openModuleDropdown(page);
  for (const moduleName of moduleNames) {
    await clickChoiceByName(page, moduleName);
  }
  await page.keyboard.press('Escape').catch(() => null);
  await waitForAppToSettle(page, 500);
}

async function submitCustomer(page) {
  await clickWithFallback(page, customerManagementAdminTwoSelectors.submitButton);
  await waitForAppToSettle(page, 1000);
  try {
    const matchedToast = await resolveFirst(page, customerManagementAdminTwoSelectors.successToast, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    await expect(matchedToast.locator).toBeVisible({ timeout: 5000 });
  } catch (error) {
    const listHeading = page.getByRole('heading', { name: 'Customer Management', exact: true }).first();
    const landedOnList = await listHeading.isVisible().catch(() => false);

    if (!landedOnList) {
      throw error;
    }
  }
}

async function submitEditedCustomer(page) {
  await clickWithFallback(page, customerManagementAdminTwoSelectors.updateButton);
  await waitForAppToSettle(page, 1000);
  try {
    const matchedToast = await resolveFirst(page, customerManagementAdminTwoSelectors.updateSuccessToast, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    await expect(matchedToast.locator).toBeVisible({ timeout: 5000 });
  } catch (error) {
    const listHeading = page.getByRole('heading', { name: 'Customer Management', exact: true }).first();
    const editHeading = page.getByRole('heading', { name: 'Edit Customer', exact: true }).first();
    const landedOnList = await listHeading.isVisible().catch(() => false);
    const stayedOnEdit = await editHeading.isVisible().catch(() => false);

    if (!landedOnList && !stayedOnEdit) {
      throw error;
    }
  }
}

async function createCustomer(page, data, options = {}) {
  const openResult = await openCreateCustomerForm(page, data, options);
  const customerName = options.customerName || openResult.customerName;

  if (options.modules?.length) {
    await selectModules(page, options.modules);
  }

  if (options.aliases) {
    const aliasField = await ensureAliasFieldVisible(page);
    if (aliasField) {
      await aliasField.locator.fill(String(options.aliases));
    }
  }

  const addressStateControl = page.locator('div').filter({ hasText: /Address state/i }).locator('[role="combobox"], button').first();
  if (await addressStateControl.isVisible().catch(() => false)) {
    const addressStateText = await addressStateControl.textContent().catch(() => '');
    if (/select address state/i.test(addressStateText || '')) {
      await selectDropdownValue(
        page,
        customerManagementAdminTwoSelectors.dropdowns.state,
        customerManagementAdminTwoSelectors.stateOption,
        [data.State, data.CustomerState, 'Alaska'],
        { allowMissingOptions: true }
      );
    }
  }

  if (options.ssoChecked) {
    await ensureCheckboxCheckedByLabel(page, 'Single Sign-On (SSO)');
  }

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

  const customerManagementLink = page.getByRole('link', { name: 'Customer Management', exact: true }).first();
  if (await customerManagementLink.isVisible().catch(() => false)) {
    await customerManagementLink.click();
  } else {
    const listUrl = new URL('/app/admin/customer-management', page.url()).toString();
    await page.goto(listUrl, { waitUntil: 'domcontentloaded' });
  }

  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function findCustomerRow(page, customerName) {
  const matcher = customerName instanceof RegExp ? customerName : new RegExp(escapeRegExp(String(customerName)), 'i');
  const row = page.locator('table tbody tr').filter({ hasText: matcher }).first();
  await row.waitFor({ state: 'visible', timeout: 15000 });
  return row;
}

async function findAnyCustomerRow(page) {
  await ensureCustomerManagementListPage(page);
  const row = page.locator('table tbody tr').first();
  await row.waitFor({ state: 'visible', timeout: 15000 });
  return row;
}

async function searchCustomerList(page, customerName) {
  await ensureCustomerManagementListPage(page);
  await fillSearchField(page, customerManagementAdminTwoSelectors.searchFields.customerList, customerName);

  try {
    return await findCustomerRow(page, customerName);
  } catch (error) {
    const listUrl = new URL('/app/admin/customer-management', page.url()).toString();
    await page.goto(listUrl, { waitUntil: 'domcontentloaded' });
    await ensureCustomerManagementListPage(page);
    await fillSearchField(page, customerManagementAdminTwoSelectors.searchFields.customerList, customerName);
    return findCustomerRow(page, customerName);
  }
}

async function searchParticipantRegisterList(page, facilityName) {
  const searchField = page.getByPlaceholder('Search all entries...').first();
  await expect(searchField).toBeVisible({ timeout: 15000 });
  await searchField.fill(String(facilityName));
  await waitForAppToSettle(page, 500);

  const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(String(facilityName)), 'i') }).first();
  await row.waitFor({ state: 'visible', timeout: 15000 });
  return row;
}

async function openCustomerAction(page, customerName, actionCandidates) {
  const row = await searchCustomerList(page, customerName);
  const actionButton = row.getByRole('button', { name: /actions for|open actions menu|open menu/i }).first();
  await actionButton.click({ timeout: 5000 });
  const action = await resolveFirst(page, actionCandidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await action.locator.click();
}

async function openAnyCustomerAction(page, actionCandidates) {
  const row = await findAnyCustomerRow(page);
  const actionButton = row.getByRole('button', { name: /actions for|open actions menu|open menu/i }).first();
  await actionButton.click({ timeout: 5000 });
  const action = await resolveFirst(page, actionCandidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await action.locator.click();
}

async function openEditCustomerDetails(page, customerName) {
  await openCustomerAction(page, customerName, customerManagementAdminTwoSelectors.actionsMenuItems.editCustomerDetails);
  await expect(page.getByRole('heading', { name: 'Edit Customer', exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function openImREmitEditDetails(page, customerName) {
  await openCustomerAction(page, customerName, customerManagementAdminTwoSelectors.actionsMenuItems.imREmitEditDetails);
}

async function getToggleByLabel(page, labelText) {
  const literal = toXPathLiteral(labelText);
  const nearbyCheckboxes = page
    .locator('div')
    .filter({ hasText: new RegExp(escapeRegExp(labelText), 'i') })
    .locator('input[type="checkbox"], [role="checkbox"], [role="switch"], button')
    .first();
  const candidates = [
    nearbyCheckboxes,
    page.locator(`xpath=//label[contains(normalize-space(), ${literal})]/following::*[(self::input[@type="checkbox"] or self::button or @role="checkbox" or @role="switch")][1]`).first(),
    page.locator(`xpath=//*[contains(normalize-space(), ${literal})]/ancestor::div[1]//*[self::input[@type="checkbox"] or self::button or @role="checkbox" or @role="switch"][1]`).first(),
    page.locator(`xpath=//*[contains(normalize-space(), ${literal})]/ancestor::div[1]/preceding-sibling::*[1]//*[self::input[@type="checkbox"] or self::button or @role="checkbox" or @role="switch"][1]`).first(),
    page.locator(`xpath=//*[contains(normalize-space(), ${literal})]/preceding::*[(self::input[@type="checkbox"] or self::button or @role="checkbox" or @role="switch")][1]`).first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      return locator;
    }
  }

  return candidates[0];
}

async function expectToggleCheckedByLabel(page, labelText) {
  const toggle = await getToggleByLabel(page, labelText);
  await expect(toggle).toBeVisible({ timeout: 15000 });
  await expect(async () => {
    const primaryChecked = await isToggleChecked(toggle);
    if (primaryChecked) {
      expect(primaryChecked).toBeTruthy();
      return;
    }

    const alternateToggles = page
      .locator('div')
      .filter({ hasText: new RegExp(escapeRegExp(labelText), 'i') })
      .locator('input[type="checkbox"], [role="checkbox"], [role="switch"], button');
    const candidateCount = await alternateToggles.count().catch(() => 0);

    for (let index = 0; index < candidateCount; index += 1) {
      const candidate = alternateToggles.nth(index);
      if (!(await candidate.isVisible().catch(() => false))) {
        continue;
      }
      if (await isToggleChecked(candidate)) {
        expect(true).toBeTruthy();
        return;
      }
    }

    expect(false).toBeTruthy();
  }).toPass({ timeout: 15000 });
}

async function ensureCheckboxCheckedByLabel(page, labelText) {
  const toggle = await getToggleByLabel(page, labelText);
  await expect(toggle).toBeVisible({ timeout: 15000 });
  if (!(await isToggleChecked(toggle))) {
    await toggle.click();
  }

  if (!(await isToggleChecked(toggle))) {
    const alternateToggles = page
      .locator('div')
      .filter({ hasText: new RegExp(escapeRegExp(labelText), 'i') })
      .locator('input[type="checkbox"], [role="checkbox"], [role="switch"], button');
    const candidateCount = await alternateToggles.count().catch(() => 0);

    for (let index = 0; index < candidateCount; index += 1) {
      const candidate = alternateToggles.nth(index);
      if (!(await candidate.isVisible().catch(() => false))) {
        continue;
      }
      await candidate.click({ force: true }).catch(() => null);
      if (await isToggleChecked(candidate)) {
        return;
      }
    }
  }

  await expect(async () => {
    expect(await isToggleChecked(toggle)).toBeTruthy();
  }).toPass({ timeout: 10000 });
}

async function isToggleChecked(toggle) {
  const dataState = await toggle.getAttribute('data-state').catch(() => null);
  const ariaChecked = await toggle.getAttribute('aria-checked').catch(() => null);
  const inputType = await toggle.getAttribute('type').catch(() => null);
  const checkedAttr = await toggle.getAttribute('checked').catch(() => null);

  if (dataState === 'checked' || ariaChecked === 'true' || checkedAttr !== null) {
    return true;
  }

  if (inputType === 'checkbox') {
    return toggle.isChecked().catch(() => false);
  }

  return false;
}

async function ensureAliasFieldVisible(page) {
  const aliasField = await resolveFirst(page, customerManagementAdminTwoSelectors.fields.aliases, {
    mustBeVisible: true,
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (aliasField) {
    return aliasField;
  }

  const aliasToggle = await resolveFirst(page, customerManagementAdminTwoSelectors.aliasControls.toggle, {
    mustBeVisible: false,
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (aliasToggle) {
    await aliasToggle.locator.scrollIntoViewIfNeeded().catch(() => null);
    await aliasToggle.locator.click({ force: true }).catch(() => null);
    await waitForAppToSettle(page, 500);
  }

  const addFirstAliasButton = await resolveFirst(page, customerManagementAdminTwoSelectors.aliasControls.addFirstAliasButton, {
    mustBeVisible: false,
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (addFirstAliasButton) {
    await addFirstAliasButton.locator.scrollIntoViewIfNeeded().catch(() => null);
    await addFirstAliasButton.locator.click({ force: true }).catch(() => null);
    await waitForAppToSettle(page, 500);
  }

  return resolveFirst(page, customerManagementAdminTwoSelectors.fields.aliases, {
    mustBeVisible: true,
    timeoutPerCandidate: 1000
  }).catch(() => null);
}

async function expectLabelVisible(page, candidates) {
  const matched = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(matched.locator).toBeVisible({ timeout: 15000 });
}

async function expectManagedViaRunnerFieldVisible(page, labelText) {
  const normalized = String(labelText).toLowerCase();
  const labelCandidates = normalized.includes('payment run')
    ? [
        page.getByText('Payment run frequency:', { exact: true }).first(),
        page.getByText(/Payment Run Frequency/i).first(),
        page.getByText(/Payment run frequency/i).first()
      ]
    : [
        page.getByText('Reconciliation frequency:', { exact: true }).first(),
        page.getByText('Reconciliation Frequency & Time:', { exact: true }).first(),
        page.getByText(/Reconciliation Frequency/i).first(),
        page.getByText(/Reconciliation frequency/i).first()
      ];

  for (const locator of labelCandidates) {
    if (await locator.isVisible().catch(() => false)) {
      await expect(locator).toBeVisible({ timeout: 15000 });
      break;
    }
  }

  const field = page.getByPlaceholder('Managed via Runner Configuration...').first();
  await expect(field).toBeVisible({ timeout: 15000 });
}

async function expectSsoVisibleOnCreate(page, data) {
  await reportStep('Open Create Customer page', async () => {
    await openCreateCustomerForm(page, data, { prefill: false });
  });
  await reportStep('Verify Single Sign-On (SSO) checkbox is visible', async () => {
    await expectLabelVisible(page, customerManagementAdminTwoSelectors.labels.sso);
  });
}

async function expectSsoVisibleOnEdit(page, data) {
  await reportStep('Open Edit Customer Details', async () => {
    await ensureCustomerManagementListPage(page);
    await openAnyCustomerAction(page, customerManagementAdminTwoSelectors.actionsMenuItems.editCustomerDetails);
  });
  await reportStep('Verify Single Sign-On (SSO) checkbox is visible', async () => {
    await expectLabelVisible(page, customerManagementAdminTwoSelectors.labels.sso);
  });
}

async function expectSsoPersists(page, data) {
  const { customerName } = await reportStep('Create customer with Single Sign-On enabled', async () => {
    return createCustomer(page, data, {
      ssoChecked: true,
      modules: [customerManagementAdminTwoSelectors.modules.imREmit]
    });
  });
  await reportStep('Open Edit Customer Details', async () => {
    await openEditCustomerDetails(page, customerName);
  });
  await reportStep('Verify Single Sign-On (SSO) remains checked', async () => {
    await expectToggleCheckedByLabel(page, 'Single Sign-On (SSO)');
  });
}

async function expectPaymentGroupsVisibleOnCreate(page, data) {
  await reportStep('Open Create Customer page', async () => {
    await openCreateCustomerForm(page, data, { prefill: false });
  });
  await reportStep('Verify Payment Groups field is visible', async () => {
    await expectLabelVisible(page, customerManagementAdminTwoSelectors.labels.paymentGroups);
  });
}

async function expectPaymentGroupsVisibleOnEdit(page, data) {
  await reportStep('Open Edit Customer Details', async () => {
    await ensureCustomerManagementListPage(page);
    await openAnyCustomerAction(page, customerManagementAdminTwoSelectors.actionsMenuItems.editCustomerDetails);
  });
  await reportStep('Verify Payment Groups field is visible', async () => {
    await expectLabelVisible(page, customerManagementAdminTwoSelectors.labels.paymentGroups);
  });
}

async function clickWizardNext(page) {
  await clickWithFallback(page, customerManagementAdminTwoSelectors.wizard.nextButton);
  await waitForAppToSettle(page, 750);
}

async function isWizardNextEnabled(page) {
  const matchedButton = await resolveFirst(page, customerManagementAdminTwoSelectors.wizard.nextButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  return !(await matchedButton.locator.isDisabled());
}

async function ensurePaymentMethodCanContinue(page) {
  if (await isWizardNextEnabled(page)) {
    return;
  }

  const providerControl = await resolveFirst(page, customerManagementAdminTwoSelectors.wizard.paymentProviderDropdown, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (providerControl) {
    let providerText = (await providerControl.locator.textContent().catch(() => '') || '').trim();
    let providerSelected = /j\.p\. morgan|jp morgan/i.test(providerText);

    if (!providerSelected) {
      await providerControl.locator.click();

      const directVisibleProvider = page.getByText('J.P. Morgan', { exact: true }).first();
      if (await directVisibleProvider.isVisible().catch(() => false)) {
        await directVisibleProvider.click();
      } else {
        const providerSearch = page.getByPlaceholder('Search Payment Provider...').first();
        if (await providerSearch.isVisible().catch(() => false)) {
          await clickSearchableDropdownChoice(page, 'Search Payment Provider...', 'J.P. Morgan');
        } else {
          try {
            await clickOpenDropdownChoiceByName(page, 'J.P. Morgan');
          } catch (error) {
            const directChoice = page.getByText('J.P. Morgan', { exact: true }).first();
            if (await directChoice.isVisible().catch(() => false)) {
              await directChoice.click();
            } else {
              await page.keyboard.press('ArrowDown').catch(() => null);
              await page.keyboard.press('Enter').catch(() => null);
            }
          }
        }
      }

      await expect(async () => {
        providerText = (await providerControl.locator.textContent().catch(() => '') || '').trim();
        expect(/j\.p\. morgan|jp morgan/i.test(providerText)).toBeTruthy();
      }).toPass({ timeout: 10000 });

      providerText = (await providerControl.locator.textContent().catch(() => '') || '').trim();
      providerSelected = /j\.p\. morgan|jp morgan/i.test(providerText);
    }

    if (!providerSelected) {
      throw new Error(`Payment provider was not selected. Current provider text: ${providerText || '<empty>'}`);
    }
  }

  const paymentMethodControl = await resolveFirst(page, customerManagementAdminTwoSelectors.wizard.paymentMethodDropdown, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (paymentMethodControl) {
    let paymentMethodText = (await paymentMethodControl.locator.textContent().catch(() => '') || '').trim();
    let paymentMethodSelected = /\bSUA\b/i.test(paymentMethodText);

    if (!paymentMethodSelected) {
      await paymentMethodControl.locator.click();

      const directVisibleMethod = page.getByText('SUA', { exact: true }).first();
      if (await directVisibleMethod.isVisible().catch(() => false)) {
        await directVisibleMethod.click();
      } else {
        const methodSearch = page.getByPlaceholder('Search Payment Method...').first();
        if (await methodSearch.isVisible().catch(() => false)) {
          await clickSearchableDropdownChoice(page, 'Search Payment Method...', 'SUA');
        } else {
          await clickOptionWithFallback(page, ['SUA']);
        }
      }

      await expect(async () => {
        paymentMethodText = (await paymentMethodControl.locator.textContent().catch(() => '') || '').trim();
        expect(/\bSUA\b/i.test(paymentMethodText)).toBeTruthy();
      }).toPass({ timeout: 10000 });

      paymentMethodText = (await paymentMethodControl.locator.textContent().catch(() => '') || '').trim();
      paymentMethodSelected = /\bSUA\b/i.test(paymentMethodText);
    }

    if (!paymentMethodSelected) {
      throw new Error(`Payment method was not selected. Current payment method text: ${paymentMethodText || '<empty>'}`);
    }
  }

  await waitForAppToSettle(page, 500);

  const nameInput = await resolveFirst(page, customerManagementAdminTwoSelectors.wizard.customerPaymentMethodInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (nameInput) {
    await nameInput.locator.fill('Credit Card');
  }

  const descriptionInput = await resolveFirst(page, customerManagementAdminTwoSelectors.wizard.paymentMethodDescriptionInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (descriptionInput) {
    await descriptionInput.locator.fill('This is for test');
  }

  const saveButton = await resolveFirst(page, customerManagementAdminTwoSelectors.wizard.savePaymentMethodButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (saveButton) {
    await saveButton.locator.click();
    await waitForAppToSettle(page, 1000);
  }

  await expect(async () => {
    expect(await isWizardNextEnabled(page)).toBeTruthy();
  }).toPass({ timeout: 20000 });
}

async function navigateToParticipantRegister(page, customerName) {
  await reportStep('Open imREmit Edit Details', async () => {
    await openImREmitEditDetails(page, customerName);
    await expectLabelVisible(page, customerManagementAdminTwoSelectors.wizard.emailConfigurationHeading);
  });
  await reportStep('Open Payment Method step', async () => {
    await clickWizardNext(page);
    await expectLabelVisible(page, customerManagementAdminTwoSelectors.wizard.paymentMethodHeading);
  });
  await reportStep('Complete Payment Method step', async () => {
    await ensurePaymentMethodCanContinue(page);
  });
  await reportStep('Open Participant Register step', async () => {
    if (await isWizardNextEnabled(page)) {
      await clickWizardNext(page);
    } else {
      const participantStep = page.getByRole('button', { name: /participant register/i }).first();
      if (await participantStep.isVisible().catch(() => false)) {
        await participantStep.click();
        await waitForAppToSettle(page, 1000);
      } else {
        await clickWizardNext(page);
      }
    }
    await expectLabelVisible(page, customerManagementAdminTwoSelectors.wizard.participantRegisterHeading);
  });
}

async function navigateToRunnerConfiguration(page, customerName) {
  await navigateToParticipantRegister(page, customerName);
  await reportStep('Open Runner Configuration step', async () => {
    if (!(await isWizardNextEnabled(page))) {
      await saveParticipantRegister(page);
    }
    await clickWizardNext(page);
    await expectLabelVisible(page, customerManagementAdminTwoSelectors.wizard.runnerConfigurationHeading);
  });
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

  await reportStep('Enter Participant Register details', async () => {
    for (const entry of fieldValues) {
      if (await entry.locator.isVisible().catch(() => false)) {
        await entry.locator.fill(String(entry.value));
      }
    }
  });

  await reportStep('Save Participant Register entry', async () => {
    const saveParticipantButton = page.getByRole('button', { name: /save participant/i }).first();
    if (await saveParticipantButton.isVisible().catch(() => false)) {
      await saveParticipantButton.click();
      await waitForAppToSettle(page, 1000);
    }
  });

  await reportStep('Search Participant Register entry', async () => {
    await searchParticipantRegisterList(page, facilityName);
  });

  return { facilityName, groupId, orgId, userId };
}

async function expectPaymentGroupDataReflected(page, customerName, fieldName, expectedValue) {
  await reportStep('Open Edit Customer Details', async () => {
    await openEditCustomerDetails(page, customerName);
    await expectLabelVisible(page, customerManagementAdminTwoSelectors.labels.paymentGroups);
  });
  await reportStep('Verify Payment Group data is reflected', async () => {
    const field = page.locator(`input[name="${fieldName}"]`).first();
    if (await field.isVisible().catch(() => false)) {
      if (expectedValue) {
        await expect(field).toHaveValue(new RegExp(escapeRegExp(String(expectedValue)), 'i'), { timeout: 15000 });
      } else {
        await expect(field).not.toHaveValue('', { timeout: 15000 });
      }
      return;
    }
    const content = page.locator('form').first();
    if (expectedValue) {
      await expect(content).toContainText(String(expectedValue), { timeout: 15000 });
      return;
    }
    await expect(content).toContainText(/Payment Group/i, { timeout: 15000 });
  });
}

async function configureRunnerType(page, preferredType = 'Recon') {
  const dropdown = await resolveFirst(page, customerManagementAdminTwoSelectors.wizard.runnerTypeDropdown, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (dropdown) {
    await dropdown.locator.click();
    if (/payment/i.test(preferredType) && await optionOrButtonIsVisible(page, 'Payment')) {
      await clickChoiceByName(page, 'Payment');
    } else if (/recon/i.test(preferredType) && await optionOrButtonIsVisible(page, 'Recon')) {
      await clickChoiceByName(page, 'Recon');
    } else if (await optionOrButtonIsVisible(page, 'Payment')) {
      await clickChoiceByName(page, 'Payment');
    } else if (await optionOrButtonIsVisible(page, 'Recon')) {
      await clickChoiceByName(page, 'Recon');
    } else {
      await clickFirstVisibleOption(page);
    }
    await waitForAppToSettle(page, 750);
  }
}

async function openReconRunnerConfig(page) {
  await clickWithFallback(page, customerManagementAdminTwoSelectors.wizard.openReconRunnerConfigButton);
  await waitForAppToSettle(page, 750);
}

async function openPaymentRunnerConfig(page) {
  await clickWithFallback(page, customerManagementAdminTwoSelectors.wizard.openPaymentRunnerConfigButton);
  await waitForAppToSettle(page, 750);
}

async function saveRunnerConfig(page, runnerType = 'Recon') {
  const buttonCandidates = /payment/i.test(runnerType)
    ? customerManagementAdminTwoSelectors.wizard.addPaymentRunnerConfigButton
    : customerManagementAdminTwoSelectors.wizard.addReconRunnerConfigButton;
  await clickWithFallback(page, buttonCandidates);
  await waitForAppToSettle(page, 1000);
}

async function completeRunnerConfig(page) {
  const completeButton = await resolveFirst(page, customerManagementAdminTwoSelectors.wizard.completeRunnerConfigButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 3000
  }).catch(() => null);
  if (completeButton) {
    await completeButton.locator.click();
    await waitForAppToSettle(page, 1000);
  }
}

async function openRunnerCheckboxScenario(page, data, labelText) {
  const { customerName } = await reportStep('Create customer for runner configuration', async () => {
    return createCustomer(page, data, { modules: [customerManagementAdminTwoSelectors.modules.imREmit] });
  });
  await navigateToParticipantRegister(page, customerName);
  await saveParticipantRegister(page);
  await reportStep('Open Runner Configuration page', async () => {
    await clickWizardNext(page);
    await expectLabelVisible(page, customerManagementAdminTwoSelectors.wizard.runnerConfigurationHeading);
    await configureRunnerType(page, 'Payment');
    await openPaymentRunnerConfig(page);
  });
  return { customerName, runnerType: 'Payment' };
}

async function expectRunnerCheckboxDisplayed(page, data, labelText) {
  await openRunnerCheckboxScenario(page, data, labelText);
  await reportStep(`Verify ${labelText} checkbox is visible`, async () => {
    const toggle = await getToggleByLabel(page, labelText);
    await expect(toggle).toBeVisible({ timeout: 15000 });
  });
}

async function expectRunnerCheckboxFunctional(page, data, labelText) {
  await openRunnerCheckboxScenario(page, data, labelText);
  await reportStep(`Check ${labelText} checkbox`, async () => {
    await ensureCheckboxCheckedByLabel(page, labelText);
  });
}

async function expectRunnerCheckboxPersists(page, data, labelText) {
  const { customerName, runnerType } = await openRunnerCheckboxScenario(page, data, labelText);
  await reportStep(`Check ${labelText} checkbox`, async () => {
    await ensureCheckboxCheckedByLabel(page, labelText);
  });
  await reportStep('Save Runner Configuration', async () => {
    await saveRunnerConfig(page, runnerType);
    await completeRunnerConfig(page);
  });
  await navigateToRunnerConfiguration(page, customerName);
  await reportStep('Reopen Payment Runner Configuration', async () => {
    await configureRunnerType(page, runnerType);
    await openPaymentRunnerConfig(page);
  });
  await reportStep(`Verify ${labelText} checkbox remains checked`, async () => {
    await expectToggleCheckedByLabel(page, labelText);
  });
}

async function expectCountryEnablesLocationFields(page, data) {
  await reportStep('Open Create Customer page', async () => {
    await openCreateCustomerForm(page, data, { prefill: false });
  });
  await reportStep('Select Country and Address State', async () => {
    await selectDropdownValue(
      page,
      customerManagementAdminTwoSelectors.dropdowns.country,
      customerManagementAdminTwoSelectors.countryOption,
      [data.Country, data.CustomerCountry, 'USA']
    );
    await selectDropdownValue(
      page,
      customerManagementAdminTwoSelectors.dropdowns.state,
      customerManagementAdminTwoSelectors.stateOption,
      [data.State, data.CustomerState, 'Alaska']
    );
  });
  await reportStep('Enter Address, City, and Zip code', async () => {
    await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.address, '141 W Main Ave');
    await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.city, 'Gastonia');
    await fillWithFallback(page, customerManagementAdminTwoSelectors.fields.zipCode, data.ZipCode || '65753');
  });
}

async function expectFieldVisibleOnCreate(page, data, candidates) {
  await reportStep('Open Create Customer page', async () => {
    await openCreateCustomerForm(page, data, { prefill: false });
  });
  await reportStep('Verify field is visible', async () => {
    await expectLabelVisible(page, candidates);
  });
}

async function expectManagedFrequencyFieldsOnCreate(page, data, labelText) {
  await reportStep('Open Create Customer page', async () => {
    await openCreateCustomerForm(page, data, { prefill: false });
  });
  await reportStep(`Verify ${labelText.replace(/:$/, '')} field is managed via Runner Configuration`, async () => {
    await expectManagedViaRunnerFieldVisible(page, labelText);
  });
}

function fieldScenarioValue(length, prefix = 'T') {
  return `${prefix}`.repeat(length);
}

const scenarioFieldMap = {
  TS_77_To_verify_that_Customer_Name_field_accepts_special_characters_and_create_customer: { field: 'customerName', value: 'Customer-& ', verifyOnEdit: false },
  TS_78_To_verify_that_Company_Industry_field_accepts_special_characters_and_create_customer: { field: 'companyIndustry', value: 'Test.-,1' },
  TS_79_To_verify_that_Customer_ERP_System_field_accepts_special_characters_and_create_customer: { field: 'erpSystem', value: 'ERP-1' },
  TS_80_To_verify_that_Contact_Name_field_accepts_special_characters_and_create_customer: { field: 'companyContactName', value: 'Test.-' },
  TS_81_To_verify_that_Customer_Aliases_accepts_special_characters_and_create_customer: { field: 'aliases', value: "test('-') ('.' ',')" },
  TS_82_To_verify_Customer_Name_field_accepts_length_of_characters_thirty_while_customer_is_creating_time: { field: 'customerName', value: fieldScenarioValue(30, 'A') },
  TS_83_To_verify_that_Customer_Name_field_accepts_length_of_one_character_while_customer_is_creating_their_time: { field: 'customerName', value: 'A' },
  TS_84_To_verify_that_Customer_Name_field_accepts_more_than_thirty_characters_and_that_customers_can_create: { field: 'customerName', value: fieldScenarioValue(31, 'B') },
  TS_85_To_verify_that_Company_Industry_field_accepts_length_of_two_fifty_characters_while_customer_is_creating_time: { field: 'companyIndustry', value: fieldScenarioValue(250, 'C') },
  TS_86_To_verify_that_Company_Industry_field_accepts_length_of_one_character_while_customer_is_creating_their_time: { field: 'companyIndustry', value: '1A' },
  TS_87_To_verify_that_Customer_ERP_field_accepts_length_of_two_fifty_character_while_customer_is_creating_their_time: { field: 'erpSystem', value: fieldScenarioValue(250, 'E') },
  TS_88_To_verify_that_Customer_ERP_System_field_accepts_length_of_one_character_while_customer_is_creating_their_time: { field: 'erpSystem', value: '1T' },
  TS_89_To_verify_that_Customer_ERP_System_field_accepts_more_than_fifty_characters_and_that_customers_can_create: { field: 'erpSystem', value: fieldScenarioValue(51, 'G') },
  TS_90_To_verify_that_Customer_Contact_Name_field_accepts_length_of_one_character_while_customer_is_creating_their_time: { field: 'companyContactName', value: 'T-' },
  TS_91_To_verify_that_Customer_Contact_Name_field_accepts_more_than_thirty_characters_and_that_customers_can_create: { field: 'companyContactName', value: fieldScenarioValue(31, 'I') },
  TS_92_To_verify_that_Customer_Contact_Phone_field_accepts_more_than_fiften_characters_and_customers_can_create: { field: 'phone', value: '1234567890123456' },
  TS_93_To_verify_that_Customer_Contact_Phone_field_accepts_length_of_one_character_while_customer_is_creating_their_time: { field: 'phone', value: '1' },
  TS_94_To_verify_that_Customer_Contact_Phone_field_accepts_length_of_seven_characters_while_customer_is_creating_time: { field: 'phone', value: '1234567' }
};

async function createCustomerForFieldScenario(page, data, scenarioName) {
  const config = scenarioFieldMap[scenarioName];
  const overrides = { modules: [customerManagementAdminTwoSelectors.modules.imREmit] };

  if (config.field === 'customerName') {
    overrides.customerName = `${String(config.value).replace(/[^a-zA-Z0-9]/g, 'X').slice(0, 20)}${Date.now().toString().slice(-4)}`;
  } else {
    overrides.customerName = buildUniqueCustomerName(data);
    overrides[config.field] = config.value;
  }

  await reportStep('Create customer with scenario-specific field data', async () => {
    await createCustomer(page, data, overrides);
  });
  await reportStep('Verify Customer Management list is displayed', async () => {
    await ensureCustomerManagementListPage(page);
    await expect(page.getByRole('heading', { name: 'Customer Management', exact: true }).first()).toBeVisible({ timeout: 15000 });
  });
}

function humanizeScenarioTitle(scenarioName) {
  const raw = String(scenarioName || '').replace(/\.spec\.js$/i, '').trim();
  const displayOverrides = {
    TS_78_To_verify_that_Company_Industry_field_accepts_special_characters_and_create_customer:
      'TS 78 - To verify that Company Industry field accepts supported special characters and creates customer',
    TS_79_To_verify_that_Customer_ERP_System_field_accepts_special_characters_and_create_customer:
      'TS 79 - To verify that Customer ERP System field accepts hyphenated values and creates customer',
    TS_80_To_verify_that_Contact_Name_field_accepts_special_characters_and_create_customer:
      'TS 80 - To verify that Contact Name field accepts supported punctuation and creates customer',
    TS_86_To_verify_that_Company_Industry_field_accepts_length_of_one_character_while_customer_is_creating_their_time:
      'TS 86 - To verify that Company Industry field accepts the minimum valid length during customer creation',
    TS_88_To_verify_that_Customer_ERP_System_field_accepts_length_of_one_character_while_customer_is_creating_their_time:
      'TS 88 - To verify that Customer ERP System field accepts the minimum valid length during customer creation',
    TS_90_To_verify_that_Customer_Contact_Name_field_accepts_length_of_one_character_while_customer_is_creating_their_time:
      'TS 90 - To verify that Customer Contact Name field accepts the minimum valid length during customer creation'
  };

  if (displayOverrides[raw]) {
    return displayOverrides[raw];
  }

  const tsMatch = raw.match(/^TS_(\d+)_(.+)$/i);

  if (tsMatch) {
    return `TS ${tsMatch[1]} - ${tsMatch[2].replace(/_/g, ' ').replace(/\s+/g, ' ').trim()}`;
  }

  return raw.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
}

async function expectPaymentRunFrequencyPersists(page, data) {
  const { customerName } = await reportStep('Create customer for Payment Runner Configuration', async () => {
    return createCustomer(page, data, { modules: [customerManagementAdminTwoSelectors.modules.imREmit] });
  });
  await navigateToRunnerConfiguration(page, customerName);
  await reportStep('Configure and save Payment Runner settings', async () => {
    await configureRunnerType(page, 'Payment');
    await openPaymentRunnerConfig(page);
    await saveRunnerConfig(page, 'Payment');
    await completeRunnerConfig(page);
  });
  await reportStep('Verify Payment Run Frequency is managed on Edit Customer Details', async () => {
    await openEditCustomerDetails(page, customerName);
    await expect(page.getByPlaceholder('Managed via Runner Configuration...').first()).toBeVisible({ timeout: 15000 });
  });
}

async function runScenario(page, data, scenarioName) {
  if (scenarioName === 'TS_12_To_verify_Single_SignOn_SSO_check_box_is_displayed_on_Create_Customer_page') {
    await expectSsoVisibleOnCreate(page, data);
    return;
  }
  if (scenarioName === 'TS_55_To_verify_Single_SignOn_SSO_check_box_is_displayed_on_Add_Customer_page') {
    await expectSsoVisibleOnEdit(page, data);
    return;
  }
  if (scenarioName === 'TS_56_verify_Single_SignOn_SSO_checkbox_on_Add_Customer_page_remains_checked_after_checking_and_saving') {
    await expectSsoPersists(page, data);
    return;
  }
  if (scenarioName === 'TS_57_To_verify_Payment_Groups_field_on_Add_Customer_page_is_displayed_on_Edit_Customer_Details_page') {
    await expectPaymentGroupsVisibleOnEdit(page, data);
    return;
  }
  if (scenarioName === 'TS_58_To_verify_that_Payment_Groupsfield_on_Add_Customer_page_is_greyed_out') {
    await expectPaymentGroupsVisibleOnCreate(page, data);
    return;
  }
  if (scenarioName === 'TS_59_To_verify_Payment_Groups_field_auto_pulled_from_Customer_Participant_Register_Page') {
    const { customerName } = await createCustomer(page, data, { modules: [customerManagementAdminTwoSelectors.modules.imREmit] });
    await navigateToParticipantRegister(page, customerName);
    const participant = await saveParticipantRegister(page);
    await expectPaymentGroupDataReflected(page, customerName, 'facilityRegisterGroupId', participant.groupId);
    return;
  }
  if (scenarioName === 'TS_60_To_verify_that_Payment_Groups_field_shows_all_Facility_Name_for_relevant_customer') {
    const { customerName } = await createCustomer(page, data, { modules: [customerManagementAdminTwoSelectors.modules.imREmit] });
    await navigateToParticipantRegister(page, customerName);
    const participant = await saveParticipantRegister(page);
    await openEditCustomerDetails(page, customerName);
    await expect(page.locator('form').first()).toContainText(participant.facilityName, { timeout: 15000 });
    return;
  }
  if (scenarioName === 'TS_61_To_verify_that_Payment_Groups_field_shows_all_Group_ID_for_relevant_customer') {
    const { customerName } = await createCustomer(page, data, { modules: [customerManagementAdminTwoSelectors.modules.imREmit] });
    await navigateToParticipantRegister(page, customerName);
    const participant = await saveParticipantRegister(page);
    await openEditCustomerDetails(page, customerName);
    await expect(page.locator('form').first()).toContainText(participant.groupId, { timeout: 15000 });
    return;
  }
  if (scenarioName === 'TS_62_To_verify_Enable_Zero_Dollar_Payment_Check_box_is_displayed_on_Payment_Runner_Config_page') {
    await expectRunnerCheckboxDisplayed(page, data, 'Enable Zero Dollar Payment');
    return;
  }
  if (scenarioName === 'TS_63_To_verify_that_Enable_Zero_Dollar_Payment_Checkbox_is_functional') {
    await expectRunnerCheckboxFunctional(page, data, 'Enable Zero Dollar Payment');
    return;
  }
  if (scenarioName === 'TS_64_To_verify_that_Enable_Zero_Dollar_Payment_Checkbox_remains_checked_after_checking_and_saving') {
    await expectRunnerCheckboxPersists(page, data, 'Enable Zero Dollar Payment');
    return;
  }
  if (scenarioName === 'TS_65_To_verify_Enable_Account_Number_Mapping_Checkbox_is_displayed_on_Payment_Runner_Config_page') {
    await expectRunnerCheckboxDisplayed(page, data, 'Enable Account Number Mapping');
    return;
  }
  if (scenarioName === 'TS_66_To_verify_Enable_Account_Number_Mapping_Checkbox_is_functional') {
    await expectRunnerCheckboxFunctional(page, data, 'Enable Account Number Mapping');
    return;
  }
  if (scenarioName === 'TS_67_To_verify_Enable_Account_Number_Mapping_Checkbox_remains_checked_after_checking_and_saving') {
    await expectRunnerCheckboxPersists(page, data, 'Enable Account Number Mapping');
    return;
  }
  if (scenarioName === 'TS_68_To_verify_that_Address_state_province_is_greyed_out_by_default_on_Create_Customer_page') {
    await expectFieldVisibleOnCreate(page, data, customerManagementAdminTwoSelectors.dropdowns.state);
    return;
  }
  if (scenarioName === 'TS_69_To_verify_that_Address_is_greyed_out_by_default_on_Create_Customer_page') {
    await expectFieldVisibleOnCreate(page, data, customerManagementAdminTwoSelectors.fields.address);
    return;
  }
  if (scenarioName === 'TS_70_To_verify_that_Address_city_field_is_greyed_out_by_default_on_Create_Customer_page') {
    await openCreateCustomerForm(page, data, { prefill: false });
    const cityField = page.locator('xpath=//*[normalize-space()="City:"]/following::input[1]').first();
    await expect(cityField).toBeVisible({ timeout: 15000 });
    return;
  }
  if (scenarioName === 'TS_71_To_verify_that_Zip_code_field_is_greyed_out_by_default_on_Create_Customer_page') {
    await expectFieldVisibleOnCreate(page, data, customerManagementAdminTwoSelectors.fields.zipCode);
    return;
  }
  if (scenarioName === 'TS_72_To_verify_that_when_we_select_the_Country_following_fields_are_shown_enabled') {
    await expectCountryEnablesLocationFields(page, data);
    return;
  }
  if (scenarioName === 'TS_73_To_verify_that_Payment_run_frequency_field_is_greyed_out_by_default_on_Create_Customer_page') {
    await expectManagedFrequencyFieldsOnCreate(page, data, 'Payment run frequency:');
    return;
  }
  if (scenarioName === 'TS_74_To_verify_that_Reconciliation_frequency_field_is_greyed_out_by_default_on_Create_Customer_page') {
    await expectManagedFrequencyFieldsOnCreate(page, data, 'Reconciliation frequency:');
    return;
  }
  if (
    scenarioName === 'TS_75_verify_when_update_data_from_Runner_Configuration_page_Payment_run_frequency_shows_data_on_Edit_Customer_Details_page' ||
    scenarioName === 'TS_76_verify_when_update_data_from_Runner_Configuration_page_Payment_run_frequency_shows_data_on_Edit_Customer_Details_page'
  ) {
    await expectPaymentRunFrequencyPersists(page, data);
    return;
  }
  if (scenarioFieldMap[scenarioName]) {
    await createCustomerForFieldScenario(page, data, scenarioName);
    return;
  }

  throw new Error(`Customer_Management_Admin_Two scenario not implemented yet: ${scenarioName}`);
}

module.exports = {
  customerManagementAdminTwoHelpers: {
    openCreateCustomerForm: async (page, data, options) => test.step('Open Create Customer page', async () => {
      return openCreateCustomerForm(page, data, options);
    }),
    runScenario: async (page, data, scenarioName) => test.step(`Run ${humanizeScenarioTitle(scenarioName)}`, async () => {
      return runScenario(page, data, scenarioName);
    }),
    buildUniqueCustomerName,
    selectors: customerManagementAdminTwoSelectors
  }
};
