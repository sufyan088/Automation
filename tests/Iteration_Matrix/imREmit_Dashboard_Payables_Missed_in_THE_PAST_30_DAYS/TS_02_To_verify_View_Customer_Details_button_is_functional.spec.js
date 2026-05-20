const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesMissedInThePast30DaysHelpers } = require('./_shared');

test("TS_02_To_verify_View_Customer_Details_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Missed_in_THE_PAST_30_DAYS/TS_02_To_verify_View_Customer_Details_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open imREmit dashboard for the selected customer', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.openDashboardWorkspace(page, data);
  });

  await test.step('Open and close customer details from the dashboard card', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.openCustomerDetails(page);
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.closeCustomerDetails(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
