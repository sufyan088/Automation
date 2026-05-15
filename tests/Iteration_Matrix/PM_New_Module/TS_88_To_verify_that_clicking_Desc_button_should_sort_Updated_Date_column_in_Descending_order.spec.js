const { test, loadRuntimeData, loginAsAdmin, closeSession, pmNewModuleHelpers } = require('./_shared');

test("TS_88_To_verify_that_clicking_Desc_button_should_sort_Updated_Date_column_in_Descending_order", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_New_Module/TS_88_To_verify_that_clicking_Desc_button_should_sort_Updated_Date_column_in_Descending_order.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await pmNewModuleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
