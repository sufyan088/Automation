const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesEndingInTheNext7DaysHelpers } = require('./_shared');

test("TS_29_To_verify_that_Go_to_first_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Ending_in_THE_NEXT_7_DAYS/TS_29_To_verify_that_Go_to_first_page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the payables ending in next 7 days list', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.openPayablesEndingList(page, data);
  });

  await test.step('Move to the last page and return to the first page', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.clickPagination(
      page,
      imremitDashboardPayablesEndingInTheNext7DaysHelpers.selectors.pagination.last
    );
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.clickPagination(
      page,
      imremitDashboardPayablesEndingInTheNext7DaysHelpers.selectors.pagination.first
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
