const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_23_To_verify_that_Return_To_Top_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_23_To_verify_that_Return_To_Top_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables with Declines review list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPayablesWithDeclinesList(page, data);
  });

  await test.step('Scroll down and return to the top of the payment list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.returnToTopOfPaymentList(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
