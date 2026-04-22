const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_20_Verify_that_the_Add_criteria_settings_button_is_functional_on_the_Duplicate_Payments_Criteria_Settings_Page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_20_Verify_that_the_Add_criteria_settings_button_is_functional_on_the_Duplicate_Payments_Criteria_Settings_Page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Open an add criteria dialog from the page', async () => {
    await criteriaSettingsHelpers.openCriteriaCardAction(page, 'Exclude character', 'Add Criteria');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
