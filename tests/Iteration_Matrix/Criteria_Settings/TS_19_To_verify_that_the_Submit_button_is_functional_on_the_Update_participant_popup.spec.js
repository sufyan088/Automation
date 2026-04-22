const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_19_To_verify_that_the_Submit_button_is_functional_on_the_Update_participant_popup  ", async ({ page }) => {
  const data = loadRuntimeData();
  const updatedValue = `edit-${Date.now()}`;
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_19_To_verify_that_the_Submit_button_is_functional_on_the_Update_participant_popup  .ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Edit the first criteria setting and submit changes', async () => {
    await criteriaSettingsHelpers.openFirstRowActionsMenu(page);
    await criteriaSettingsHelpers.chooseRowAction(page, 'Edit Criteria Setting');
    await criteriaSettingsHelpers.fillCharacterField(page, updatedValue);
    await criteriaSettingsHelpers.submitCriteriaDialog(page);
    await criteriaSettingsHelpers.expectTableContainsText(page, updatedValue);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
