const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_37_To_Verify_that_file_name_field_is_editable_on_options_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Reporting_New/TS_37_To_Verify_that_file_name_field_is_editable_on_options_button.ds"
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
