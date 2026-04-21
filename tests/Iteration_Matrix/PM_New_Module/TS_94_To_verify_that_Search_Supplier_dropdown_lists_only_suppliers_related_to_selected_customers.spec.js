const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_94_To_verify_that_Search_Supplier_dropdown_lists_only_suppliers_related_to_selected_customers", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_New_Module/TS_94_To_verify_that_Search_Supplier_dropdown_lists_only_suppliers_related_to_selected_customers.ds"
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
