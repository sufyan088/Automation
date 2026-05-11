const { test } = require('@playwright/test');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { duplicateDashboardNewSelectors } = require('../../selectors/iteration-matrix/duplicateDashboardNew.selectors.js');

async function reportStep(name, action) {
  return test.step(name, action);
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
  await locator.click({ timeout: 5000 });
  return locator;
}

async function getVisibleComboboxes(page) {
  const comboboxes = page.getByRole('combobox');
  const total = await comboboxes.count();
  const visibleComboboxes = [];

  for (let index = 0; index < total; index += 1) {
    const combobox = comboboxes.nth(index);
    if (await combobox.isVisible().catch(() => false)) {
      visibleComboboxes.push(combobox);
    }
  }

  return visibleComboboxes;
}

async function openModule(page) {
  const moduleLink = page.getByRole('link', { name: /duplicate payments/i }).first();
  await moduleLink.waitFor({ state: 'visible', timeout: 15000 });
  await moduleLink.click({ timeout: 5000 });
  await page.waitForURL(/duplicate-payments/i, { timeout: 15000 });
  return page;
}

async function openDashboard(page) {
  const dashboardLink = page.getByRole('link', { name: /dashboard/i }).first();
  if (await dashboardLink.isVisible().catch(() => false)) {
    await dashboardLink.click({ timeout: 5000 });
  }

  const startedAt = Date.now();
  while ((Date.now() - startedAt) < 15000) {
    if ((await getVisibleComboboxes(page)).length > 0) {
      return;
    }

    await page.waitForTimeout(250);
  }

  throw new Error('Duplicate Payments dashboard customer picker did not become visible.');
}

async function selectCustomer(page, preferredCustomer = 'Stanford U') {
  const visibleComboboxes = await getVisibleComboboxes(page);
  for (const combobox of visibleComboboxes) {
    const comboboxText = ((await combobox.textContent().catch(() => '')) || '').trim();
    if (preferredCustomer && comboboxText.toLowerCase().includes(preferredCustomer.toLowerCase())) {
      return comboboxText;
    }
  }

  const customerCombobox = visibleComboboxes[visibleComboboxes.length - 1];
  if (!customerCombobox) {
    throw new Error('No visible customer combobox was found on the Duplicate Payments dashboard.');
  }

  await customerCombobox.click({ timeout: 5000 });

  const searchInput = await waitForFirstVisible(page, duplicateDashboardNewSelectors.customerSearchInput);
  await searchInput.fill('');
  await searchInput.type(preferredCustomer, { delay: 40 });
  await page.waitForTimeout(1000);

  const preferredOption = page.getByRole('option', { name: new RegExp(preferredCustomer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first();
  if (await preferredOption.isVisible().catch(() => false)) {
    await preferredOption.click({ timeout: 5000 });
  } else {
    const firstOption = await waitForFirstVisible(page, duplicateDashboardNewSelectors.customerOptions);
    await firstOption.click({ timeout: 5000 });
  }

  await page.waitForTimeout(500);

  const trigger = await getVisibleComboboxes(page).then((comboboxes) => comboboxes[comboboxes.length - 1]);
  if (!trigger) {
    throw new Error('Customer combobox was not visible after selection.');
  }

  const triggerText = ((await trigger.textContent().catch(() => '')) || '').trim();
  if (!triggerText || /select customer/i.test(triggerText)) {
    throw new Error(`Customer selection did not apply. Current trigger text: ${triggerText}`);
  }

  return triggerText;
}

async function openRunTypeDropdown(page, selectedCustomer) {
  const customerText = String(selectedCustomer || '').trim().toLowerCase();

  const visibleComboboxes = await getVisibleComboboxes(page);
  for (const trigger of visibleComboboxes) {
    const triggerText = ((await trigger.textContent().catch(() => '')) || '').trim();
    if (customerText && triggerText.toLowerCase().includes(customerText)) {
      continue;
    }

    await trigger.click({ timeout: 5000 });
    await page.waitForTimeout(500);
    return triggerText;
  }

  throw new Error('No visible run type dropdown was found on the Duplicate Payments dashboard.');
}

async function runTs31(page) {
  await reportStep('Open Duplicate Payments dashboard', async () => {
    await openModule(page);
    await openDashboard(page);
  });

  await reportStep('Select dashboard customer', async () => {
    await selectCustomer(page, 'Stanford U');
  });

  await reportStep('Open run type dropdown', async () => {
    await openRunTypeDropdown(page, 'Stanford U');
  });
}

async function runScenario(page, data, scenarioName) {
  if (/^TS_31_/i.test(scenarioName)) {
    return runTs31(page, data);
  }

  throw new Error(`Duplicate_Dashboard_New scenario not implemented yet: ${scenarioName}`);
}

const helperMap = {
  openModule,
  openDashboard,
  selectCustomer,
  openRunTypeDropdown,
  runScenario,
  selectors: duplicateDashboardNewSelectors
};

module.exports = {
  duplicateDashboardNewHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap, {
      openModule: 'Open Duplicate Payments module',
      openDashboard: 'Open Duplicate Payments dashboard',
      selectCustomer: 'Select dashboard customer',
      openRunTypeDropdown: 'Open run type dropdown',
      runScenario: 'Run Duplicate Dashboard New scenario'
    }),
    runScenario,
    selectors: duplicateDashboardNewSelectors
  }
};
