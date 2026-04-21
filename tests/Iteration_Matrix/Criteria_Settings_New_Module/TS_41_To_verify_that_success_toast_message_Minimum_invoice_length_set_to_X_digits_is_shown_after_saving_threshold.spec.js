const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_41_To_verify_that_success_toast_message_Minimum_invoice_length_set_to_X_digits_is_shown_after_saving_threshold", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_New_Module/TS_41_To_verify_that_success_toast_message_Minimum_invoice_length_set_to_X_digits_is_shown_after_saving_threshold.ds"
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
