const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_25_To_verify_that_the_Inv_Sequential_Threshold_criteria_settings_can_be_added", async ({ page }) => {
  const data = loadRuntimeData();
  const criteriaValue = String(Date.now()).slice(-2);
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_25_To_verify_that_the_Inv_Sequential_Threshold_criteria_settings_can_be_added.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Add Inv Sequential Threshold criteria', async () => {
    await criteriaSettingsHelpers.openCriteriaCardAction(page, 'Inv Sequential Threshold', 'Add Criteria');
    await criteriaSettingsHelpers.fillThresholdField(page, criteriaValue);
    await criteriaSettingsHelpers.submitCriteriaDialog(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
