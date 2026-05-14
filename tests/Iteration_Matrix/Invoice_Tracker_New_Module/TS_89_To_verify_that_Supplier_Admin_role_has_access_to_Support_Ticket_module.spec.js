const { test, loadRuntimeData, loginAsRole, closeSession, invoiceTrackerNewModuleHelpers } = require('./_shared');

test("TS_89_To_verify_that_Supplier_Admin_role_has_access_to_Support_Ticket_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_89_To_verify_that_Supplier_Admin_role_has_access_to_Support_Ticket_module.ds"
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


