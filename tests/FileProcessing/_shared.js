const { loadRuntimeData } = require('../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../helpers/auth');
const { openImRemitModule, openFileProcessing, selectCustomerForFileProcessing } = require('../../helpers/imremit');
const { safeClick, safeFill, safeExpectVisible } = require('../../helpers/actions');
const { imremitSelectors } = require('../../selectors/imremit.selectors');

async function loginAndOpenImRemit(page) {
  const data = loadRuntimeData();
  await loginAsAdmin(page, data);
  await openImRemitModule(page);
  return data;
}

async function openFileProcessingWithCustomer(page) {
  const data = await loginAndOpenImRemit(page);
  await openFileProcessing(page);
  await safeExpectVisible(page, imremitSelectors.heading, 'imREmit heading on File Processing page');
  await selectCustomerForFileProcessing(page, data.fileProcessingCustomer);
  return data;
}

async function clickSearchCustomer(page) {
  await page.waitForTimeout(2000);
  await safeClick(page, imremitSelectors.selectAllCustomer, 'Select All customer control');
}

async function enterCustomer(page, customerName = 'Verizon Customer') {
  await safeFill(page, imremitSelectors.customerSearch, customerName, 'Customer search');
  await page.waitForTimeout(2000);
  await safeExpectVisible(page, imremitSelectors.verizonCustomer, `Customer option: ${customerName}`);
  await safeClick(page, imremitSelectors.verizonCustomer, `Customer option: ${customerName}`);
  await page.waitForTimeout(2000);

  try {
    await page.waitForSelector('[role="grid"], table, [data-testid*="table"]', { timeout: 5000 });
    console.log('File Processing data grid loaded');
  } catch (error) {
    console.log('Data grid not detected, continuing anyway');
  }
  await page.waitForTimeout(2000);
}

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  openImRemitModule,
  loginAndOpenImRemit,
  openFileProcessingWithCustomer,
  closeSession,
  openFileProcessing,
  clickSearchCustomer,
  enterCustomer,
  selectCustomerForFileProcessing,
  safeExpectVisible,
  imremitSelectors
};
