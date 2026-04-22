const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_16_To_verify_that_Add_criteria_settings_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_16_To_verify_that_Add_criteria_settings_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Show the criteria form', async () => {
    await criteriaSettingsHelpers.showCriteriaForm(page);
    await criteriaSettingsHelpers.expectCriteriaFormButtonText(page, /hide criteria form/i);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
