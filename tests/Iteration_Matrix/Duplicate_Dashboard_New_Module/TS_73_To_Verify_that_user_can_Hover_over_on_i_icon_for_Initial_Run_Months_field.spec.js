const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_73_To_Verify_that_user_can_Hover_over_on_i_icon_for_Initial_Run_Months_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_73_To_Verify_that_user_can_Hover_over_on_i_icon_for_Initial_Run_Months_field.ds"
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
