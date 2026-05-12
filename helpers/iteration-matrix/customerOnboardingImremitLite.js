const { expect, test } = require('@playwright/test');
const { resolveFirst, clickWithFallback, fillWithFallback } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { customerManagementAdminNmHelpers } = require('./customerManagementAdminNm.js');
const { customerOnboardingImremitLiteSelectors } = require('../../selectors/iteration-matrix/customerOnboardingImremitLite.selectors.js');

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function reportStep(name, action) {
  return test.step(name, action);
}

async function ensureCustomerManagementListPage(page) {
  const searchVisible = await Promise.any([
    page.getByPlaceholder('Search all customers...').first().isVisible(),
    page.getByPlaceholder('Search all entries...').first().isVisible()
  ].map((promise) => promise.catch(() => false))).catch(() => false);

  if (searchVisible) {
    return;
  }

  const customerManagementLink = await resolveFirst(page, customerOnboardingImremitLiteSelectors.customerManagementLink, {
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
  const searchField = await resolveFirst(page, customerOnboardingImremitLiteSelectors.searchFields.customerList, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await searchField.locator.fill(customerName);
  await waitForAppToSettle(page, 500);

  const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(customerName), 'i') }).first();
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

async function expectCustomerCreated(page, customerName) {
  const row = await searchCustomerList(page, customerName);
  await expect(row).toContainText(new RegExp(escapeRegExp(customerName), 'i'), { timeout: 15000 });
  await expect(row).toContainText(/imremit(?:[_\s-]?lite)?/i, { timeout: 15000 });
}

async function createLiteCustomer(page, data) {
  return customerManagementAdminNmHelpers.createLiteCustomerWithAssociations(page, data);
}

async function openCustomerProfile(page, customerName) {
  await customerManagementAdminNmHelpers.viewCustomerProfile(page, customerName);
  await expect(page.getByRole('heading', { name: 'Customer Profile', exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function editCustomerName(page, customerName) {
  const updatedCustomerName = `${customerName}Edit`;
  await openCustomerAction(page, customerName, customerOnboardingImremitLiteSelectors.actionMenuItems.editCustomerDetails);
  await expect(page.getByRole('heading', { name: 'Edit Customer', exact: true }).first()).toBeVisible({ timeout: 15000 });
  await fillWithFallback(page, customerOnboardingImremitLiteSelectors.fields.customerName, updatedCustomerName);
  await clickWithFallback(page, customerOnboardingImremitLiteSelectors.saveEditedCustomerButton);
  await waitForAppToSettle(page, 1000);

  const updatedToast = await resolveFirst(page, customerOnboardingImremitLiteSelectors.updateSuccessToast, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);

  if (updatedToast) {
    await expect(updatedToast.locator).toBeVisible({ timeout: 5000 });
  } else {
    await expect(page).toHaveURL(/\/app\/admin\/customer-management(?:\?.*)?$/i, { timeout: 15000 });
  }

  return updatedCustomerName;
}

async function expectProfileDetails(page, customerName) {
  await expect(page.getByRole('heading', { name: 'Customer Profile', exact: true }).first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(new RegExp(escapeRegExp(customerName), 'i')).first()).toBeVisible({ timeout: 15000 });
  const editButton = await resolveFirst(page, customerOnboardingImremitLiteSelectors.viewProfile.editCustomerButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(editButton.locator).toBeVisible({ timeout: 15000 });
}

async function returnToCustomerManagement(page) {
  const backButton = await resolveFirst(page, customerOnboardingImremitLiteSelectors.viewProfile.backToCustomerManagementButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (backButton) {
    await backButton.locator.click();
  } else {
    await ensureCustomerManagementListPage(page);
  }

  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function expectCustomerDeleted(page, customerName) {
  const deletedToast = await resolveFirst(page, customerOnboardingImremitLiteSelectors.toasts.customerDeleted, {
    mustBeVisible: true,
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (deletedToast) {
    await expect(deletedToast.locator).toBeVisible({ timeout: 5000 });
    return;
  }

  await ensureCustomerManagementListPage(page);
  const searchField = await resolveFirst(page, customerOnboardingImremitLiteSelectors.searchFields.customerList, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await searchField.locator.fill(customerName);
  await waitForAppToSettle(page, 500);

  const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(customerName), 'i') }).first();
  await expect(row).toBeHidden({ timeout: 15000 });
}

async function deleteCustomer(page, customerName) {
  await ensureCustomerManagementListPage(page);
  await openCustomerAction(page, customerName, customerOnboardingImremitLiteSelectors.actionMenuItems.deleteCustomer);
  await clickWithFallback(page, customerOnboardingImremitLiteSelectors.dialogs.deleteCustomerConfirmButton);
  await waitForAppToSettle(page, 1000);
  await expectCustomerDeleted(page, customerName);
}

async function verifyDeleteDialog(page, customerName) {
  await ensureCustomerManagementListPage(page);
  await openCustomerAction(page, customerName, customerOnboardingImremitLiteSelectors.actionMenuItems.deleteCustomer);
  const deleteButton = await resolveFirst(page, customerOnboardingImremitLiteSelectors.dialogs.deleteCustomerConfirmButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(deleteButton.locator).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('button', { name: /^Cancel$/i }).first()).toBeVisible({ timeout: 15000 });
}

async function runTs01(page, data) {
  const { customerName } = await reportStep('Create imREmit Lite customer', async () => createLiteCustomer(page, data));

  try {
    await reportStep('Verify created customer is visible on the Customer Management list', async () => {
      await expectCustomerCreated(page, customerName);
    });
  } finally {
    await reportStep('Delete created customer', async () => {
      await deleteCustomer(page, customerName);
    }).catch(() => null);
  }
}

async function runTs02(page, data) {
  const { customerName } = await reportStep('Create imREmit Lite customer', async () => createLiteCustomer(page, data));
  let customerNameToDelete = customerName;

  try {
    const updatedCustomerName = await reportStep('Edit the created customer name', async () => editCustomerName(page, customerName));
    customerNameToDelete = updatedCustomerName;

    await reportStep('Verify the updated customer is visible on the Customer Management list', async () => {
      await expectCustomerCreated(page, updatedCustomerName);
    });
  } finally {
    await reportStep('Delete created customer', async () => {
      await deleteCustomer(page, customerNameToDelete);
    }).catch(() => null);
  }
}

async function runTs03(page, data) {
  const { customerName } = await reportStep('Create imREmit Lite customer', async () => createLiteCustomer(page, data));

  try {
    await reportStep('Open the customer profile', async () => {
      await openCustomerProfile(page, customerName);
    });
    await reportStep('Verify the customer profile details are visible', async () => {
      await expectProfileDetails(page, customerName);
    });
  } finally {
    await reportStep('Delete created customer', async () => {
      await deleteCustomer(page, customerName);
    }).catch(() => null);
  }
}

async function runTs04(page, data) {
  const { customerName } = await reportStep('Create imREmit Lite customer', async () => createLiteCustomer(page, data));

  try {
    await reportStep('Open the customer profile', async () => {
      await openCustomerProfile(page, customerName);
    });
    await reportStep('Verify the Back to Customer Management button is visible', async () => {
      const backButton = await resolveFirst(page, customerOnboardingImremitLiteSelectors.viewProfile.backToCustomerManagementButton, {
        mustBeVisible: true,
        timeoutPerCandidate: 2500
      });
      await expect(backButton.locator).toBeVisible({ timeout: 15000 });
    });
    await reportStep('Return to the Customer Management list', async () => {
      await returnToCustomerManagement(page);
    });
  } finally {
    await reportStep('Delete created customer', async () => {
      await deleteCustomer(page, customerName);
    }).catch(() => null);
  }
}

async function runTs05(page, data) {
  const { customerName } = await reportStep('Create imREmit Lite customer', async () => createLiteCustomer(page, data));
  let deleted = false;

  try {
    await reportStep('Open the Delete Customer action', async () => {
      await verifyDeleteDialog(page, customerName);
    });
    await reportStep('Delete the created customer', async () => {
      await clickWithFallback(page, customerOnboardingImremitLiteSelectors.dialogs.deleteCustomerConfirmButton);
      await waitForAppToSettle(page, 1000);
      await expectCustomerDeleted(page, customerName);
      deleted = true;
    });
  } finally {
    if (!deleted) {
      await reportStep('Delete created customer', async () => {
        await deleteCustomer(page, customerName);
      }).catch(() => null);
    }
  }
}

async function runScenario(page, data, scenarioName) {
  if (/^TS_01_/i.test(scenarioName)) {
    return runTs01(page, data);
  }
  if (/^TS_02_/i.test(scenarioName)) {
    return runTs02(page, data);
  }
  if (/^TS_03_/i.test(scenarioName)) {
    return runTs03(page, data);
  }
  if (/^TS_04_/i.test(scenarioName)) {
    return runTs04(page, data);
  }
  if (/^TS_05_/i.test(scenarioName)) {
    return runTs05(page, data);
  }

  throw new Error(`Customer_Onboarding_imREmit_Lite scenario not implemented yet: ${scenarioName}`);
}

const helperMap = {
  runScenario,
  selectors: customerOnboardingImremitLiteSelectors
};

module.exports = {
  customerOnboardingImremitLiteHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap, {
      runScenario: 'Run imREmit Lite onboarding scenario'
    }),
    runScenario,
    selectors: customerOnboardingImremitLiteSelectors
  }
};
