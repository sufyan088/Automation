const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('./_shared');

test("TS_17_To_verify_that_next_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_pending_for_MORE_THAN_5_DAYS/TS_17_To_verify_that_next_page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables Pending for More Than 5 Days review list', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openPayablesPendingForMoreThan5DaysList(page, data);
  });

  await test.step('Use the next-page control when it is enabled', async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const clicked = await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.clickPaginationWhenEnabled(
        page,
        imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.selectors.pagination.next
      );
      if (!clicked) {
        break;
      }
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
