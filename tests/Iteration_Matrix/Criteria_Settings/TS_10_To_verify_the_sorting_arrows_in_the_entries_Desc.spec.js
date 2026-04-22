const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_10_To_verify_the_sorting_arrows_in_the_entries_Desc", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_10_To_verify_the_sorting_arrows_in_the_entries_Desc.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Sort criteria type descending', async () => {
    await criteriaSettingsHelpers.openTableHeaderMenu(page, 'Criteria Type');
    await criteriaSettingsHelpers.chooseTableHeaderAction(page, 'Descending');
    await criteriaSettingsHelpers.expectColumnSorted(page, 'Criteria Type', 'desc');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
