const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_65_To_verify_that_Project_Manager_can_create_a_user_role_for_Customer_User", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Login/TS_65_To_verify_that_Project_Manager_can_create_a_user_role_for_Customer_User.ds"
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
