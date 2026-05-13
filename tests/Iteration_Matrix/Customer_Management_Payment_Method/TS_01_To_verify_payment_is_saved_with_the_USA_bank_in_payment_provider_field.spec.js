const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementPaymentMethodHelpers } = require('./_shared');

test("TS_01_To_verify_payment_is_saved_with_the_USA_bank_in_payment_provider_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Payment_Method/TS_01_To_verify_payment_is_saved_with_the_USA_bank_in_payment_provider_field.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementPaymentMethodHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
