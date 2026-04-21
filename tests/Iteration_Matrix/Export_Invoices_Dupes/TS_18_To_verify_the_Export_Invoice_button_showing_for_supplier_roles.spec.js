const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_18_To_verify_the_Export_Invoice_button_showing_for_supplier_roles", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_18_To_verify_the_Export_Invoice_button_showing_for_supplier_roles.ds"
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
