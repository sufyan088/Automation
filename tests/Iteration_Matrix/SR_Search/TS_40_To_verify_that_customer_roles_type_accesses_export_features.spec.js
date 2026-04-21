const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_40_To_verify_that_customer_roles_type_accesses_export_features", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search/TS_40_To_verify_that_customer_roles_type_accesses_export_features.ds"
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
