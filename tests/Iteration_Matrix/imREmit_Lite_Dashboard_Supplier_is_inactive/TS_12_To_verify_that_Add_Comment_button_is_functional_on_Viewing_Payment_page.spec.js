const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardSupplierIsInactiveHelpers } = require('./_shared');

test("TS_12_To_verify_that_Add_Comment_button_is_functional_on_Viewing_Payment_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Supplier_is_inactive/TS_12_To_verify_that_Add_Comment_button_is_functional_on_Viewing_Payment_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open a payment details view from the Supplier is inactive list', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.openPaymentDetails(page, data);
  });

  await test.step('Add a comment to the payment', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.addComment(page, `SupplierInactive-${Date.now()}`);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
