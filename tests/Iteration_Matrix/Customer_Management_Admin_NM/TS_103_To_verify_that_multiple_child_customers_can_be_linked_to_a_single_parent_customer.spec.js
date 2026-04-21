const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_103_To_verify_that_multiple_child_customers_can_be_linked_to_a_single_parent_customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_103_To_verify_that_multiple_child_customers_can_be_linked_to_a_single_parent_customer.ds"
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
