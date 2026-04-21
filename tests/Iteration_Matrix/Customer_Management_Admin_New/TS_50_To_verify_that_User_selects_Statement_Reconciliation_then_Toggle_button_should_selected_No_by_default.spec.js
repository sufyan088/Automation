const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_50_To_verify_that_User_selects_Statement_Reconciliation_then_Toggle_button_should_selected_No_by_default", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_New/TS_50_To_verify_that_User_selects_Statement_Reconciliation_then_Toggle_button_should_selected_No_by_default.ds"
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
