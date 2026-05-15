const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('./_shared');

test("TS_22_To_verify_the_sorting_arrows_in_entries_desc", async ({ page }) => {
  test.setTimeout(180000);
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_pending_for_MORE_THAN_5_DAYS/TS_22_To_verify_the_sorting_arrows_in_entries_desc.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables Pending for More Than 5 Days review list', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openPayablesPendingForMoreThan5DaysList(page, data);
  });

  await test.step('Apply descending order from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Payment Number', 'Sent Date', 'Status Description']) {
      await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.clickHeaderAndChoose(
        page,
        label,
        imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.selectors.menus.descending
      );
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
