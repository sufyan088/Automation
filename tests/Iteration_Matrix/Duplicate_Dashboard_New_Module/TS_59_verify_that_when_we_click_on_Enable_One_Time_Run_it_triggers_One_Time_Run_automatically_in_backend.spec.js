const { test, loadRuntimeData, loginAsAdmin, closeSession, duplicateDashboardNewModuleHelpers } = require('./_shared');

test("TS_59_verify_that_when_we_click_on_Enable_One_Time_Run_it_triggers_One_Time_Run_automatically_in_backend", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_59_verify_that_when_we_click_on_Enable_One_Time_Run_it_triggers_One_Time_Run_automatically_in_backend.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await duplicateDashboardNewModuleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

