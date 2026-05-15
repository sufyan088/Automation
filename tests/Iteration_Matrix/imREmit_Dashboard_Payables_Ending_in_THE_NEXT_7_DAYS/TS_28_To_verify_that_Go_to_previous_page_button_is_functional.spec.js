const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesEndingInTheNext7DaysHelpers } = require('./_shared');

test("TS_28_To_verify_that_Go_to_previous_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Ending_in_THE_NEXT_7_DAYS/TS_28_To_verify_that_Go_to_previous_page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the payables ending in next 7 days list', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.openPayablesEndingList(page, data);
  });

  await test.step('Move forward and return through the previous-page control', async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await imremitDashboardPayablesEndingInTheNext7DaysHelpers.clickPagination(
        page,
        imremitDashboardPayablesEndingInTheNext7DaysHelpers.selectors.pagination.next
      );
      await imremitDashboardPayablesEndingInTheNext7DaysHelpers.clickPagination(
        page,
        imremitDashboardPayablesEndingInTheNext7DaysHelpers.selectors.pagination.previous
      );
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
