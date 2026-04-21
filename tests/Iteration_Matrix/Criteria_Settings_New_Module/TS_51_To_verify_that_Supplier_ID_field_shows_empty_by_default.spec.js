const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_51_To_verify_that_Supplier_ID_field_shows_empty_by_default", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_New_Module/TS_51_To_verify_that_Supplier_ID_field_shows_empty_by_default.ds"
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
