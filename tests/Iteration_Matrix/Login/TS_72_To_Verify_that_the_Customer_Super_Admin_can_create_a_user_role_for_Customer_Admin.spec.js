const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_72_To_Verify_that_the_Customer_Super_Admin_can_create_a_user_role_for_Customer_Admin", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Login/TS_72_To_Verify_that_the_Customer_Super_Admin_can_create_a_user_role_for_Customer_Admin.ds"
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
