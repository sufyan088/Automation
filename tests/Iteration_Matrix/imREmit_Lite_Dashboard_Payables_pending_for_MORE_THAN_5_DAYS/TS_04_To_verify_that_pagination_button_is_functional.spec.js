const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('./_shared');

test("TS_04_To_verify_that_pagination_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_pending_for_MORE_THAN_5_DAYS/TS_04_To_verify_that_pagination_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables Pending for More Than 5 Days review list', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openPayablesPendingForMoreThan5DaysList(page, data);
  });

  await test.step('Open the page-size control and choose the supported values', async () => {
    for (const value of ['25', '50', '100', '5', '10']) {
      await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.choosePaginationOption(page, value);
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
