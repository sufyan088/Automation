const { test, loadRuntimeData, loginAsAdmin, closeSession, invoiceTrackerModuleHelpers } = require('./_shared');

test("TS_94_To_verify_that_Payment_Method_filter_should_be_Populates_ONLY_after_customer_is_selected", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_Module/TS_94_To_verify_that_Payment_Method_filter_should_be_Populates_ONLY_after_customer_is_selected.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await invoiceTrackerModuleHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
