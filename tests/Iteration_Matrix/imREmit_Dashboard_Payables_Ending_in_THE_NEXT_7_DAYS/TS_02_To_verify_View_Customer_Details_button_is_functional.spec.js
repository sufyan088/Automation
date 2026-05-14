const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesEndingInTheNext7DaysHelpers } = require('./_shared');

test("TS_02_To_verify_View_Customer_Details_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Ending_in_THE_NEXT_7_DAYS/TS_02_To_verify_View_Customer_Details_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open imREmit dashboard for the selected customer', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.openDashboardWorkspace(page, data);
  });

  await test.step('Open and close customer details from the dashboard card', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.openCustomerDetails(page);
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.closeCustomerDetails(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
