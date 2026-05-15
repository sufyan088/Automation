const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardSupplierIsInactiveHelpers } = require('./_shared');

test("TS_13_To_verify_that_Comment_button_is_functional_on_Viewing_Payment_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Supplier_is_inactive/TS_13_To_verify_that_Comment_button_is_functional_on_Viewing_Payment_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open a payment details view from the Supplier is inactive list', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.openPaymentDetails(page, data);
  });

  await test.step('Open the comments section on payment details', async () => {
    await imremitLiteDashboardSupplierIsInactiveHelpers.openCommentsSection(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
