const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_125_To_verify_a_new_customer_can_be_added_for_statement_recon_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_125_To_verify_a_new_customer_can_be_added_for_statement_recon_module.ds"
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
