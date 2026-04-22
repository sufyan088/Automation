const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_06_To_verify_that_the_Column_Names_can_be_toggled", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_06_To_verify_that_the_Column_Names_can_be_toggled.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Toggle Description column off and on again', async () => {
    await criteriaSettingsHelpers.openColumnViewsMenu(page);
    await criteriaSettingsHelpers.clickColumnViewOption(page, 'Description');
    await criteriaSettingsHelpers.verifyTableHeaderHidden(page, 'Description');

    await criteriaSettingsHelpers.openColumnViewsMenu(page);
    await criteriaSettingsHelpers.clickColumnViewOption(page, 'Description');
    await criteriaSettingsHelpers.verifyTableHeaderVisible(page, 'Description');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
