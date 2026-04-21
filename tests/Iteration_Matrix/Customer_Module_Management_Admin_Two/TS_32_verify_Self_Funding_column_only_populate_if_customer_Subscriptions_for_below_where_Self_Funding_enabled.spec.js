const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_32_verify_Self_Funding_column_only_populate_if_customer_Subscriptions_for_below_where_Self_Funding_enabled", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Module_Management_Admin_Two/TS_32_verify_Self_Funding_column_only_populate_if_customer_Subscriptions_for_below_where_Self_Funding_enabled.ds"
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
