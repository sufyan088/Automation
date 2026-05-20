const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardNewSelectMultipleCustomersHelpers } = require('./_shared');

test("TS_01_To_verify_that_user_can_select_multiple_customers_from_Select_Customers_dropdown_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard_New/Select_Multiple_Customers/TS_01_To_verify_that_user_can_select_multiple_customers_from_Select_Customers_dropdown_field.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await imremitDashboardNewSelectMultipleCustomersHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
