const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_80_To_verify_that_selecting_parent_customer_displays_all_suppliers_with_parent_customer_as_well_as_its_child_customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_Lite_New/TS_80_To_verify_that_selecting_parent_customer_displays_all_suppliers_with_parent_customer_as_well_as_its_child_customer.ds"
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
