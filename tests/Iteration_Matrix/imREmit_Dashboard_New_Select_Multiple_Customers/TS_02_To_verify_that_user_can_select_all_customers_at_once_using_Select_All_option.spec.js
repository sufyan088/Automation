const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardNewSelectMultipleCustomersHelpers } = require('./_shared');

test("TS_02_To_verify_that_user_can_select_all_customers_at_once_using_Select_All_option", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard_New/Select_Multiple_Customers/TS_02_To_verify_that_user_can_select_all_customers_at_once_using_Select_All_option.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await imremitDashboardNewSelectMultipleCustomersHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
