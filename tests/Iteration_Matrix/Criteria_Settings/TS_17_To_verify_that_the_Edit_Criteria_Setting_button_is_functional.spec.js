const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_17_To_verify_that_the_Edit_Criteria_Setting_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_17_To_verify_that_the_Edit_Criteria_Setting_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Open edit criteria setting dialog', async () => {
    await criteriaSettingsHelpers.openFirstRowActionsMenu(page);
    await criteriaSettingsHelpers.chooseRowAction(page, 'Edit Criteria Setting');
    await criteriaSettingsHelpers.expectDialogText(page, 'Edit Criteria Setting');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
