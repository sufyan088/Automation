const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_32_To_verify_that_Submit_setting_button_is_functional_on_Recurring_Payments_pop_up", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_New_Module/TS_32_To_verify_that_Submit_setting_button_is_functional_on_Recurring_Payments_pop_up.ds"
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
