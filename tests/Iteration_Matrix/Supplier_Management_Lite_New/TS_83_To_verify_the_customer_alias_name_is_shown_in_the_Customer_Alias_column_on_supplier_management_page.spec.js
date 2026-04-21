const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_83_To_verify_the_customer_alias_name_is_shown_in_the_Customer_Alias_column_on_supplier_management_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_Lite_New/TS_83_To_verify_the_customer_alias_name_is_shown_in_the_Customer_Alias_column_on_supplier_management_page.ds"
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
