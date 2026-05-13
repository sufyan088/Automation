const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardNewSelectMultipleCustomersHelpers } = require('./_shared');

test("TS_03_To_verify_that_when_multiple_customers_are_selected_Customer_Information_section_is_hidden", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard_New/Select_Multiple_Customers/TS_03_To_verify_that_when_multiple_customers_are_selected_Customer_Information_section_is_hidden.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await imremitDashboardNewSelectMultipleCustomersHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
