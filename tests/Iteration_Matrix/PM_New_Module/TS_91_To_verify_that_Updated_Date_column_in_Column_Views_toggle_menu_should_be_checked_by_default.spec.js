const { test, loadRuntimeData, loginAsAdmin, closeSession, pmNewModuleHelpers } = require('./_shared');

test("TS_91_To_verify_that_Updated_Date_column_in_Column_Views_toggle_menu_should_be_checked_by_default", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_New_Module/TS_91_To_verify_that_Updated_Date_column_in_Column_Views_toggle_menu_should_be_checked_by_default.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await pmNewModuleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
