const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesMissedInThePast30DaysHelpers } = require('./_shared');

test("TS_07_To_verify_that_Go_to_first_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Missed_in_THE_PAST_30_DAYS/TS_07_To_verify_that_Go_to_first_page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the payables missed list', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.openPayablesMissedList(page, data);
  });

  await test.step('Move to the last page and return to the first page', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.clickPagination(
      page,
      imremitDashboardPayablesMissedInThePast30DaysHelpers.selectors.pagination.last
    );
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.clickPagination(
      page,
      imremitDashboardPayablesMissedInThePast30DaysHelpers.selectors.pagination.first
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
