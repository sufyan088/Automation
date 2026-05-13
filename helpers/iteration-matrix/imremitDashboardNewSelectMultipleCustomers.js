const { expect, test } = require('@playwright/test');
const { clickIfFound, clickWithFallback, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { imremitDashboardNewSelectMultipleCustomersSelectors } = require('../../selectors/iteration-matrix/imremitDashboardNewSelectMultipleCustomers.selectors.js');

const CUSTOMER_ONE = 'Cadent';
const CUSTOMER_TWO = 'Verizon Customer';

async function reportStep(name, action) {
  return test.step(name, action);
}

async function openModule(page) {
  await clickIfFound(page, imremitDashboardNewSelectMultipleCustomersSelectors.moduleTabs.imremit, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
  return page;
}

async function openDashboard(page) {
  await clickWithFallback(page, imremitDashboardNewSelectMultipleCustomersSelectors.moduleTabs.dashboard, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectOverviewVisible(page) {
  const heading = await resolveFirst(page, imremitDashboardNewSelectMultipleCustomersSelectors.headings.overview, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function openDashboardWorkspace(page) {
  await openModule(page);
  await openDashboard(page);
  await expectOverviewVisible(page);
}

async function openCustomerPicker(page) {
  const trigger = await resolveFirst(page, imremitDashboardNewSelectMultipleCustomersSelectors.customerPicker.trigger, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await trigger.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
  return trigger.locator;
}

async function searchAndSelectCustomer(page, customerName) {
  await fillWithFallback(page, imremitDashboardNewSelectMultipleCustomersSelectors.customerPicker.searchInput, customerName, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 750);

  const optionByRole = page.getByRole('option', { name: new RegExp(customerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first();
  if (await optionByRole.isVisible().catch(() => false)) {
    await optionByRole.click({ timeout: 5000 });
    await waitForAppToSettle(page, 750);
    return;
  }

  const optionByText = page.getByText(new RegExp(`^${customerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')).first();
  await expect(optionByText).toBeVisible({ timeout: 10000 });
  await optionByText.click({ timeout: 5000 });
  await waitForAppToSettle(page, 750);
}

async function selectCustomers(page, customerNames) {
  await openCustomerPicker(page);
  for (const customerName of customerNames) {
    await searchAndSelectCustomer(page, customerName);
  }
  await page.keyboard.press('Escape').catch(() => {});
  await waitForAppToSettle(page, 500);
}

async function selectAllCustomers(page) {
  const trigger = await openCustomerPicker(page);
  const selectAllChip = page.getByText(/^select all$/i).first();
  if (await selectAllChip.isVisible().catch(() => false)) {
    await selectAllChip.click({ timeout: 5000 });
  } else {
    await trigger.click({ timeout: 5000 });
  }
  await waitForAppToSettle(page, 500);
  await page.keyboard.press('Escape').catch(() => {});
}

async function expectCustomerTagVisible(page, customerName) {
  await expect(page.getByText(new RegExp(`^${customerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')).first()).toBeVisible({ timeout: 10000 });
}

async function expectCustomerDetailsToggleHidden(page) {
  const toggle = page.getByText(/view full customer details|view customer details/i).first();
  await expect(toggle).toBeHidden({ timeout: 10000 });
}

async function openCustomerDetails(page) {
  await clickWithFallback(page, imremitDashboardNewSelectMultipleCustomersSelectors.dashboard.viewCustomerDetails, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectCustomerDetailsVisible(page) {
  const heading = await resolveFirst(page, imremitDashboardNewSelectMultipleCustomersSelectors.headings.customerDetails, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function goToPaymentManagement(page) {
  await clickWithFallback(page, imremitDashboardNewSelectMultipleCustomersSelectors.moduleTabs.paymentManagement, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function runTs01(page) {
  await reportStep('Open the imREmit dashboard', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Select multiple customers from the Select Customers dropdown', async () => {
    await selectCustomers(page, [CUSTOMER_ONE, CUSTOMER_TWO]);
  });
  await reportStep('Verify both selected customers are shown in the customer selector', async () => {
    await expectCustomerTagVisible(page, CUSTOMER_ONE);
    await expectCustomerTagVisible(page, CUSTOMER_TWO);
  });
}

async function runTs02(page) {
  await reportStep('Open the imREmit dashboard', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Use Select All from the customer selector', async () => {
    await selectAllCustomers(page);
  });
  await reportStep('Verify the Select All selection is displayed', async () => {
    await expectCustomerTagVisible(page, 'Select All');
  });
}

async function runTs03(page) {
  await reportStep('Open the imREmit dashboard', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Select multiple customers from the dashboard selector', async () => {
    await selectCustomers(page, [CUSTOMER_ONE, CUSTOMER_TWO]);
  });
  await reportStep('Verify the customer information section is hidden for multiple customers', async () => {
    await expectCustomerDetailsToggleHidden(page);
  });
}

async function runTs04(page) {
  await reportStep('Open the imREmit dashboard', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Select a single customer from the dashboard selector', async () => {
    await selectCustomers(page, [CUSTOMER_ONE]);
  });
  await reportStep('Open the customer details panel', async () => {
    await expect(page.getByText(/view full customer details|view customer details/i).first()).toBeVisible({ timeout: 10000 });
    await openCustomerDetails(page);
  });
  await reportStep('Verify the customer details panel is displayed', async () => {
    await expectCustomerDetailsVisible(page);
  });
}

async function runTs05(page) {
  await reportStep('Open the imREmit dashboard', async () => {
    await openDashboardWorkspace(page);
  });
  await reportStep('Select a customer on the dashboard', async () => {
    await selectCustomers(page, [CUSTOMER_ONE]);
  });
  await reportStep('Navigate to Payment Management', async () => {
    await goToPaymentManagement(page);
  });
  await reportStep('Verify the selected customer remains applied after navigation', async () => {
    await expectCustomerTagVisible(page, CUSTOMER_ONE);
  });
}

const scenarioMap = {
  TS_01: runTs01,
  TS_02: runTs02,
  TS_03: runTs03,
  TS_04: runTs04,
  TS_05: runTs05
};

async function runScenario(page, data, testTitle) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => testTitle.includes(key));
  if (!scenarioKey) {
    throw new Error(`Unsupported scenario for imREmit dashboard multiple customers: ${testTitle}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

const helperMap = {
  openModule,
  openDashboard,
  openDashboardWorkspace,
  selectCustomers,
  selectAllCustomers,
  openCustomerDetails
};

module.exports = {
  imremitDashboardNewSelectMultipleCustomersHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario,
    selectors: imremitDashboardNewSelectMultipleCustomersSelectors
  }
};
