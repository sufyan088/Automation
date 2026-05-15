const { test, loadRuntimeData, loginAsAdmin, closeSession, srReportingHelpers } = require('./_shared');

test("TS_05_To_verify_that_Reporting_tab_is_showing_on_left_side_of_all_other_tabs", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Reporting/TS_05_To_verify_that_Reporting_tab_is_showing_on_left_side_of_all_other_tabs.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await srReportingHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
