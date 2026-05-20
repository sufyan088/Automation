const { test } = require('@playwright/test');
const { cardOnFileSelectors } = require('../../selectors/iteration-matrix/cardOnFile.selectors.js');

const errorPageSelectors = [
  'h1:has-text("We encountered an issue")',
  'main:has-text("Error details")'
];

const errorRecoverySelectors = [
  'button:has-text("Go home")',
  'button:has-text("Refresh page")'
];

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const locator = await waitForFirstVisible(page, selectors, timeout);
    await locator.scrollIntoViewIfNeeded().catch(() => null);

    try {
      await locator.click({ timeout: 5000 });
      return locator;
    } catch (error) {
      const message = String(error?.message || '');
      if (/outside of the viewport|intercepts pointer events|subtree intercepts pointer events/i.test(message)) {
        await locator.click({ timeout: 5000, force: true }).catch(() => null);
        if (await locator.isVisible().catch(() => false)) {
          return locator;
        }
      }
      lastError = error;
      await page.waitForTimeout(500);
    }
  }

  throw lastError;
}

async function fillFirstVisible(page, selectors, value, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  await locator.fill('');
  await locator.fill(String(value));
  return locator;
}

async function chooseDropdownValue(page, triggerSelectors, optionSelectors, preferredValues = []) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const trigger = await clickFirstVisible(page, triggerSelectors);

    for (const preferredValue of preferredValues) {
      if (!String(preferredValue || '').trim()) {
        continue;
      }

      const option = await waitForFirstVisible(page, optionSelectors(preferredValue), 3000).catch(() => null);
      if (option) {
        await option.click();
        return;
      }
    }

    await page.keyboard.press('ArrowDown').catch(() => null);
    await page.keyboard.press('Enter').catch(() => null);
    await page.waitForTimeout(500);

    const triggerText = ((await trigger.textContent().catch(() => '')) || '').trim();
    if (triggerText && !/select country|select state|please select country first/i.test(triggerText)) {
      return;
    }

    const genericOption = await waitForFirstVisible(page, [
      '[role="option"]',
      'div[role="option"]',
      '[cmdk-item]',
      '[data-radix-collection-item]'
    ], 3000).catch(() => null);

    if (genericOption) {
      await genericOption.click();
      return;
    }
  }

  throw new Error(`Could not choose a dropdown value for selectors: ${triggerSelectors.join(', ')}`);
}

async function isErrorPageVisible(page) {
  for (const selector of errorPageSelectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      return true;
    }
  }

  return false;
}

async function recoverFromErrorPage(page) {
  if (!await isErrorPageVisible(page)) {
    return false;
  }

  await clickFirstVisible(page, errorRecoverySelectors);
  await page.waitForLoadState('domcontentloaded').catch(() => null);
  await page.waitForTimeout(1000);
  return true;
}

async function isSupplierManagementReady(page) {
  const isSupplierManagementUrl = /\/supplier-management(\/|$|\?|#)/i.test(page.url());
  const readySelectors = [
    ...cardOnFileSelectors.editSupplier.addSupplierButton,
    'h1:has-text("Supplier Management")',
    'h2:has-text("Supplier Management")'
  ];

  for (const selector of readySelectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      return isSupplierManagementUrl || !/\/invoices\//i.test(page.url());
    }
  }

  return false;
}

function isImremitModuleUrl(page) {
  return /\/app\/imremit(\/|$|\?|#)/i.test(page.url());
}

async function openModule(page) {
  const moduleHeading = page.getByRole('heading', { name: /imremit/i }).first();
  if (isImremitModuleUrl(page) && await moduleHeading.isVisible().catch(() => false)) {
    return page;
  }

  const tileTargets = [
    page.getByRole('link', { name: /imremit/i }).first(),
    page.getByRole('button', { name: /imremit/i }).first(),
    page.locator('[class*="justify-center"][class*="items-center"]').filter({ hasText: /imremit/i }).first(),
    page.getByText('imREmit', { exact: true }).first()
  ];

  for (const target of tileTargets) {
    if (await target.isVisible().catch(() => false)) {
      await target.scrollIntoViewIfNeeded().catch(() => null);
      try {
        await target.click({ timeout: 5000 });
      } catch (error) {
        const message = String(error?.message || '');
        if (!/outside of the viewport|intercepts pointer events|subtree intercepts pointer events/i.test(message)) {
          throw error;
        }

        await target.click({ timeout: 5000, force: true });
      }

      await page.waitForURL(/\/app\/imremit(\/|$|\?|#)/i, { timeout: 15000 }).catch(() => null);
      if (await recoverFromErrorPage(page)) {
        continue;
      }
      await waitForFirstVisible(page, cardOnFileSelectors.moduleHeading);
      return page;
    }
  }

  await clickFirstVisible(page, cardOnFileSelectors.moduleEntry);
  await page.waitForURL(/\/app\/imremit(\/|$|\?|#)/i, { timeout: 15000 }).catch(() => null);
  if (await recoverFromErrorPage(page)) {
    await clickFirstVisible(page, cardOnFileSelectors.moduleEntry);
    await page.waitForURL(/\/app\/imremit(\/|$|\?|#)/i, { timeout: 15000 }).catch(() => null);
  }
  await waitForFirstVisible(page, cardOnFileSelectors.moduleHeading);
  return page;
}

async function openSupplierManagement(page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (await isSupplierManagementReady(page)) {
      return;
    }

    await clickFirstVisible(page, cardOnFileSelectors.supplierManagementLink);
    await page.waitForURL(/\/supplier-management(\/|$|\?|#)/i, { timeout: 15000 }).catch(() => null);
    await page.waitForLoadState('domcontentloaded').catch(() => null);

    if (await recoverFromErrorPage(page)) {
      await openModule(page);
      continue;
    }

    if (await isSupplierManagementReady(page)) {
      return;
    }

    await page.waitForTimeout(1000);
  }

  await waitForFirstVisible(page, [
    ...cardOnFileSelectors.editSupplier.addSupplierButton,
    'h1:has-text("Supplier Management")',
    'h2:has-text("Supplier Management")'
  ], 30000);
}

async function ensureCustomerSelected(page, customerName = 'Cadent') {
  const selectedChip = page.locator(cardOnFileSelectors.customerPicker.selectedChip(customerName)[0]).first();
  if (await selectedChip.isVisible().catch(() => false)) {
    return;
  }

  const trigger = await waitForFirstVisible(page, cardOnFileSelectors.customerPicker.trigger);
  await trigger.click({ timeout: 5000 });
  await fillFirstVisible(page, cardOnFileSelectors.customerPicker.searchInput, customerName);
  await page.waitForTimeout(1000);

  const optionVisible = await page.locator(cardOnFileSelectors.customerPicker.option(customerName)[0]).first().isVisible().catch(() => false)
    || await page.locator(cardOnFileSelectors.customerPicker.option(customerName)[1]).first().isVisible().catch(() => false);

  if (optionVisible) {
    await clickFirstVisible(page, cardOnFileSelectors.customerPicker.option(customerName));
    await page.waitForTimeout(1000);
  }

  await page.keyboard.press('Escape').catch(() => null);
  await page.waitForTimeout(250);

  const chipVisible = await page.locator(cardOnFileSelectors.customerPicker.selectedChip(customerName)[0]).first().isVisible().catch(() => false)
    || await page.locator(cardOnFileSelectors.customerPicker.selectedChip(customerName)[1]).first().isVisible().catch(() => false);

  if (!chipVisible) {
    await page.keyboard.press('Escape').catch(() => null);
  }
}

async function selectCustomerOnAddSupplier(page, customerName = 'Cadent') {
  const heading = page.getByRole('heading', { name: /add supplier/i }).first();
  if (!await heading.isVisible().catch(() => false)) {
    return;
  }

  const currentSelection = page.getByRole('combobox').filter({ hasText: new RegExp(escapeRegExp(customerName), 'i') }).first();
  if (await currentSelection.isVisible().catch(() => false)) {
    return;
  }

  await clickFirstVisible(page, cardOnFileSelectors.customerPicker.trigger);

  const searchInput = await waitForFirstVisible(page, cardOnFileSelectors.customerPicker.searchInput, 5000).catch(() => null);
  if (searchInput) {
    await searchInput.fill('');
    await searchInput.fill(customerName);
    await page.waitForTimeout(750);
  }

  await clickFirstVisible(page, cardOnFileSelectors.customerPicker.option(customerName));
  await page.waitForTimeout(750);
  await page.keyboard.press('Escape').catch(() => null);
}

async function openSupplierManagementForCustomer(page, customerName = 'Cadent') {
  await openModule(page);
  await openSupplierManagement(page);
  await ensureCustomerSelected(page, customerName);
}

async function searchSuppliers(page, value) {
  await fillFirstVisible(page, cardOnFileSelectors.supplierList.searchInput, value);
  await waitForFirstVisible(page, cardOnFileSelectors.supplierList.table);
  await page.waitForTimeout(1500);
}

async function expectTableContainsText(page, text) {
  await page.locator('table').first().waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForFunction((expectedText) => {
    const table = document.querySelector('table');
    return Boolean(table) && (table.textContent || '').includes(expectedText);
  }, text, { timeout: 30000 });
}

async function openFirstRowActionsMenu(page) {
  await clickFirstVisible(page, cardOnFileSelectors.supplierList.actionsButton);
}

async function openEditSupplierDetails(page, supplierName) {
  if (supplierName) {
    await searchSuppliers(page, supplierName);
    await expectTableContainsText(page, supplierName);
  }

  await openFirstRowActionsMenu(page);
  await clickFirstVisible(page, cardOnFileSelectors.supplierList.editSupplierDetails);
  await waitForFirstVisible(page, cardOnFileSelectors.editSupplier.heading);
}

async function ensureSupplierEnrollmentYes(page) {
  await clickFirstVisible(page, cardOnFileSelectors.editSupplier.supplierEnrollmentYes);
}

async function selectCardOnFile(page) {
  await clickFirstVisible(page, cardOnFileSelectors.editSupplier.cardOnFile);
}

async function selectSingleUseCard(page) {
  await clickFirstVisible(page, cardOnFileSelectors.editSupplier.singleUseCard);
}

async function chooseRemittanceMethod(page, methodName) {
  await clickFirstVisible(page, cardOnFileSelectors.editSupplier.remittanceMethodTrigger);
  await clickFirstVisible(page, cardOnFileSelectors.editSupplier.remittanceMethodOption(methodName));
}

async function populateRequiredSupplierProfile(page, overrides = {}) {
  const supplier = {
    ...buildUniqueSupplier(),
    ...overrides
  };

  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.supplierContactNameInput, supplier.contactName);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.contactEmailInput, supplier.contactEmail);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.taxIdInput, supplier.taxId);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.address1Input, supplier.address1);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.address2Input, supplier.address2);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.address3Input, supplier.address3);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.address4Input, supplier.address4);
  await chooseDropdownValue(page, cardOnFileSelectors.editSupplier.countryTrigger, cardOnFileSelectors.editSupplier.countryOption, [supplier.country, 'USA', 'United States']);
  await chooseDropdownValue(page, cardOnFileSelectors.editSupplier.stateTrigger, cardOnFileSelectors.editSupplier.stateOption, [supplier.state, 'Alaska']);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.cityInput, supplier.city);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.zipInput, supplier.zip);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.locationCodeInput, supplier.locationCode);

  return supplier;
}

async function expectVisible(page, selectors) {
  await waitForFirstVisible(page, selectors);
}

async function expectNotVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      throw new Error(`Selector should not be visible: ${selector}`);
    }
  }
}

async function expectInputEditable(page, selectors) {
  const input = await waitForFirstVisible(page, selectors);
  const disabled = await input.isDisabled().catch(() => false);
  if (disabled) {
    throw new Error('Expected input to be editable, but it is disabled.');
  }
}

async function expectInputDisabled(page, selectors) {
  const input = await waitForFirstVisible(page, selectors);
  const disabled = await input.isDisabled().catch(() => false);
  const readonly = await input.evaluate((node) => node.hasAttribute('readonly')).catch(() => false);
  if (!disabled && !readonly) {
    throw new Error('Expected input to be disabled or readonly.');
  }
}

async function expectInputInvalid(page, selectors) {
  const input = await waitForFirstVisible(page, selectors);
  const invalid = await input.getAttribute('aria-invalid');
  const describedBy = await input.getAttribute('aria-describedby');
  if (invalid === 'true') {
    return;
  }

  if (describedBy) {
    const message = page.locator(`#${describedBy}`).first();
    if (await message.isVisible().catch(() => false)) {
      return;
    }
  }

  throw new Error('Expected input to be marked invalid.');
}

async function expectRadioEnabled(page, selectors) {
  const control = await waitForFirstVisible(page, selectors);
  const target = await resolveAssociatedControl(control);
  const disabled = await target.isDisabled().catch(() => false);
  if (disabled) {
    throw new Error('Expected radio control to be enabled.');
  }
}

async function expectRadioDisabled(page, selectors) {
  const control = await waitForFirstVisible(page, selectors);
  const target = await resolveAssociatedControl(control);
  const disabled = await target.isDisabled().catch(() => false);
  if (!disabled) {
    throw new Error('Expected radio control to be disabled.');
  }
}

async function resolveAssociatedControl(locator) {
  const tagName = await locator.evaluate((node) => node.tagName.toLowerCase()).catch(() => '');
  if (tagName !== 'label') {
    return locator;
  }

  const htmlFor = await locator.getAttribute('for');
  if (!htmlFor) {
    return locator;
  }

  return locator.page().locator(`#${htmlFor}`).first();
}

async function expectFlagResetVisible(page) {
  await expectVisible(page, cardOnFileSelectors.editSupplier.flagResetButton);
}

async function expectFlagResetNotVisible(page) {
  await expectNotVisible(page, cardOnFileSelectors.editSupplier.flagResetButton);
}

async function clickFlagReset(page) {
  await clickFirstVisible(page, cardOnFileSelectors.editSupplier.flagResetButton);
}

async function setCardLimitBuffer(page, value) {
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.cardLimitBufferInput, value);
}

async function setCardLimitAmount(page, value) {
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.cardLimitAmountInput, value);
}

async function clickSaveAndSubmit(page) {
  await clickFirstVisible(page, cardOnFileSelectors.editSupplier.saveAndSubmitButton);
}

async function expectValidationMessage(page, text) {
  await waitForFirstVisible(page, cardOnFileSelectors.editSupplier.validationMessage(text));
}

function buildUniqueSupplier(prefix = 'CardOnFile') {
  const stamp = Date.now().toString().slice(-8);
  return {
    supplierName: `${prefix}${stamp}`,
    supplierNumber: stamp,
    supplierEmail: `qa+${stamp}@example.com`,
    phoneNumber: '5551234567',
    contactName: 'QA Contact',
    contactEmail: `qa-contact+${stamp}@example.com`,
    taxId: `TX${stamp}`,
    address1: '47 W 13th St',
    address2: 'Suite 12',
    address3: 'Manhattan',
    address4: 'New York',
    country: 'United States',
    state: 'Alaska',
    city: 'Alaska',
    zip: '90129',
    locationCode: `LOC${stamp.slice(-4)}`
  };
}

async function createSupplier(page, overrides = {}) {
  const supplier = {
    ...buildUniqueSupplier(),
    ...overrides
  };
  const customerName = overrides.customerName || 'Cadent';

  await clickFirstVisible(page, cardOnFileSelectors.editSupplier.addSupplierButton);
  await waitForFirstVisible(page, [
    ...cardOnFileSelectors.editSupplier.addSupplierHeading,
    ...cardOnFileSelectors.editSupplier.supplierNameInput,
    ...cardOnFileSelectors.editSupplier.saveAndContinueButton
  ], 30000);
  await selectCustomerOnAddSupplier(page, customerName);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.supplierNameInput, supplier.supplierName);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.supplierNumberInput, supplier.supplierNumber);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.supplierEmailInput, supplier.supplierEmail);
  await fillFirstVisible(page, cardOnFileSelectors.editSupplier.phoneNumberInput, supplier.phoneNumber);
  await clickFirstVisible(page, cardOnFileSelectors.editSupplier.saveAndContinueButton);

  await waitForFirstVisible(page, [
    ...cardOnFileSelectors.editSupplier.addSupplierButton,
    ...cardOnFileSelectors.supplierList.searchInput,
    ...cardOnFileSelectors.supplierList.table
  ], 30000);

  await waitForFirstVisible(page, cardOnFileSelectors.supplierList.searchInput, 30000);
  await searchSuppliers(page, supplier.supplierName);

  await expectTableContainsText(page, supplier.supplierName);

  return supplier;
}

module.exports = {
  cardOnFileHelpers: {
    openModule: async (page) => test.step('Open imREmit module', async () => openModule(page)),
    openSupplierManagementForCustomer: async (page, customerName) => test.step(
      `Open Supplier Management page for ${customerName || 'Cadent'}`,
      async () => openSupplierManagementForCustomer(page, customerName)
    ),
    searchSuppliers: async (page, value) => test.step(
      `Search suppliers for ${value}`,
      async () => searchSuppliers(page, value)
    ),
    expectTableContainsText: async (page, text) => test.step(
      `Verify supplier table contains ${text}`,
      async () => expectTableContainsText(page, text)
    ),
    openEditSupplierDetails: async (page, supplierName) => test.step(
      `Open Edit Supplier Details for ${supplierName || 'selected supplier'}`,
      async () => openEditSupplierDetails(page, supplierName)
    ),
    ensureSupplierEnrollmentYes: async (page) => test.step('Select Supplier Enrollment Yes', async () => ensureSupplierEnrollmentYes(page)),
    selectCardOnFile: async (page) => test.step('Select Card On File', async () => selectCardOnFile(page)),
    selectSingleUseCard: async (page) => test.step('Select Single Use Card', async () => selectSingleUseCard(page)),
    chooseRemittanceMethod: async (page, methodName) => test.step(
      `Select remittance method ${methodName}`,
      async () => chooseRemittanceMethod(page, methodName)
    ),
    populateRequiredSupplierProfile: async (page, overrides) => test.step(
      'Populate required supplier profile',
      async () => populateRequiredSupplierProfile(page, overrides)
    ),
    expectVisible: async (page, selectors) => test.step('Verify field is visible', async () => expectVisible(page, selectors)),
    expectNotVisible: async (page, selectors) => test.step('Verify field is not visible', async () => expectNotVisible(page, selectors)),
    expectInputEditable: async (page, selectors) => test.step('Verify input is editable', async () => expectInputEditable(page, selectors)),
    expectInputDisabled: async (page, selectors) => test.step('Verify input is disabled', async () => expectInputDisabled(page, selectors)),
    expectInputInvalid: async (page, selectors) => test.step('Verify input is invalid', async () => expectInputInvalid(page, selectors)),
    expectRadioEnabled: async (page, selectors) => test.step('Verify option is enabled', async () => expectRadioEnabled(page, selectors)),
    expectRadioDisabled: async (page, selectors) => test.step('Verify option is disabled', async () => expectRadioDisabled(page, selectors)),
    expectFlagResetVisible: async (page) => test.step('Verify Flag Reset button is visible', async () => expectFlagResetVisible(page)),
    expectFlagResetNotVisible: async (page) => test.step('Verify Flag Reset button is not visible', async () => expectFlagResetNotVisible(page)),
    clickFlagReset: async (page) => test.step('Click Flag Reset button', async () => clickFlagReset(page)),
    setCardLimitBuffer: async (page, value) => test.step(
      `Enter Card Limit Buffer ${value}`,
      async () => setCardLimitBuffer(page, value)
    ),
    setCardLimitAmount: async (page, value) => test.step(
      `Enter Card Limit Amount ${value}`,
      async () => setCardLimitAmount(page, value)
    ),
    clickSaveAndSubmit: async (page) => test.step('Click Save And Submit', async () => clickSaveAndSubmit(page)),
    expectValidationMessage: async (page, text) => test.step(
      `Verify validation message ${text}`,
      async () => expectValidationMessage(page, text)
    ),
    createSupplier: async (page, overrides) => test.step('Create supplier', async () => createSupplier(page, overrides)),
    selectors: cardOnFileSelectors
  }
};
