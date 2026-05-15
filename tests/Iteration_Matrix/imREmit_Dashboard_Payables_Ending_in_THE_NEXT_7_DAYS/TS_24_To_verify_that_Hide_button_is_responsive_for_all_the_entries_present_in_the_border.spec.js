const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesEndingInTheNext7DaysHelpers } = require('./_shared');

test("TS_24_To_verify_that_Hide_button_is_responsive_for_all_the_entries_present_in_the_border", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Ending_in_THE_NEXT_7_DAYS/TS_24_To_verify_that_Hide_button_is_responsive_for_all_the_entries_present_in_the_border.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the payables ending in next 7 days list', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.openPayablesEndingList(page, data);
  });

  await test.step('Apply hide-column from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Org Id']) {
      await imremitDashboardPayablesEndingInTheNext7DaysHelpers.clickHeaderAndChoose(
        page,
        label,
        imremitDashboardPayablesEndingInTheNext7DaysHelpers.selectors.menus.hideColumn
      );
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
