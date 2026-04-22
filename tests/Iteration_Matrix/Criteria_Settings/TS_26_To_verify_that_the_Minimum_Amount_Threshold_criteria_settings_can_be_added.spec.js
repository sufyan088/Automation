const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_26_To_verify_that_the_Minimum_Amount_Threshold_criteria_settings_can_be_added", async ({ page }) => {
  const data = loadRuntimeData();
  const criteriaValue = String(Date.now()).slice(-2);
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_26_To_verify_that_the_Minimum_Amount_Threshold_criteria_settings_can_be_added.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Add Minimum Amount Threshold criteria', async () => {
    await criteriaSettingsHelpers.openCriteriaCardAction(page, 'Minimum Amount Threshold', 'Add Criteria');
    await criteriaSettingsHelpers.fillThresholdField(page, criteriaValue);
    await criteriaSettingsHelpers.submitCriteriaDialog(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
