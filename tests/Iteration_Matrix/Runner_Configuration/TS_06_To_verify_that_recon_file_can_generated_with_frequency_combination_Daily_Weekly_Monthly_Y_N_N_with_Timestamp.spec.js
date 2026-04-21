const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_06_To_verify_that_recon_file_can_generated_with_frequency_combination_Daily_Weekly_Monthly_Y_N_N_with_Timestamp", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_06_To_verify_that_recon_file_can_generated_with_frequency_combination_Daily_Weekly_Monthly_Y_N_N_with_Timestamp.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
