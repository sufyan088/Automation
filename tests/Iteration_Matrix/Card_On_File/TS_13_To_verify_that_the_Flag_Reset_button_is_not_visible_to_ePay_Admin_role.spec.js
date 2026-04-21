const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_13_To_verify_that_the_Flag_Reset_button_is_not_visible_to_ePay_Admin_role", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_13_To_verify_that_the_Flag_Reset_button_is_not_visible_to_ePay_Admin_role.ds"
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
