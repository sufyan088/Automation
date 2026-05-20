const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardSupplierIsInactiveHelpers } = require('./_shared');

test("TS_20_To_verify_that_Payment_Number_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Supplier_is_inactive/TS_20_To_verify_that_Payment_Number_field_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Supplier is inactive review list', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.openSupplierIsInactiveList(page, data);
  });

  await test.step('Search using the payment number field', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.searchByPaymentNumber(page, 'JUN34234E052025');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
