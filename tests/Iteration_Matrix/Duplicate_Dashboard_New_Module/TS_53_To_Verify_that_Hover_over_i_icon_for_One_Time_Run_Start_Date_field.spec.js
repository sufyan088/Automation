const { test, loadRuntimeData, loginAsAdmin, closeSession, duplicateDashboardNewModuleHelpers } = require('./_shared');

test("TS_53_To_Verify_that_Hover_over_i_icon_for_One_Time_Run_Start_Date_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_53_To_Verify_that_Hover_over_i_icon_for_One_Time_Run_Start_Date_field.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await duplicateDashboardNewModuleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

