const { test } = require('@playwright/test');
const { loadRuntimeData, loginAsAdmin, openImRemitModule, openFileProcessing, clickSearchCustomer, enterCustomer, closeSession } = require('./_shared');
const { goToNextPage, goToPreviousPage } = require('../../helpers/fileProcessing');

test('TS_06_To_verify_that_Go_to_previous_page_button_is_functional', async ({ page }) => {
  const data = loadRuntimeData();

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open imREmit', async () => {
    await openImRemitModule(page);
  });

  await test.step('Navigate to File Processing', async () => {
    await openFileProcessing(page);
  });

  await test.step('Click on Search customer', async () => {
    await clickSearchCustomer(page);
  });

  await test.step('Enter Verizon Customer', async () => {
    await enterCustomer(page, data.fileProcessingCustomer);
  });

  await test.step('Click Go to next page', async () => {
    await goToNextPage(page, 3);
  });

  await test.step('Click Go to previous page', async () => {
    await goToPreviousPage(page, 4);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
