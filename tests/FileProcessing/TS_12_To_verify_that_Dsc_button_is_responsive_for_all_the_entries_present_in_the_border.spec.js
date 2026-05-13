const { test } = require('@playwright/test');
const { loadRuntimeData, loginAsAdmin, openImRemitModule, openFileProcessing, clickSearchCustomer, enterCustomer, closeSession } = require('./_shared');
const { openPackageIdColumnMenu, applyDescending } = require('../../helpers/fileProcessing');

test('TS_12_To_verify_that_Dsc_button_is_responsive_for_all_the_entries_present_in_the_border', async ({ page }) => {
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

  await test.step('Open the Package ID column menu', async () => {
    await openPackageIdColumnMenu(page);
  });

  await test.step('Verify and click the Descending menu option', async () => {
    await applyDescending(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
