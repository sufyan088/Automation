const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('./_shared');

test("TS_20_To_verify_that_last_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_pending_for_MORE_THAN_5_DAYS/TS_20_To_verify_that_last_page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables Pending for More Than 5 Days review list', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openPayablesPendingForMoreThan5DaysList(page, data);
  });

  await test.step('Use the last-page control when it is enabled', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.clickPaginationWhenEnabled(
      page,
      imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.selectors.pagination.last
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
