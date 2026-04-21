const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_40_To_verify_that_the_user_can_create_a_role_for_Supplier_Admin", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Login/TS_40_To_verify_that_the_user_can_create_a_role_for_Supplier_Admin.ds"
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
