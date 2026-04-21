const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_40_To_verify_that_Supplier_Admin_roles_have_access_to_ticket_creation", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_40_To_verify_that_Supplier_Admin_roles_have_access_to_ticket_creation.ds"
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
