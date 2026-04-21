const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_98_verify_that_Payment_Method_dropdown_should_automatically_load_payment_methods_associated_with_that_customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_Module/TS_98_verify_that_Payment_Method_dropdown_should_automatically_load_payment_methods_associated_with_that_customer.ds"
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
