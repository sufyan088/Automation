const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardSupplierIsInactiveHelpers } = require('./_shared');

test("TS_02_To_verify_that_Last_Page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Supplier_is_inactive/TS_02_To_verify_that_Last_Page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Supplier is inactive review list', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.openSupplierIsInactiveList(page, data);
  });

  await test.step('Use the last page control when it is enabled', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.clickPaginationWhenEnabled(page, imremitLiteDashboardSupplierIsInactiveHelpers.selectors.pagination.last);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
