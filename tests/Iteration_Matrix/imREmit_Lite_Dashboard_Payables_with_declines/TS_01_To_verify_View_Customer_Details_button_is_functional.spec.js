const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_01_To_verify_View_Customer_Details_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_01_To_verify_View_Customer_Details_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the imREmit Lite dashboard workspace', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openDashboardWorkspace(page, data);
  });

  await test.step('Open customer details from the dashboard', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openCustomerDetails(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
