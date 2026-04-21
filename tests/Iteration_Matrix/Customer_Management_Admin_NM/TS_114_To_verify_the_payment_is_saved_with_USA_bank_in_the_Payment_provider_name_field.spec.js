const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_114_To_verify_the_payment_is_saved_with_USA_bank_in_the_Payment_provider_name_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_114_To_verify_the_payment_is_saved_with_USA_bank_in_the_Payment_provider_name_field.ds"
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
