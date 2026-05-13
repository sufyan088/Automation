const { test } = require('@playwright/test');
const { loadRuntimeData, loginAsAdmin, openImRemitModule, openFileProcessing, clickSearchCustomer, enterCustomer, closeSession, safeExpectVisible, imremitSelectors } = require('./_shared');
const { returnToTop } = require('../../helpers/fileProcessing');

test('TS_14_To_verify_that_Run_To_Top_button_is_functional', async ({ page }) => {
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

  await test.step('Scroll down and click Return to top', async () => {
    await returnToTop(page);
  });

  await test.step('Verify the top page heading is visible again', async () => {
    await safeExpectVisible(page, imremitSelectors.heading, 'imREmit heading at top of page');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
