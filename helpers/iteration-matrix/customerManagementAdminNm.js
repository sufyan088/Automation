
const { expect, test } = require('@playwright/test');
const { resolveFirst, clickWithFallback, fillWithFallback } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { customerManagementAdminNmSelectors } = require('../../selectors/iteration-matrix/customerManagementAdminNm.selectors.js');

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
  if (moduleName === customerManagementAdminNmSelectors.modules.statementRecon) {
    return 'Statement Reconciliation';
  }
  return moduleName;
}

async function clickOptionByName(page, optionName) {
  const option = page.getByRole('option', { name: optionName, exact: true }).first();
  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click();
}

async function clickChoiceByName(page, optionName) {
  try {
    await clickOpenDropdownChoiceByName(page, optionName);
    return;
  } catch (error) {
    // Fall back to broader page candidates when no visible open-dropdown match exists.
  }

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
  const optionPattern = new RegExp(`(^|\\b)${escapeRegExp(optionName)}(\\b|$)`, 'i');
  const candidates = [
    page.locator('[role="listbox"] [role="option"]').filter({ hasText: optionPattern }).first(),
    page.locator('[data-radix-popper-content-wrapper] [role="option"]').filter({ hasText: optionPattern }).first(),
    page.locator('[data-radix-popper-content-wrapper] [data-radix-collection-item]').filter({ hasText: optionPattern }).first(),
    page.locator('[data-radix-popper-content-wrapper] > div > div').filter({ hasText: optionPattern }).first(),
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

async function optionOrButtonIsVisible(page, optionName) {
  const optionPattern = new RegExp(`(^|\\b)${escapeRegExp(optionName)}(\\b|$)`, 'i');
  const candidates = [
    page.getByRole('option', { name: optionName, exact: true }).first(),
    page.getByRole('button', { name: optionName, exact: true }).first(),
    page.getByText(optionName, { exact: true }).first(),
    page.locator('[data-radix-popper-content-wrapper]').getByText(optionPattern).first(),
    page.locator('[role="listbox"]').getByText(optionPattern).first()
  ];
  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      return true;
    }
  }
  return false;
}

async function clickFirstVisibleOption(page) {
  const visibleOpenDropdownOption = page.locator(
    '[role="listbox"] [role="option"], [data-radix-popper-content-wrapper] [role="option"], [data-radix-popper-content-wrapper] [data-radix-collection-item]'
  ).filter({ hasNot: page.locator('[aria-hidden="true"]') }).first();

  if (await visibleOpenDropdownOption.isVisible().catch(() => false)) {
    await visibleOpenDropdownOption.click();
    return;
  }

  const visibleOpenDropdownTextOption = page.locator('[data-radix-popper-content-wrapper] > div > div').first();
  if (await visibleOpenDropdownTextOption.isVisible().catch(() => false)) {
    await visibleOpenDropdownTextOption.click();
    return;
  }

  const option = page.getByRole('option').locator(':visible').first();
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
      await clickChoiceByName(page, String(optionName));
      return;
    }

    if (await optionOrButtonIsVisible(page, String(optionName))) {
      await clickChoiceByName(page, String(optionName));
      return;
    }
  }
  await clickFirstVisibleOption(page);
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

async function clickDropdown(page, candidates) {
  const result = await resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500 });
  await result.locator.click();
}

async function fillSearchField(page, candidates, value) {
  const result = await resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500 });
  await result.locator.fill(value);
  await waitForAppToSettle(page, 500);
}

async function waitForParentCustomerOptions(page) {
  await expect(async () => {
    const loadingCustomersVisible = await page.getByText('Loading customers...', { exact: true }).first().isVisible().catch(() => false);
    const loadingVisible = await page.getByText('Loading...', { exact: true }).first().isVisible().catch(() => false);
    expect(loadingCustomersVisible || loadingVisible).toBeFalsy();
  }).toPass({ timeout: 20000 });
}

async function openVisibleBankCombobox(page) {
  const candidates = [
    page.locator('xpath=//label[normalize-space()="Bank"]/following::*[@role="combobox" or self::button][1]').first(),
    page.getByRole('combobox').filter({ hasText: /Select a bank|Unidentified|Union Trust Bank|First American Bank/i }).first(),
    page.getByRole('button', { name: /select a bank/i }).first(),
    page.getByText(/Select a bank|Unidentified|Union Trust Bank|First American Bank/i).first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      return;
    }
  }

  for (const locator of candidates) {
    await locator.waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      return;
    }
  }

  throw new Error('Unable to open the Bank combobox.');
}

async function findCustomerRow(page, customerName) {
  const row = page.locator('table tbody tr').filter({ hasText: customerName }).first();
  await row.waitFor({ state: 'visible', timeout: 15000 });
  return row;
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

async function searchCustomerList(page, customerName) {
  await ensureCustomerManagementListPage(page);
  await fillSearchField(page, customerManagementAdminNmSelectors.searchFields.customerList, customerName);
  return findCustomerRow(page, customerName);
}

async function expectCustomerRowContains(page, customerName, expectedText) {
  const row = await searchCustomerList(page, customerName);
  await expect(row).toContainText(expectedText, { timeout: 15000 });
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

async function ensureCreateCustomerPage(page) {
  const customerManagementLink = page.getByRole('link', { name: 'Customer Management', exact: true }).first();
  if (!(await customerManagementLink.isVisible().catch(() => false))) {
    await clickWithFallback(page, customerManagementAdminNmSelectors.adminModule);
    await waitForAppToSettle(page, 1000);
  }
  if (!(await customerManagementLink.isVisible().catch(() => false))) {
    const createUrl = new URL('/app/admin/customer-management/create', page.url()).toString();
    await page.goto(createUrl, { waitUntil: 'domcontentloaded' });
  }
  if (!(await page.getByRole('heading', { name: 'Create Customer', exact: true }).first().isVisible().catch(() => false))) {
    await clickWithFallback(page, customerManagementAdminNmSelectors.customerManagementLink);
  }
  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true })).toBeVisible({ timeout: 15000 });
  if (!(await page.getByRole('heading', { name: 'Create Customer', exact: true }).first().isVisible().catch(() => false))) {
    await clickWithFallback(page, customerManagementAdminNmSelectors.addCustomerButton);
  }
  await expect(page.getByRole('heading', { name: 'Create Customer', exact: true })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Customer Details', exact: true })).toBeVisible({ timeout: 15000 });
}

async function fillBaseCustomerDetails(page, data, options = {}) {
  const customerName = options.customerName || buildUniqueCustomerName(data);
  await fillWithFallback(page, customerManagementAdminNmSelectors.fields.customerName, customerName);
  const programManagerControl = await resolveFirst(page, customerManagementAdminNmSelectors.dropdowns.programManager, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  const currentProgramManager = (await programManagerControl.locator.textContent().catch(() => '') || '').trim();
  if (!currentProgramManager || /select program manager/i.test(currentProgramManager)) {
    await programManagerControl.locator.click();
    await clickOptionWithFallback(page, [
      customerManagementAdminNmSelectors.programManagerOption,
      data.Username_ProgramManager,
      data.Username_ProjectManager,
      data.Username_Management
    ]);
  }
  await fillWithFallback(page, customerManagementAdminNmSelectors.fields.companyContactName, 'TestCompany');
  await fillWithFallback(page, customerManagementAdminNmSelectors.fields.companyIndustry, 'TestData');
  await selectDropdownValue(
    page,
    customerManagementAdminNmSelectors.dropdowns.country,
    customerManagementAdminNmSelectors.countryOption,
    [data.Country, data.CustomerCountry, 'USA']
  );
  await selectDropdownValue(
    page,
    customerManagementAdminNmSelectors.dropdowns.state,
    customerManagementAdminNmSelectors.stateOption,
    [data.State, data.CustomerState, 'Alaska']
  );
  await fillWithFallback(page, customerManagementAdminNmSelectors.fields.address, '141 W Main Ave');
  await fillWithFallback(page, customerManagementAdminNmSelectors.fields.city, 'Gastonia');
  await fillWithFallback(page, customerManagementAdminNmSelectors.fields.zipCode, data.ZipCode || '65753');
  await fillWithFallback(page, customerManagementAdminNmSelectors.fields.email, data.CustomerEmail || 'QAMammoth@test.com');
  await fillWithFallback(page, customerManagementAdminNmSelectors.fields.phone, data.CustomerPhone || '(704) 867-7427');
  await selectDropdownValue(
    page,
    customerManagementAdminNmSelectors.dropdowns.fileTransmissionMethod,
    customerManagementAdminNmSelectors.fileTransmissionMethodOption,
    [data.FileTransmissionMethod, data.TransmissionMethod, 'sFTP'],
    { allowMissingOptions: true }
  );
  await selectDropdownValue(
    page,
    customerManagementAdminNmSelectors.dropdowns.fileTransmissionType,
    customerManagementAdminNmSelectors.fileTransmissionTypeOption,
    [data.FileTransmissionType, data.TransmissionType, 'Payment File'],
    { allowMissingOptions: true }
  );
  await fillWithFallback(page, customerManagementAdminNmSelectors.fields.erpSystem, 'QATDATA');
  return { customerName };
}

async function openModuleDropdown(page) {
  await clickDropdown(page, customerManagementAdminNmSelectors.dropdowns.moduleSubscription);
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
  const description = customerManagementAdminNmSelectors.labels.selfFundingDescription;
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
  const matchedButton = await resolveFirst(page, customerManagementAdminNmSelectors.submitButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(matchedButton.locator).toBeVisible({ timeout: 15000 });
}

async function expectConditionalFieldVisible(page, candidates) {
  const matched = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 3000
  });
  await expect(matched.locator).toBeVisible({ timeout: 15000 });
}

async function expectConditionalFieldHidden(page, candidates) {
  for (const candidate of candidates) {
    const result = await resolveFirst(page, [candidate], {
      mustBeVisible: false,
      timeoutPerCandidate: 750
    }).catch(() => null);

    if (!result) {
      continue;
    }

    await expect(result.locator).toBeHidden({ timeout: 5000 });
    return;
  }
}

async function expectSelfFundingControls(page, moduleName, expectedStatus = customerManagementAdminNmSelectors.labels.selfFundingDisabled) {
  const card = await expectModuleSelected(page, moduleName);
  await expect(card.getByText(customerManagementAdminNmSelectors.labels.selfFundingDescription, { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(card.getByText(expectedStatus, { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(card.getByRole('switch')).toBeVisible({ timeout: 15000 });
  return card;
}

async function toggleSelfFunding(page, moduleName) {
  const card = await expectModuleSelected(page, moduleName);
  await card.getByRole('switch').click();
  await expect(card.getByText(customerManagementAdminNmSelectors.labels.selfFundingEnabled, { exact: true })).toBeVisible({ timeout: 15000 });
}

async function submitCustomer(page) {
  await clickWithFallback(page, customerManagementAdminNmSelectors.submitButton);
  await waitForAppToSettle(page, 1000);
  try {
    const matchedToast = await resolveFirst(page, customerManagementAdminNmSelectors.successToast, {
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

async function submitEditedCustomer(page) {
  await clickWithFallback(page, customerManagementAdminNmSelectors.saveEditedCustomerButton);
  await waitForAppToSettle(page, 1000);
  try {
    const matchedToast = await resolveFirst(page, customerManagementAdminNmSelectors.updateSuccessToast, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    await expect(matchedToast.locator).toBeVisible({ timeout: 5000 });
  } catch (error) {
    const editHeadingVisible = await page.getByRole('heading', { name: 'Edit Customer', exact: true }).first().isVisible().catch(() => false);
    if (editHeadingVisible) {
      const backToListTargets = [
        page.getByRole('link', { name: /back to list/i }).first(),
        page.getByRole('button', { name: /back to list/i }).first(),
        page.getByText('Back to list', { exact: true }).first()
      ];

      for (const locator of backToListTargets) {
        if (await locator.isVisible().catch(() => false)) {
          await locator.click().catch(() => null);
          break;
        }
      }
    }

    await expect(page).toHaveURL(/\/app\/admin\/customer-management(?:\?.*)?$/i, { timeout: 15000 });
  }
}

async function selectBank(page, preferredBank, fallbackBanks = []) {
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.conditionalFields.bankLabel);
  await openVisibleBankCombobox(page);

  const bankNames = [preferredBank, ...fallbackBanks].filter((value) => String(value || '').trim());
  for (const bankName of bankNames) {
    if (await optionOrButtonIsVisible(page, String(bankName))) {
      await clickChoiceByName(page, String(bankName));
      return String(bankName);
    }
  }

  throw new Error(`Unable to select a bank from the available choices: ${bankNames.join(', ')}`);
}

async function selectParentCustomer(page, preferredParent, fallbackParents = []) {
  await clickDropdown(page, customerManagementAdminNmSelectors.conditionalFields.parentCustomerDropdown);
  await waitForParentCustomerOptions(page);

  const candidates = [preferredParent, ...fallbackParents].filter((value) => String(value || '').trim());
  for (const candidate of candidates) {
    await fillSearchField(page, customerManagementAdminNmSelectors.searchFields.parentCustomerSearch, String(candidate));
    await waitForParentCustomerOptions(page);

    const parentTargets = [
      page.getByRole('option', { name: String(candidate), exact: true }).first(),
      page.getByRole('option', { name: new RegExp(escapeRegExp(String(candidate)), 'i') }).first(),
      page.locator('[role="dialog"]').getByText(String(candidate), { exact: true }).first(),
      page.locator('[role="dialog"]').getByText(new RegExp(escapeRegExp(String(candidate)), 'i')).first(),
      page.locator('span.font-medium').filter({ hasText: new RegExp(escapeRegExp(String(candidate)), 'i') }).first(),
      page.getByText(String(candidate), { exact: true }).first(),
      page.getByText(new RegExp(escapeRegExp(String(candidate)), 'i')).first(),
      page.getByRole('combobox').filter({ hasText: String(candidate) }).first()
    ];

    for (const locator of parentTargets) {
      if (await locator.isVisible().catch(() => false)) {
        await locator.click().catch(() => null);
        await page.keyboard.press('Enter').catch(() => null);
        await page.keyboard.press('Escape').catch(() => null);
        return String(candidate);
      }
    }

    if (await optionOrButtonIsVisible(page, String(candidate))) {
      await clickChoiceByName(page, String(candidate));
      await page.keyboard.press('Escape').catch(() => null);
      return String(candidate);
    }
  }

  throw new Error('Unable to select a parent customer from the available choices.');
}

async function createCustomerWithModules(page, data, moduleNames, options = {}) {
  const openResult = await openCreateCustomerForm(page, data);
  const customerName = options.customerName || openResult.customerName;

  await selectModules(page, moduleNames);

  if (moduleNames.includes(customerManagementAdminNmSelectors.modules.imREmitLite)) {
    await expectBankAssociationVisible(page);
    await expectParentCustomerVisible(page);
  }

  if (options.bankName || options.fallbackBanks?.length) {
    await selectBank(page, options.bankName, options.fallbackBanks || []);
  }

  if (options.parentCustomerName || options.fallbackParents?.length) {
    await selectParentCustomer(page, options.parentCustomerName, options.fallbackParents || []);
  }

  await submitCustomer(page);
  return { customerName };
}

async function createLiteCustomerWithAssociations(page, data, options = {}) {
  return createCustomerWithModules(
    page,
    data,
    [customerManagementAdminNmSelectors.modules.imREmitLite],
    options
  );
}

async function createImREmitCustomer(page, data, options = {}) {
  return createCustomerWithModules(
    page,
    data,
    [customerManagementAdminNmSelectors.modules.imREmit],
    options
  );
}

async function editCustomerBank(page, customerName, nextBankName, fallbackBanks = []) {
  await openCustomerAction(page, customerName, customerManagementAdminNmSelectors.actionMenuItems.editCustomerDetails);
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.conditionalFields.bankLabel);
  await selectBank(page, nextBankName, fallbackBanks);
  await submitCustomer(page);
}

async function viewCustomerProfile(page, customerName) {
  await openCustomerAction(page, customerName, customerManagementAdminNmSelectors.actionMenuItems.viewCustomerProfile);
}

async function openImREmitEditDetails(page, customerName) {
  await openCustomerAction(page, customerName, customerManagementAdminNmSelectors.actionMenuItems.imREmitEditDetails);
}

async function expectViewProfileBank(page, bankName) {
  await expect(page.getByText(bankName, { exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function expectViewProfileParentCustomer(page, parentCustomerName) {
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.viewProfile.parentCustomerHeading);
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.conditionalFields.parentCustomerDescription);
  await expect(page.getByText(parentCustomerName, { exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function openBankManagementModal(page) {
  await clickWithFallback(page, customerManagementAdminNmSelectors.bankManagement.addEditButton);
  const matchedHeading = await resolveFirst(page, customerManagementAdminNmSelectors.bankManagement.modalHeading, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(matchedHeading.locator).toBeVisible({ timeout: 5000 });
}

async function addBankInModal(page, bankName) {
  await fillWithFallback(page, customerManagementAdminNmSelectors.bankManagement.bankNameInput, bankName);
  await clickWithFallback(page, customerManagementAdminNmSelectors.bankManagement.addButton);
  const matchedToast = await resolveFirst(page, customerManagementAdminNmSelectors.bankToast, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(matchedToast.locator).toBeVisible({ timeout: 5000 });
}

async function editBankInModal(page, currentBankName, nextBankName) {
  const modal = page.locator('[role="dialog"]').first();
  const row = modal.locator('table tbody tr').filter({ hasText: currentBankName }).first();
  await row.waitFor({ state: 'visible', timeout: 15000 });
  await row.scrollIntoViewIfNeeded().catch(() => null);

  const editTargets = [
    row.getByRole('button', { name: /edit/i }).first(),
    row.getByText(/edit/i).first(),
    row.locator('button').first()
  ];

  let editClicked = false;
  for (const locator of editTargets) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      editClicked = true;
      break;
    }
  }

  if (!editClicked) {
    throw new Error(`Unable to start bank edit for ${currentBankName}.`);
  }

  const editableInput = modal.locator('table tbody input[placeholder="Enter bank name..."]').first();
  await editableInput.waitFor({ state: 'visible', timeout: 15000 });
  await editableInput.scrollIntoViewIfNeeded().catch(() => null);
  const editableRow = editableInput.locator('xpath=ancestor::tr[1]');
  await editableRow.waitFor({ state: 'visible', timeout: 15000 });
  await editableInput.fill(nextBankName);

  const saveTargets = [
    editableRow.locator('button').first(),
    editableRow.getByRole('button', { name: /save/i }).first(),
    editableRow.locator('button[title*="Save"]').first(),
    editableRow.locator('button').nth(1)
  ];

  for (const locator of saveTargets) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.scrollIntoViewIfNeeded().catch(() => null);
      await locator.click();
      await waitForAppToSettle(page, 750);

      const updatedRow = modal.locator('table tbody tr').filter({ hasText: nextBankName }).first();
      const updateConfirmed = await updatedRow.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);

      if (!updateConfirmed) {
        try {
          const matchedToast = await resolveFirst(page, customerManagementAdminNmSelectors.bankToast, {
            mustBeVisible: true,
            timeoutPerCandidate: 3000
          });
          await expect(matchedToast.locator).toBeVisible({ timeout: 3000 });
        } catch (error) {
          // Fall through to the final error below if neither the row update nor a toast confirms success.
        }
      } else {
        await expect(updatedRow).toContainText(nextBankName, { timeout: 5000 });
        return;
      }

      const updateAfterToast = await updatedRow.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
      if (updateAfterToast) {
        await expect(updatedRow).toContainText(nextBankName, { timeout: 5000 });
        return;
      }
    }
  }

  throw new Error(`Unable to save edited bank ${nextBankName}.`);
}

async function updateCustomerFromProfile(page, customerName, nextContactName) {
  await viewCustomerProfile(page, customerName);
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.viewProfile.heading);
  await clickWithFallback(page, customerManagementAdminNmSelectors.viewProfile.editCustomerButton);
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.editCustomerHeading);
  await fillWithFallback(page, customerManagementAdminNmSelectors.fields.companyContactName, nextContactName);
  await submitEditedCustomer(page);
}

async function expectCustomerContactNameAfterProfileEdit(page, customerName, expectedContactName) {
  await viewCustomerProfile(page, customerName);
  await clickWithFallback(page, customerManagementAdminNmSelectors.viewProfile.editCustomerButton);
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.editCustomerHeading);
  const matchedField = await resolveFirst(page, customerManagementAdminNmSelectors.fields.companyContactName, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(matchedField.locator).toHaveValue(expectedContactName, { timeout: 15000 });
}

async function clickWizardNext(page) {
  await clickWithFallback(page, customerManagementAdminNmSelectors.wizard.nextButton);
  await waitForAppToSettle(page, 750);
}

async function isWizardNextEnabled(page) {
  const matchedButton = await resolveFirst(page, customerManagementAdminNmSelectors.wizard.nextButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  return !(await matchedButton.locator.isDisabled());
}

async function ensurePaymentMethodCanContinue(page) {
  if (await isWizardNextEnabled(page)) {
    return;
  }

  const providerPlaceholderVisible = await page.getByRole('button', { name: /select payment provider name/i }).first().isVisible().catch(() => false);

  if (providerPlaceholderVisible) {
    const providerControl = page.getByRole('button', { name: /select payment provider name/i }).first();
    await providerControl.click();
    await clickOpenDropdownChoiceByName(page, 'J.P. Morgan');
    await waitForAppToSettle(page, 500);
  }

  await clickDropdown(page, customerManagementAdminNmSelectors.wizard.paymentMethodDropdown);
  try {
    await clickOpenDropdownChoiceByName(page, 'SUA');
  } catch (error) {
    await clickOptionWithFallback(page, ['SUA']);
  }
  await waitForAppToSettle(page, 500);

  await fillWithFallback(page, customerManagementAdminNmSelectors.wizard.customerPaymentMethodInput, 'Credit Card');
  await fillWithFallback(page, customerManagementAdminNmSelectors.wizard.paymentMethodDescriptionInput, 'This is for test');
  await clickWithFallback(page, customerManagementAdminNmSelectors.wizard.savePaymentMethodButton);

  try {
    const matchedToast = await resolveFirst(page, customerManagementAdminNmSelectors.wizard.paymentMethodSuccessToast, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    await expect(matchedToast.locator).toBeVisible({ timeout: 5000 });
  } catch (error) {
    await waitForAppToSettle(page, 1500);
  }

  await expect(async () => {
    expect(await isWizardNextEnabled(page)).toBeTruthy();
  }).toPass({ timeout: 20000 });
}

async function configureRunnerType(page, runnerType) {
  await clickDropdown(page, customerManagementAdminNmSelectors.wizard.runnerTypeDropdown);
  await clickChoiceByName(page, runnerType);
  await waitForAppToSettle(page, 750);
}

async function openReconRunnerConfig(page) {
  await clickWithFallback(page, customerManagementAdminNmSelectors.wizard.openReconRunnerConfigButton);
  await waitForAppToSettle(page, 750);
}

function getToggleByLabel(page, labelText) {
  return page.locator(
    `xpath=//label[contains(normalize-space(), ${toXPathLiteral(labelText)})]/following::*[(self::button or @role="switch")][1]`
  ).first();
}

async function expectToggleCheckedByLabel(page, labelText) {
  const toggle = getToggleByLabel(page, labelText);
  await expect(toggle).toBeVisible({ timeout: 15000 });
  await expect(toggle).toHaveAttribute('data-state', 'checked', { timeout: 15000 });
}

async function ensureToggleCheckedByLabel(page, labelText) {
  const toggle = getToggleByLabel(page, labelText);
  await expect(toggle).toBeVisible({ timeout: 15000 });

  if ((await toggle.getAttribute('data-state')) !== 'checked') {
    await toggle.click();
  }

  await expect(toggle).toHaveAttribute('data-state', 'checked', { timeout: 15000 });
}

async function saveRunnerConfig(page) {
  await clickWithFallback(page, customerManagementAdminNmSelectors.wizard.addReconRunnerConfigButton);
  await waitForAppToSettle(page, 1000);
}

async function completeRunnerConfig(page) {
  await clickWithFallback(page, customerManagementAdminNmSelectors.wizard.completeRunnerConfigButton);
  await waitForAppToSettle(page, 1000);
}

async function expectRunnerCheckboxChecked(page, customerName, labelText) {
  await openImREmitEditDetails(page, customerName);
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.wizard.emailConfigurationHeading);
  await clickWizardNext(page);
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.wizard.paymentMethodHeading);
  await ensurePaymentMethodCanContinue(page);
  await clickWizardNext(page);
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.wizard.participantRegisterHeading);
  await clickWizardNext(page);

  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.wizard.runnerConfigurationHeading);
  await configureRunnerType(page, 'Recon');
  await openReconRunnerConfig(page);
  await ensureToggleCheckedByLabel(page, labelText);
  await saveRunnerConfig(page);

  const completeVisible = await page.getByRole('button', { name: /^complete$/i }).first().isVisible().catch(() => false);
  if (completeVisible) {
    await completeRunnerConfig(page);
  }

  const customerManagementVisible = await page.getByRole('heading', { name: 'Customer Management', exact: true }).first().isVisible().catch(() => false);
  if (customerManagementVisible) {
    await openImREmitEditDetails(page, customerName);
    await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.wizard.emailConfigurationHeading);
    await clickWizardNext(page);
    await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.wizard.paymentMethodHeading);
    await clickWizardNext(page);
    await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.wizard.participantRegisterHeading);
    await clickWizardNext(page);
    await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.wizard.runnerConfigurationHeading);
    await configureRunnerType(page, 'Recon');
  }

  const canReopenReconConfig = await page.getByRole('button', { name: /open recon runner config/i }).first().isVisible().catch(() => false);
  if (canReopenReconConfig) {
    await openReconRunnerConfig(page);
  }

  await expectToggleCheckedByLabel(page, labelText);
}

async function verifyRoleCanAddEditBanks(page, data) {
  await ensureCreateCustomerPage(page);
  await selectModules(page, [customerManagementAdminNmSelectors.modules.imREmitLite]);
  await expectBankAssociationVisible(page);
  await openBankManagementModal(page);

  const createdBankName = `Bank${Date.now()}`;
  const updatedBankName = `${createdBankName}UK`;

  await addBankInModal(page, createdBankName);
  await editBankInModal(page, createdBankName, updatedBankName);

  return { createdBankName, updatedBankName };
}

async function createMultipleChildrenForParent(page, data) {
  const parent = await createLiteCustomerWithAssociations(page, data, {});
  const childOne = await createLiteCustomerWithAssociations(page, data, {
    parentCustomerName: parent.customerName,
    fallbackParents: [parent.customerName]
  });
  const childTwo = await createLiteCustomerWithAssociations(page, data, {
    parentCustomerName: parent.customerName,
    fallbackParents: [parent.customerName]
  });

  await searchCustomerList(page, childOne.customerName);
  await searchCustomerList(page, childTwo.customerName);

  return { parent, childOne, childTwo };
}

async function openCreateCustomerForm(page, data) {
  await ensureCreateCustomerPage(page);
  return fillBaseCustomerDetails(page, data);
}

async function expectBankAssociationVisible(page) {
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.sections.bankAssociationHeading);
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.conditionalFields.bankLabel);
}

async function expectParentCustomerVisible(page) {
  await expectConditionalFieldVisible(page, customerManagementAdminNmSelectors.conditionalFields.parentCustomerDropdown);
}

async function expectBankAssociationHidden(page) {
  await expectConditionalFieldHidden(page, customerManagementAdminNmSelectors.sections.bankAssociationHeading);
  await expectConditionalFieldHidden(page, customerManagementAdminNmSelectors.conditionalFields.bankLabel);
}

async function expectParentCustomerHidden(page) {
  await expectConditionalFieldHidden(page, customerManagementAdminNmSelectors.conditionalFields.parentCustomerDropdown);
}

module.exports = {
  customerManagementAdminNmHelpers: {
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
    expectBankAssociationVisible: async (page) => test.step('Verify Bank Association field is visible', async () => {
      return expectBankAssociationVisible(page);
    }),
    expectParentCustomerVisible: async (page) => test.step('Verify Parent Customer field is visible', async () => {
      return expectParentCustomerVisible(page);
    }),
    expectBankAssociationHidden: async (page) => test.step('Verify Bank Association field is hidden', async () => {
      return expectBankAssociationHidden(page);
    }),
    expectParentCustomerHidden: async (page) => test.step('Verify Parent Customer field is hidden', async () => {
      return expectParentCustomerHidden(page);
    }),
    createCustomerWithModules: async (page, data, moduleNames, options) => test.step(
      `Create customer with modules ${moduleNames.join(', ')}`,
      async () => createCustomerWithModules(page, data, moduleNames, options)
    ),
    createLiteCustomerWithAssociations: async (page, data, options) => test.step('Create imREmit Lite customer with associations', async () => {
      return createLiteCustomerWithAssociations(page, data, options);
    }),
    createImREmitCustomer: async (page, data, options) => test.step('Create imREmit customer', async () => {
      return createImREmitCustomer(page, data, options);
    }),
    expectCustomerRowContains: async (page, customerName, expectedText) => test.step(
      `Verify ${customerName} row contains ${expectedText}`,
      async () => expectCustomerRowContains(page, customerName, expectedText)
    ),
    editCustomerBank: async (page, customerName, nextBankName, fallbackBanks) => test.step(
      `Update bank for ${customerName} to ${nextBankName}`,
      async () => editCustomerBank(page, customerName, nextBankName, fallbackBanks)
    ),
    viewCustomerProfile: async (page, customerName) => test.step(
      `Open customer profile for ${customerName}`,
      async () => viewCustomerProfile(page, customerName)
    ),
    openImREmitEditDetails: async (page, customerName) => test.step(
      `Open imREmit Edit Details for ${customerName}`,
      async () => openImREmitEditDetails(page, customerName)
    ),
    expectViewProfileBank: async (page, bankName) => test.step(
      `Verify bank ${bankName} on customer profile`,
      async () => expectViewProfileBank(page, bankName)
    ),
    expectViewProfileParentCustomer: async (page, parentCustomerName) => test.step(
      `Verify parent customer ${parentCustomerName} on customer profile`,
      async () => expectViewProfileParentCustomer(page, parentCustomerName)
    ),
    verifyRoleCanAddEditBanks: async (page, data) => test.step('Verify Add/Edit Banks is functional for the current role', async () => {
      return verifyRoleCanAddEditBanks(page, data);
    }),
    updateCustomerFromProfile: async (page, customerName, nextContactName) => test.step(
      `Update customer ${customerName} from profile page`,
      async () => updateCustomerFromProfile(page, customerName, nextContactName)
    ),
    expectCustomerContactNameAfterProfileEdit: async (page, customerName, expectedContactName) => test.step(
      `Verify edited contact name ${expectedContactName} for ${customerName}`,
      async () => expectCustomerContactNameAfterProfileEdit(page, customerName, expectedContactName)
    ),
    expectRunnerCheckboxChecked: async (page, customerName, labelText) => test.step(
      `Verify ${labelText} is checked for ${customerName}`,
      async () => expectRunnerCheckboxChecked(page, customerName, labelText)
    ),
    createMultipleChildrenForParent: async (page, data) => test.step('Create multiple child customers linked to one parent customer', async () => {
      return createMultipleChildrenForParent(page, data);
    }),
    submitCustomer: async (page) => test.step('Submit Create Customer form', async () => {
      return submitCustomer(page);
    }),
    buildUniqueCustomerName,
    selectors: customerManagementAdminNmSelectors
  }
};
