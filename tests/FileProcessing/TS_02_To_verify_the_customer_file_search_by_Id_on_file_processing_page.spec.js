const { test } = require('@playwright/test');
const { loadRuntimeData, loginAsAdmin, openImRemitModule, closeSession, openFileProcessing, clickSearchCustomer, enterCustomer, safeExpectVisible, imremitSelectors } = require('./_shared');
const { searchById } = require('../../helpers/fileProcessing');

test('TS_02_To_verify_the_customer_file_search_by_Id_on_file_processing_page', async ({ page }) => {
  const data = loadRuntimeData();

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open imREmit', async () => {
    await openImRemitModule(page);
  });

  await test.step('Navigate to File Processing', async () => {
    await openFileProcessing(page);
    await safeExpectVisible(page, imremitSelectors.heading, 'imREmit heading');
  });

  await test.step('Click on Search customer', async () => {
    await clickSearchCustomer(page);
  });

  await test.step('Enter Verizon Customer', async () => {
    await enterCustomer(page, data.fileProcessingCustomer);
  });

  await test.step('Enter the value in search field', async () => {
    await searchById(page, data.fileProcessingSearchId);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
