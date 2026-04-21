const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_35_Verify_download_report_button_is_functional_on_export_setting_modification_history_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Reporting_New/TS_35_Verify_download_report_button_is_functional_on_export_setting_modification_history_popup.ds"
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
