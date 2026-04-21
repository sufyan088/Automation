const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_17_To_verify_that_Dsc_button_in_the_sorting_arrows_is_working_fine", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_imREmit_Lite/TS_17_To_verify_that_Dsc_button_in_the_sorting_arrows_is_working_fine.ds"
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
