const { test, loadRuntimeData, loginAsAdmin, closeSession, srReportingNewHelpers } = require('./_shared');

test("TS_39_To_Verify_that_cross_icon_is_functional_on_Export_setting_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Reporting_New/TS_39_To_Verify_that_cross_icon_is_functional_on_Export_setting_button.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await srReportingNewHelpers.runScenario(page, data, 'TS_39_To_Verify_that_cross_icon_is_functional_on_Export_setting_button');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
