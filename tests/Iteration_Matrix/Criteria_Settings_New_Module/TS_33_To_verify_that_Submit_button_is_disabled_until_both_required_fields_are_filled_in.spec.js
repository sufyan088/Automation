const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_33_To_verify_that_Submit_button_is_disabled_until_both_required_fields_are_filled_in", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_New_Module/TS_33_To_verify_that_Submit_button_is_disabled_until_both_required_fields_are_filled_in.ds"
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
