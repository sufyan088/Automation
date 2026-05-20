const { test, loadRuntimeData, loginAsRole, closeSession, invoiceTrackerNewModuleHelpers } = require('./_shared');

test("TS_67_To_verify_that_Ticket_Number_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_67_To_verify_that_Ticket_Number_field_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsRole(page, { ...data, Username_Supplier_Admin: 'supplieradmin3', Password_Supplier_Admin: '1234' }, 'supplierAdmin');
  });

  await test.step('Run converted flow', async () => {
    await invoiceTrackerNewModuleHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});


