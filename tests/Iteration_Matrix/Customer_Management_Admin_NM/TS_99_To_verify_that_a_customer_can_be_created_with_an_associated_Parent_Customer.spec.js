const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_99_To_verify_that_a_customer_can_be_created_with_an_associated_Parent_Customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_99_To_verify_that_a_customer_can_be_created_with_an_associated_Parent_Customer.ds"
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
