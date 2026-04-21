const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_74_To_Verify_that_user_can_click_on_Click_on_Enable_Initial_Run_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_74_To_Verify_that_user_can_click_on_Click_on_Enable_Initial_Run_button.ds"
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
