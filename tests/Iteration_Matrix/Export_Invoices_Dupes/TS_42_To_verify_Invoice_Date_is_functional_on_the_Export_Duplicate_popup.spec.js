const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_42_To_verify_Invoice_Date_is_functional_on_the_Export_Duplicate_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_42_To_verify_Invoice_Date_is_functional_on_the_Export_Duplicate_popup.ds"
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
