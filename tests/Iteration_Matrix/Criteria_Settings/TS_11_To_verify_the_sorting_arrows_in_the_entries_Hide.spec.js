const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_11_To_verify_the_sorting_arrows_in_the_entries_Hide", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_11_To_verify_the_sorting_arrows_in_the_entries_Hide.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Hide the Character column', async () => {
    await criteriaSettingsHelpers.openTableHeaderMenu(page, 'Character');
    await criteriaSettingsHelpers.chooseTableHeaderAction(page, 'Hide column');
    await criteriaSettingsHelpers.verifyTableHeaderHidden(page, 'Character');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
