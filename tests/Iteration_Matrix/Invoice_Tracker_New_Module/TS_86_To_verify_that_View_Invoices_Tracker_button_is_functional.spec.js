const { test, loadRuntimeData, loginAsRole, closeSession, invoiceTrackerNewModuleHelpers } = require('./_shared');

test("TS_86_To_verify_that_View_Invoices_Tracker_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_86_To_verify_that_View_Invoices_Tracker_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsRole(page, data, 'supplierUser');
  });

  await test.step('Run converted flow', async () => {
    await invoiceTrackerNewModuleHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

