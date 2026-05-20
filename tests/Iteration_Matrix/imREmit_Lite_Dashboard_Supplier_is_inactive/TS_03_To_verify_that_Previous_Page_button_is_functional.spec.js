const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardSupplierIsInactiveHelpers } = require('./_shared');

test("TS_03_To_verify_that_Previous_Page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Supplier_is_inactive/TS_03_To_verify_that_Previous_Page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Supplier is inactive review list', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.openSupplierIsInactiveList(page, data);
  });

  await test.step('Move to the next page and back to the previous page', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.clickPaginationWhenEnabled(page, imremitLiteDashboardSupplierIsInactiveHelpers.selectors.pagination.next);
    await imremitLiteDashboardSupplierIsInactiveHelpers.clickPaginationWhenEnabled(page, imremitLiteDashboardSupplierIsInactiveHelpers.selectors.pagination.previous);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
