const { test, expect } = require('@playwright/test');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { cardOnFileHelpers } = require('./cardOnFile.js');
const { supplierManagementImremitPremiumSelectors } = require('../../selectors/iteration-matrix/supplierManagementImremitPremium.selectors.js');

async function reportStep(name, action) {
  return test.step(name, action);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildUniqueEmail(prefix = 'qa') {
  const stamp = Date.now().toString().slice(-8);
  return `${prefix}+${stamp}@example.com`;
}

function defaultCustomerForScenario(scenarioName) {
  if (/^TS_41_/i.test(scenarioName)) {
    return 'Cadent';
  }

  if (/^TS_(3[3-9]|4\d|50)_/i.test(scenarioName)) {
    return 'Test_Customer_imREmit';
  }

  return 'Cadent';
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
  await locator.scrollIntoViewIfNeeded().catch(() => null);

  try {
    await locator.click({ timeout: 5000 });
  } catch (error) {
    const message = String(error?.message || '');
    if (!/outside of the viewport|intercepts pointer events|subtree intercepts pointer events/i.test(message)) {
      throw error;
    }

    await locator.click({ timeout: 5000, force: true }).catch(() => null);
  }

  return locator;
}

async function fillFirstVisible(page, selectors, value, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  await locator.fill('');
  await locator.fill(String(value));
  return locator;
}

async function clickIfVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      await locator.scrollIntoViewIfNeeded().catch(() => null);

      try {
        await locator.click({ timeout: 5000 });
      } catch (error) {
        const message = String(error?.message || '');
        if (!/outside of the viewport|intercepts pointer events|subtree intercepts pointer events/i.test(message)) {
          throw error;
        }

        await locator.click({ timeout: 5000, force: true });
      }

      return true;
    }
  }

  return false;
}

async function clickWithViewportFallback(page, selectors, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  await locator.scrollIntoViewIfNeeded().catch(() => null);

  try {
    await locator.click({ timeout: 5000 });
  } catch (error) {
    if (!/outside of the viewport/i.test(String(error?.message || ''))) {
      throw error;
    }

    await locator.evaluate((element) => element.click());
  }

  return locator;
}

async function openSupplierManagementForScenario(page, scenarioName) {
  const customerName = defaultCustomerForScenario(scenarioName);
  await cardOnFileHelpers.openSupplierManagementForCustomer(page, customerName);
  return customerName;
}

async function openAddSupplier(page, scenarioName) {
  await openSupplierManagementForScenario(page, scenarioName);
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.addSupplierButton);
  await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.addSupplierHeading);
}

async function createSupplier(page, scenarioName, overrides = {}) {
  const customerName = defaultCustomerForScenario(scenarioName);
  await openSupplierManagementForScenario(page, scenarioName);
  return cardOnFileHelpers.createSupplier(page, {
    customerName,
    ...overrides
  });
}

async function searchSupplier(page, supplierName) {
  try {
    await cardOnFileHelpers.searchSuppliers(page, supplierName);
  } catch (error) {
    if (!/Search all entries|Search suppliers/i.test(String(error?.message || ''))) {
      throw error;
    }

    await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.table);
  }

  await cardOnFileHelpers.expectTableContainsText(page, supplierName);
}

async function openSupplierAction(page, supplierName, actionSelectors) {
  await searchSupplier(page, supplierName);
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.actionsButton);
  await clickFirstVisible(page, actionSelectors);
}

async function openViewSupplierDetails(page, supplierName) {
  await openSupplierAction(page, supplierName, supplierManagementImremitPremiumSelectors.supplierList.viewSupplierDetails);
  await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.viewSupplierDetailsHeading);
}

async function openEditSupplierDetails(page, supplierName) {
  await cardOnFileHelpers.openEditSupplierDetails(page, supplierName);
}

async function deleteSupplier(page, supplierName) {
  await reportStep(`Delete supplier ${supplierName}`, async () => {
    await openSupplierAction(page, supplierName, supplierManagementImremitPremiumSelectors.supplierList.deleteSupplier);
    await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.confirmationDeleteButton);
    await page.waitForTimeout(1000);
  });
}

async function withSupplierCleanup(page, scenarioName, action, supplierOverrides = {}) {
  const supplier = await createSupplier(page, scenarioName, supplierOverrides);
  let cleanupName = supplier.supplierName;

  try {
    await action(supplier, {
      setCleanupName(value) {
        cleanupName = value;
      }
    });
  } finally {
    await openSupplierManagementForScenario(page, scenarioName).catch(() => null);
    await deleteSupplier(page, cleanupName).catch(() => null);
  }
}

async function expectRadioUnchecked(page, selectors) {
  const control = await waitForFirstVisible(page, selectors);
  const checked = await control.isChecked().catch(async () => {
    const htmlFor = await control.getAttribute('for').catch(() => null);
    if (!htmlFor) {
      return false;
    }
    return page.locator(`#${htmlFor}`).first().isChecked().catch(() => false);
  });

  expect(checked).toBeFalsy();
}

async function expectFieldValue(page, selectors, value) {
  const locator = await waitForFirstVisible(page, selectors);
  await expect(locator).toHaveValue(value);
}

async function addSecondRemittanceEmail(page, emailValue) {
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.addRemittanceEmailButton);
  await fillFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.secondRemittanceEmailInput, emailValue);
}

async function addWebCredentials(page) {
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.addUserCredentialButton);
  await fillFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.userIdInput, 'test');
  await fillFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.userPasswordInput, 'test123');
}

async function fillPhoneRemittanceContact(page) {
  await fillFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.remittanceContactNameInput, 'Contact_Test');
  await fillFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.remittanceContactPhoneInput, '23453578');
}

async function removeSecondRemittanceEmail(page) {
  const emailInput = await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.secondRemittanceEmailInput);
  const row = emailInput.locator('xpath=ancestor::*[self::tr or self::div][1]');
  const deleteButton = row.locator('button').filter({ has: row.page().locator('svg') }).first();

  if (await deleteButton.isVisible().catch(() => false)) {
    await deleteButton.click({ timeout: 5000 });
    await expect(emailInput).toBeHidden({ timeout: 10000 });
    return;
  }

  throw new Error('Unable to locate delete control for the remittance email row.');
}

async function configureRemittanceMethod(page, methodName) {
  await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
  await cardOnFileHelpers.selectSingleUseCard(page);
  await cardOnFileHelpers.chooseRemittanceMethod(page, methodName);
  await cardOnFileHelpers.populateRequiredSupplierProfile(page);
}

async function completeRemittanceWorkflow(page, methodName, options = {}) {
  await configureRemittanceMethod(page, methodName);

  if (/phone/i.test(methodName)) {
    await fillPhoneRemittanceContact(page);
  } else if (/web/i.test(methodName)) {
    await addWebCredentials(page);
  }

  if (options.submit) {
    await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.saveAndSubmitButton);
  } else {
    await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.saveAndContinueButton);
  }

  await page.waitForTimeout(1500);
  return {};
}

async function expectSupplierRowContains(page, supplierName, expectedText) {
  await searchSupplier(page, supplierName);
  const row = page.locator('tbody tr').filter({ hasText: supplierName }).first();
  await expect(row).toContainText(expectedText, { timeout: 15000 });
}

async function expectSupplierSearchResultContains(page, searchValue, expectedText) {
  await searchSupplier(page, searchValue);
  const row = page.locator('tbody tr').filter({ hasText: searchValue }).first();
  await expect(row).toContainText(expectedText, { timeout: 15000 });
}

async function openStatusMenu(page, scenarioName) {
  await openSupplierManagementForScenario(page, scenarioName);
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.statusButton);
}

async function selectStatusFilter(page, scenarioName, statusLabel) {
  await openStatusMenu(page, scenarioName);
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.filters.statusOption(statusLabel));
  await page.waitForTimeout(750);
}

async function openAdvancedSearch(page, scenarioName) {
  await openSupplierManagementForScenario(page, scenarioName);
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.filters.advancedSearchButton);
}

async function runTs01(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await searchSupplier(page, supplier.supplierName);
  });
}

async function runTs02(page, data, scenarioName) {
  await runTs01(page, data, scenarioName);
}

async function runTs03(page, data, scenarioName) {
  await openAddSupplier(page, scenarioName);
  await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.cancelButton);
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.cancelButton);
  await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.searchInput);
}

async function runTs04(page, data, scenarioName) {
  await openAddSupplier(page, scenarioName);
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.backToListButton);
  await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.searchInput);
}

async function runTs05(page, data, scenarioName) {
  await openAddSupplier(page, scenarioName);
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.importScriptButton);
  await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.importSuppliersButton);
}

async function runTs06(page, data, scenarioName) {
  await runTs05(page, data, scenarioName);
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.importSuppliersButton);
}

async function runTs07(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier, context) => {
    const updatedName = `${supplier.supplierName}-Edited`;
    await openEditSupplierDetails(page, supplier.supplierName);
    await fillFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.supplierNameInput, updatedName);
    await expectFieldValue(page, supplierManagementImremitPremiumSelectors.editSupplier.supplierNameInput, updatedName);
    await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.backToListButton);
    context.setCleanupName(supplier.supplierNumber);
  });
}

async function runTs08(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier, context) => {
    const updatedName = `${supplier.supplierName}-Declined`;
    await openEditSupplierDetails(page, supplier.supplierName);
    await fillFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.supplierNameInput, updatedName);
    await fillFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.declinedReasonInput, 'This is for test');
    await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.saveAndSubmitButton);
    await openSupplierManagementForScenario(page, scenarioName);
    await expectSupplierRowContains(page, updatedName, updatedName);
    context.setCleanupName(supplier.supplierNumber);
  });
}

async function runTs09(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.supplierEnrollmentYes);
    await expectRadioUnchecked(page, supplierManagementImremitPremiumSelectors.editSupplier.supplierEnrollmentYes);
  });
}

async function runTs10(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.cardTypeLabel);
  });
}

async function runTs11(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.selectCardOnFile(page);
    await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.cardLimitBufferInput);
  });
}

async function runTs12(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.selectSingleUseCard(page);
    await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.remittanceMethodTrigger);
  });
}

async function runTs13To15(page, data, scenarioName, methodName) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await configureRemittanceMethod(page, methodName);

    if (/web/i.test(methodName)) {
      await addWebCredentials(page);
      await expectFieldValue(page, supplierManagementImremitPremiumSelectors.editSupplier.userIdInput, 'test');
      return;
    }

    if (/phone/i.test(methodName)) {
      await fillPhoneRemittanceContact(page);
      await expectFieldValue(page, supplierManagementImremitPremiumSelectors.editSupplier.remittanceContactNameInput, 'Contact_Test');
      return;
    }

    await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.remittanceMethodTrigger);
  });
}

async function runTs16(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await configureRemittanceMethod(page, 'Pay by Email');
    await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.remittanceMethodTrigger);
  });
}

async function runTs17(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.backToListButton);
    await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.searchInput);
  });
}

async function runTs18(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.cancelButton);
    await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.searchInput);
  });
}

async function runRemittanceScenario(page, data, scenarioName, options) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await completeRemittanceWorkflow(page, options.methodName, { submit: options.submit });

    const backToList = await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.backToListButton, 5000).catch(() => null);
    if (backToList) {
      await backToList.click();
      await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.searchInput, 30000);
    } else {
      await openSupplierManagementForScenario(page, scenarioName);
    }

    if (options.expectedStatus) {
      await expectSupplierRowContains(page, supplier.supplierName, options.expectedStatus);
    } else if (options.expectedStatusesAny && options.expectedStatusesAny.length) {
      await searchSupplier(page, supplier.supplierName);
      const row = page.locator('tbody tr').filter({ hasText: supplier.supplierName }).first();
      await expect(row).toContainText(new RegExp(options.expectedStatusesAny.join('|')));
    } else {
      await searchSupplier(page, supplier.supplierName);
    }
  });
}

async function runTs31(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await openViewSupplierDetails(page, supplier.supplierName);
    await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.backToListButton);
    await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.searchInput);
  });
}

async function runTs32(page, data, scenarioName) {
  await withSupplierCleanup(page, scenarioName, async (supplier) => {
    await openViewSupplierDetails(page, supplier.supplierName);
    await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.commentsButton);
    await fillFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.commentsInput, 'Automated supplier comment');
    await expectFieldValue(page, supplierManagementImremitPremiumSelectors.editSupplier.commentsInput, 'Automated supplier comment');
  });
}

async function runTs33(page, data, scenarioName) {
  await openSupplierManagementForScenario(page, scenarioName);
  await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.searchInput);
}

async function runTs34(page, data, scenarioName) {
  await openSupplierManagementForScenario(page, scenarioName);
  await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.editSupplier.addSupplierButton);
}

async function runPaginationScenario(page, scenarioName, controlSelectors, options = {}) {
  await openSupplierManagementForScenario(page, scenarioName);

  if (options.setupSelectors) {
    await clickWithViewportFallback(page, options.setupSelectors);
    await page.waitForTimeout(750);
  }

  await clickWithViewportFallback(page, controlSelectors);
}

async function runTs39(page, data, scenarioName) {
  await openSupplierManagementForScenario(page, scenarioName);
  const paginationButtons = await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.pagination.pageButtons);
  await expect(paginationButtons).toBeVisible();
}

async function runTs40(page, data, scenarioName) {
  await openSupplierManagementForScenario(page, scenarioName);
  await fillFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.searchAllEntriesInput, 'WSCA001Verizon');
  await expectFieldValue(page, supplierManagementImremitPremiumSelectors.supplierList.searchAllEntriesInput, 'WSCA001Verizon');
}

async function runTs41(page, data, scenarioName) {
  await openSupplierManagementForScenario(page, scenarioName);
  await clickFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.searchSuppliersTrigger);
  const option = await waitForFirstVisible(page, [
    '[role="option"]',
    'div[role="option"]'
  ]);
  await expect(option).toBeVisible();
}

async function runTs42(page, data, scenarioName) {
  await openStatusMenu(page, scenarioName);
  for (const label of ['Active', 'Inactive', 'Declined Enrollment', 'Approval Pending', 'Onboarding Pending', 'Form Declined']) {
    await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.filters.statusOption(label));
  }
  await clickIfVisible(page, supplierManagementImremitPremiumSelectors.filters.clearStatus);
}

async function runStatusFilterScenario(page, data, scenarioName, statusLabel) {
  await selectStatusFilter(page, scenarioName, statusLabel);
  await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.supplierList.tableStatusBadge(statusLabel.toUpperCase()));
}

async function runTs49(page, data, scenarioName) {
  await openAdvancedSearch(page, scenarioName);
  await waitForFirstVisible(page, supplierManagementImremitPremiumSelectors.filters.advancedSearchEmailInput);
}

async function runTs50(page, data, scenarioName) {
  await openAdvancedSearch(page, scenarioName);
  await fillFirstVisible(page, supplierManagementImremitPremiumSelectors.filters.advancedSearchEmailInput, 'test@gmail.com');
  await expectFieldValue(page, supplierManagementImremitPremiumSelectors.filters.advancedSearchEmailInput, 'test@gmail.com');
}

async function runScenario(page, data, scenarioName) {
  if (/^TS_0?1_/i.test(scenarioName)) return runTs01(page, data, scenarioName);
  if (/^TS_0?2_/i.test(scenarioName)) return runTs02(page, data, scenarioName);
  if (/^TS_0?3_/i.test(scenarioName)) return runTs03(page, data, scenarioName);
  if (/^TS_0?4_/i.test(scenarioName)) return runTs04(page, data, scenarioName);
  if (/^TS_0?5_/i.test(scenarioName)) return runTs05(page, data, scenarioName);
  if (/^TS_0?6_/i.test(scenarioName)) return runTs06(page, data, scenarioName);
  if (/^TS_0?7_/i.test(scenarioName)) return runTs07(page, data, scenarioName);
  if (/^TS_0?8_/i.test(scenarioName)) return runTs08(page, data, scenarioName);
  if (/^TS_0?9_/i.test(scenarioName)) return runTs09(page, data, scenarioName);
  if (/^TS_10_/i.test(scenarioName)) return runTs10(page, data, scenarioName);
  if (/^TS_11_/i.test(scenarioName)) return runTs11(page, data, scenarioName);
  if (/^TS_12_/i.test(scenarioName)) return runTs12(page, data, scenarioName);
  if (/^TS_13_/i.test(scenarioName)) return runTs13To15(page, data, scenarioName, 'Pay by Email');
  if (/^TS_14_/i.test(scenarioName)) return runTs13To15(page, data, scenarioName, 'Pay by Web');
  if (/^TS_15_/i.test(scenarioName)) return runTs13To15(page, data, scenarioName, 'Pay by Phone');
  if (/^TS_16_/i.test(scenarioName)) return runTs16(page, data, scenarioName);
  if (/^TS_17_/i.test(scenarioName)) return runTs17(page, data, scenarioName);
  if (/^TS_18_/i.test(scenarioName)) return runTs18(page, data, scenarioName);
  if (/^TS_19_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Email', submit: false });
  if (/^TS_20_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Email', submit: false, expectedStatus: 'ONBOARDING PENDING' });
  if (/^TS_21_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Web', submit: false });
  if (/^TS_22_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Web', submit: false, expectedStatus: 'ONBOARDING PENDING' });
  if (/^TS_23_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Phone', submit: true });
  if (/^TS_24_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Phone', submit: true, expectedStatusesAny: ['APPROVAL PENDING', 'ONBOARDING PENDING'] });
  if (/^TS_25_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Email', submit: true });
  if (/^TS_26_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Email', submit: true, expectedStatus: 'APPROVAL PENDING' });
  if (/^TS_27_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Web', submit: true });
  if (/^TS_28_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Web', submit: true, expectedStatusesAny: ['APPROVAL PENDING', 'ONBOARDING PENDING'] });
  if (/^TS_29_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Phone', submit: true });
  if (/^TS_30_/i.test(scenarioName)) return runRemittanceScenario(page, data, scenarioName, { methodName: 'Pay by Phone', submit: true, expectedStatusesAny: ['APPROVAL PENDING', 'ONBOARDING PENDING'] });
  if (/^TS_31_/i.test(scenarioName)) return runTs31(page, data, scenarioName);
  if (/^TS_32_/i.test(scenarioName)) return runTs32(page, data, scenarioName);
  if (/^TS_33_/i.test(scenarioName)) return runTs33(page, data, scenarioName);
  if (/^TS_34_/i.test(scenarioName)) return runTs34(page, data, scenarioName);
  if (/^TS_35_/i.test(scenarioName)) return runPaginationScenario(page, scenarioName, supplierManagementImremitPremiumSelectors.supplierList.pagination.next);
  if (/^TS_36_/i.test(scenarioName)) return runPaginationScenario(page, scenarioName, supplierManagementImremitPremiumSelectors.supplierList.pagination.last);
  if (/^TS_37_/i.test(scenarioName)) return runPaginationScenario(page, scenarioName, supplierManagementImremitPremiumSelectors.supplierList.pagination.previous, {
    setupSelectors: supplierManagementImremitPremiumSelectors.supplierList.pagination.next
  });
  if (/^TS_38_/i.test(scenarioName)) return runPaginationScenario(page, scenarioName, supplierManagementImremitPremiumSelectors.supplierList.pagination.first, {
    setupSelectors: supplierManagementImremitPremiumSelectors.supplierList.pagination.last
  });
  if (/^TS_39_/i.test(scenarioName)) return runTs39(page, data, scenarioName);
  if (/^TS_40_/i.test(scenarioName)) return runTs40(page, data, scenarioName);
  if (/^TS_41_/i.test(scenarioName)) return runTs41(page, data, scenarioName);
  if (/^TS_42_/i.test(scenarioName)) return runTs42(page, data, scenarioName);
  if (/^TS_43_/i.test(scenarioName)) return runStatusFilterScenario(page, data, scenarioName, 'Active');
  if (/^TS_44_/i.test(scenarioName)) return runStatusFilterScenario(page, data, scenarioName, 'Inactive');
  if (/^TS_45_/i.test(scenarioName)) return runStatusFilterScenario(page, data, scenarioName, 'Declined Enrollment');
  if (/^TS_46_/i.test(scenarioName)) return runStatusFilterScenario(page, data, scenarioName, 'Approval Pending');
  if (/^TS_47_/i.test(scenarioName)) return runStatusFilterScenario(page, data, scenarioName, 'Onboarding Pending');
  if (/^TS_48_/i.test(scenarioName)) return runStatusFilterScenario(page, data, scenarioName, 'Form Declined');
  if (/^TS_49_/i.test(scenarioName)) return runTs49(page, data, scenarioName);
  if (/^TS_50_/i.test(scenarioName)) return runTs50(page, data, scenarioName);

  throw new Error(`Supplier_Management_imREmit_Premium scenario not implemented yet: ${scenarioName}`);
}

const helperMap = {
  runScenario,
  openModule: async (page) => cardOnFileHelpers.openModule(page),
  openSupplierManagementForCustomer: async (page, customerName) => cardOnFileHelpers.openSupplierManagementForCustomer(page, customerName),
  selectors: supplierManagementImremitPremiumSelectors
};

module.exports = {
  supplierManagementImremitPremiumHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap, {
      runScenario: 'Run Supplier Management imREmit Premium scenario',
      openModule: 'Open imREmit module',
      openSupplierManagementForCustomer: 'Open Supplier Management for customer'
    }),
    runScenario,
    selectors: supplierManagementImremitPremiumSelectors
  }
};
