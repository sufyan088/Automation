const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardSupplierIsInactiveHelpers } = require('./_shared');

test("TS_06_To_verify_that_Start_Date_and_End_Date_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Supplier_is_inactive/TS_06_To_verify_that_Start_Date_and_End_Date_field_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Supplier is inactive review list', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.openSupplierIsInactiveList(page, data);
  });

  await test.step('Select a start date and end date range', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.chooseDateRange(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
