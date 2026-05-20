const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('./_shared');

test("TS_02_To_verify_that_view_customer_details_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_pending_for_MORE_THAN_5_DAYS/TS_02_To_verify_that_view_customer_details_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the imREmit Lite dashboard workspace', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openDashboardWorkspace(page, data, {
      preferredCustomer: 'Batch Customer QA'
    });
  });

  await test.step('Open customer details from the dashboard', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openCustomerDetails(page);
  });

  await test.step('Close customer details and return to the dashboard', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.closeCustomerDetails(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
