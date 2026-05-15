const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesMissedInThePast30DaysHelpers } = require('./_shared');

test("TS_27_To_verify_that_Dsc_button_is_responsive_for_all_the_entries_present_in_the_border", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Missed_in_THE_PAST_30_DAYS/TS_27_To_verify_that_Dsc_button_is_responsive_for_all_the_entries_present_in_the_border.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the payables missed list', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.openPayablesMissedList(page, data);
  });

  await test.step('Apply descending order from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Org Id', 'Facility Name', 'Payment Number']) {
      await imremitDashboardPayablesMissedInThePast30DaysHelpers.clickHeaderAndChoose(
        page,
        label,
        imremitDashboardPayablesMissedInThePast30DaysHelpers.selectors.menus.descending
      );
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
