const { chromium } = require('playwright');
const { loadRuntimeData } = require('../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin } = require('../helpers/iteration-matrix/auth');

async function openTracker(page) {
  await page.getByRole('link', { name: /Invoice[s]? Tracker/i }).first().click();
  await page.getByRole('heading', { name: 'Invoices', exact: true }).waitFor({ state: 'visible' });
}

async function openCustomerPicker(page) {
  await page.getByRole('combobox').filter({ hasText: /Select customers|min 3 characters/i }).first().click();
  const input = page.getByPlaceholder(/Search customers/).first();
  await input.fill('');
  return input;
}

async function selectNthCustomer(page, index) {
  const input = await openCustomerPicker(page);
  for (let count = 0; count <= index; count += 1) {
    await input.press('ArrowDown');
  }
  await input.press('Enter');
  await page.keyboard.press('Escape').catch(() => null);
}

async function readState(page) {
  const customerText = await page.locator('[role="combobox"]').nth(2).innerText().catch(() => '');
  await page.getByRole('button', { name: /Advanced Search/i }).click();
  const paymentMethodText = await page.getByText('Payment Method', { exact: true }).locator('xpath=following::*[@role="combobox"][1]').first().innerText().catch(() => '');
  return { customerText, paymentMethodText };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(120000);
  page.setDefaultTimeout(120000);
  const data = loadRuntimeData();

  try {
    await loginAsAdmin(page, data);
    await openTracker(page);
    const results = [];

    for (let index = 0; index < 5; index += 1) {
      await page.getByRole('button', { name: /Reset search/i }).click().catch(() => null);
      await page.waitForLoadState('domcontentloaded').catch(() => null);
      await selectNthCustomer(page, index);
      const state = await readState(page);
      results.push({ index, ...state });
    }

    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
