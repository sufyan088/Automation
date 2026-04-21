const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_95_verify_Supplier_Admin_view_fully_paid_payments_status_Closed_Delivered_Delivered_Refund_received_in_Payment_Management", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_New_Module/TS_95_verify_Supplier_Admin_view_fully_paid_payments_status_Closed_Delivered_Delivered_Refund_received_in_Payment_Management.ds"
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
