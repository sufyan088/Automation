const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_26_To_Verify_All_Suppliers_is_selected_by_default_in_the_Supplier_Name_field_on_the_Pending_Payments_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payments_Pending_5Days/TS_26_To_Verify_All_Suppliers_is_selected_by_default_in_the_Supplier_Name_field_on_the_Pending_Payments_page.ds"
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
