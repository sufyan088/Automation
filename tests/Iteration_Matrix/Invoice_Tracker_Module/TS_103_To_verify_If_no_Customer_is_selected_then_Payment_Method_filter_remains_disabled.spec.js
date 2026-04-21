const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_103_To_verify_If_no_Customer_is_selected_then_Payment_Method_filter_remains_disabled", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_Module/TS_103_To_verify_If_no_Customer_is_selected_then_Payment_Method_filter_remains_disabled.ds"
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
