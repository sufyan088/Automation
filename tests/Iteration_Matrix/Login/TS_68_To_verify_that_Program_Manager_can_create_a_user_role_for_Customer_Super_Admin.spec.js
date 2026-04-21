const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_68_To_verify_that_Program_Manager_can_create_a_user_role_for_Customer_Super_Admin", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Login/TS_68_To_verify_that_Program_Manager_can_create_a_user_role_for_Customer_Super_Admin.ds"
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
