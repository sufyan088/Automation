const { test, loadRuntimeData, loginAsAdmin, closeSession, srReportingNewHelpers } = require('./_shared');

test("TS_36_To_Verify_download_report_button_is_functional_on_options_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Reporting_New/TS_36_To_Verify_download_report_button_is_functional_on_options_button.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await srReportingNewHelpers.runScenario(page, data, 'TS_36_To_Verify_download_report_button_is_functional_on_options_button');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
