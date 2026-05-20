const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('./_shared');

test("TS_19_To_verify_that_first_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_pending_for_MORE_THAN_5_DAYS/TS_19_To_verify_that_first_page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables Pending for More Than 5 Days review list', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openPayablesPendingForMoreThan5DaysList(page, data);
  });

  await test.step('Move to the last page and return to the first page when possible', async () => {
    const movedToLast = await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.clickPaginationWhenEnabled(
      page,
      imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.selectors.pagination.last
    );
    if (movedToLast) {
      await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.clickPaginationWhenEnabled(
        page,
        imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.selectors.pagination.first
      );
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
