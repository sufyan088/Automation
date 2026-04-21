const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_56_To_verify_Ignore_Leading_Trailing_Characters_and_Potential_Match_setting_are_applied_at_same_time", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_56_To_verify_Ignore_Leading_Trailing_Characters_and_Potential_Match_setting_are_applied_at_same_time.ds"
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
