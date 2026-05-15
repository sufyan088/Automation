const { test, loadRuntimeData, loginAsAdmin, closeSession, srReportingHelpers } = require('./_shared');

test("TS_13_To_verify_that_User_Name_and_of_Statements_columns_are_shown_in_Reporting_table", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Reporting/TS_13_To_verify_that_User_Name_and_of_Statements_columns_are_shown_in_Reporting_table.ds"
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
