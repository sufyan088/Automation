const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_60_To_verify_that_once_Run_is_completed_make_Duplicate_Payments_Settings_editable_for_user", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_60_To_verify_that_once_Run_is_completed_make_Duplicate_Payments_Settings_editable_for_user.ds"
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
