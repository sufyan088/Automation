const { test, loadRuntimeData, loginAsRole, closeSession, invoiceTrackerModuleHelpers } = require('./_shared');

test("TS_102_To_verify_that_only_after_a_Customer_has_selected_then_Payment_Method_filter_become_enabled", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_Module/TS_102_To_verify_that_only_after_a_Customer_has_selected_then_Payment_Method_filter_become_enabled.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsRole(page, data, 'supplierUser');
  });

  await test.step('Run converted flow', async () => {
    await invoiceTrackerModuleHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
