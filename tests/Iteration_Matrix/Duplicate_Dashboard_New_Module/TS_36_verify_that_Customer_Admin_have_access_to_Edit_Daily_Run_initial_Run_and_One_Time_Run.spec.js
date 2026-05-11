const { test, loadRuntimeData, loginAsAdmin, closeSession, duplicateDashboardNewModuleHelpers } = require('./_shared');

test("TS_36_verify_that_Customer_Admin_have_access_to_Edit_Daily_Run_initial_Run_and_One_Time_Run", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_36_verify_that_Customer_Admin_have_access_to_Edit_Daily_Run_initial_Run_and_One_Time_Run.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await duplicateDashboardNewModuleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

