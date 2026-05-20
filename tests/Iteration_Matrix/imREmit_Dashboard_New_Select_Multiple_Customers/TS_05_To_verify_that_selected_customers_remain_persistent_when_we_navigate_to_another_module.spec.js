const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardNewSelectMultipleCustomersHelpers } = require('./_shared');

test("TS_05_To_verify_that_selected_customers_remain_persistent_when_we_navigate_to_another_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard_New/Select_Multiple_Customers/TS_05_To_verify_that_selected_customers_remain_persistent_when_we_navigate_to_another_module.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await imremitDashboardNewSelectMultipleCustomersHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
