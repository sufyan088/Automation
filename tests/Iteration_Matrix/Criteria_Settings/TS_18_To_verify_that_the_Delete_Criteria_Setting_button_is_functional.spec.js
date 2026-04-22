const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_18_To_verify_that_the_Delete_Criteria_Setting_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_18_To_verify_that_the_Delete_Criteria_Setting_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Open delete criteria setting confirmation', async () => {
    await criteriaSettingsHelpers.openFirstRowActionsMenu(page);
    await criteriaSettingsHelpers.chooseRowAction(page, 'Delete Criteria Setting');
    await criteriaSettingsHelpers.expectDialogText(page, 'Confirm deletion?');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
