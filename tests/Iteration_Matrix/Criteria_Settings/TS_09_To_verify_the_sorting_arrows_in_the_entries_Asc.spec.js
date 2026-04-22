const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_09_To_verify_the_sorting_arrows_in_the_entries_Asc", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_09_To_verify_the_sorting_arrows_in_the_entries_Asc.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Sort criteria type ascending', async () => {
    await criteriaSettingsHelpers.openTableHeaderMenu(page, 'Criteria Type');
    await criteriaSettingsHelpers.chooseTableHeaderAction(page, 'Ascending');
    await criteriaSettingsHelpers.expectColumnSorted(page, 'Criteria Type', 'asc');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
