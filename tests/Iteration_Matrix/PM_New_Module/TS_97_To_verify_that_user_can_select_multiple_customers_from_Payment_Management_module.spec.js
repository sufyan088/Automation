const { test, loadRuntimeData, loginAsAdmin, closeSession, pmNewModuleHelpers } = require('./_shared');

test("TS_97_To_verify_that_user_can_select_multiple_customers_from_Payment_Management_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_New_Module/TS_97_To_verify_that_user_can_select_multiple_customers_from_Payment_Management_module.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await pmNewModuleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
