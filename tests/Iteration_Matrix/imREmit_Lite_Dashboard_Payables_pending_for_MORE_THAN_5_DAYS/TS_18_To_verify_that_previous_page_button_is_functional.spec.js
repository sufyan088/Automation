const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('./_shared');

test("TS_18_To_verify_that_previous_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_pending_for_MORE_THAN_5_DAYS/TS_18_To_verify_that_previous_page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables Pending for More Than 5 Days review list', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openPayablesPendingForMoreThan5DaysList(page, data);
  });

  await test.step('Move forward and then use the previous-page control', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.clickPaginationWhenEnabled(
      page,
      imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.selectors.pagination.next
    );
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.clickPaginationWhenEnabled(
      page,
      imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.selectors.pagination.previous
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
