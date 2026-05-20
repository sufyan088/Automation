const { test, loadRuntimeData, loginAsAdmin, closeSession, supplierManagementImremitPremiumHelpers } = require('./_shared');

test("TS_41_To_verify_that_search_supplier_id_name_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_(Premium)/TS_41_To_verify_that_search_supplier_id_name_field_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await supplierManagementImremitPremiumHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
