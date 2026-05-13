const { test, loadRuntimeData, loginAsAdmin, closeSession, duplicateDashboardNewModuleHelpers } = require('./_shared');

test("TS_52_To_verify_that_One_Time_Run_Start_Date_date_field_is_mandatory", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_52_To_verify_that_One_Time_Run_Start_Date_date_field_is_mandatory.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await duplicateDashboardNewModuleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

