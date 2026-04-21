const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_49_To_verify_that_the_Next_Payment_button_is_disabled_when_the_Payment_Number_filter_is_applied", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_imREmit_Lite_New/TS_49_To_verify_that_the_Next_Payment_button_is_disabled_when_the_Payment_Number_filter_is_applied.ds"
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
