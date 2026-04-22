const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_22_To_verify_that_the_Invoice_credit_values_criteria_setting_can_be_added", async ({ page }) => {
  const data = loadRuntimeData();
  const criteriaValue = `invoice-${Date.now()}`;
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_22_To_verify_that_the_Invoice_credit_values_criteria_setting_can_be_added.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Add Invoice# credit values criteria', async () => {
    await criteriaSettingsHelpers.openCriteriaCardAction(page, 'Invoice# credit values', 'Add Criteria');
    await criteriaSettingsHelpers.fillCharacterField(page, criteriaValue);
    await criteriaSettingsHelpers.submitCriteriaDialog(page);
    await criteriaSettingsHelpers.expectTableContainsText(page, criteriaValue);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
