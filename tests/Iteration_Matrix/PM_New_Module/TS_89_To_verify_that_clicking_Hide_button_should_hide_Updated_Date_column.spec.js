const { test, loadRuntimeData, loginAsAdmin, closeSession, pmNewModuleHelpers } = require('./_shared');

test("TS_89_To_verify_that_clicking_Hide_button_should_hide_Updated_Date_column", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_New_Module/TS_89_To_verify_that_clicking_Hide_button_should_hide_Updated_Date_column.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await pmNewModuleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
