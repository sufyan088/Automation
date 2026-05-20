const { test, loadRuntimeData, loginAsRole, closeSession, invoiceTrackerModuleHelpers } = require('./_shared');

test("TS_98_verify_that_Payment_Method_dropdown_should_automatically_load_payment_methods_associated_with_that_customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_Module/TS_98_verify_that_Payment_Method_dropdown_should_automatically_load_payment_methods_associated_with_that_customer.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsRole(page, data, 'customerAdmin');
  });

  await test.step('Run converted flow', async () => {
    await invoiceTrackerModuleHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
