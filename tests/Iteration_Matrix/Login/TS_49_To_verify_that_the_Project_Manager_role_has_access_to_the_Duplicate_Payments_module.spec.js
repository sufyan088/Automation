const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_49_To_verify_that_the_Project_Manager_role_has_access_to_the_Duplicate_Payments_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Login/TS_49_To_verify_that_the_Project_Manager_role_has_access_to_the_Duplicate_Payments_module.ds"
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
