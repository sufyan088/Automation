const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_30_To_verify_after_adding_the_add_criteria_of_any_module_can_be_shown_in_the_below_Criteria_Type_column", async ({ page }) => {
  const data = loadRuntimeData();
  const criteriaValue = `type-${Date.now()}`;
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_30_To_verify_after_adding_the_add_criteria_of_any_module_can_be_shown_in_the_below_Criteria_Type_column.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Add criteria and verify it appears in the table', async () => {
    await criteriaSettingsHelpers.openCriteriaCardAction(page, 'Suffix ID', 'Add Criteria');
    await criteriaSettingsHelpers.fillCharacterField(page, criteriaValue);
    await criteriaSettingsHelpers.submitCriteriaDialog(page);
    await criteriaSettingsHelpers.expectTableContainsText(page, 'Suffix ID');
    await criteriaSettingsHelpers.expectTableContainsText(page, criteriaValue);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
