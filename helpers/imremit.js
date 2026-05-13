const { safeClick, safeFill, safeExpectVisible, waitForAppToSettle } = require('./actions');
const { imremitSelectors } = require('../selectors/imremit.selectors');

async function openImRemitModule(page) {
  await page.waitForTimeout(2000);
  await safeClick(page, imremitSelectors.moduleCard, 'imREmit module card');
  await safeExpectVisible(page, imremitSelectors.heading, 'imREmit heading');
  await page.waitForTimeout(2000);
}

async function openFileProcessing(page) {
  await safeClick(page, imremitSelectors.fileProcessingNav, 'File Processing navigation');
  await page.waitForTimeout(3000); // Wait for File Processing page navigation to complete
  await waitForAppToSettle(page, 2000);
  // Additional wait to ensure customer selection controls are fully rendered
  try {
    await page.waitForSelector('text:Select All, button:has-text("Select All")', { timeout: 5000 });
  } catch (e) {
    console.log('Select All button not detected in time, proceeding anyway');
  }
}

async function selectCustomerForFileProcessing(page, customerName = 'Verizon Customer') {
  // Ensure customer selector is visible and interactive
  await page.waitForTimeout(2000);
  await safeClick(page, imremitSelectors.selectAllCustomer, 'Select All customer control');
  await safeFill(page, imremitSelectors.customerSearch, customerName, 'Customer search');
  await page.waitForTimeout(2000); // Wait for dropdown to settle
  await safeExpectVisible(page, imremitSelectors.verizonCustomer, `Customer option: ${customerName}`);
  await safeClick(page, imremitSelectors.verizonCustomer, `Customer option: ${customerName}`);
  await page.waitForTimeout(2000); // Wait for customer selection to process
  
  // Critical: Wait for File Processing data grid to fully load after customer selection
  // This is needed before pagination, sorting, or column controls become available
  try {
    await page.waitForSelector('[role="grid"], table, [data-testid*="table"]', { timeout: 5000 });
    console.log('File Processing data grid loaded');
  } catch (e) {
    console.log('Data grid not detected, continuing anyway');
  }
  await page.waitForTimeout(2000); // Additional wait for data grid rendering
}

module.exports = {
  openImRemitModule,
  openFileProcessing,
  selectCustomerForFileProcessing
};
