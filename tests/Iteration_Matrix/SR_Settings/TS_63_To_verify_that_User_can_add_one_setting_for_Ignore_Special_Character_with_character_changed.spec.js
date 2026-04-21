const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_63_To_verify_that_User_can_add_one_setting_for_Ignore_Special_Character_with_character_changed", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_63_To_verify_that_User_can_add_one_setting_for_Ignore_Special_Character_with_character_changed.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
