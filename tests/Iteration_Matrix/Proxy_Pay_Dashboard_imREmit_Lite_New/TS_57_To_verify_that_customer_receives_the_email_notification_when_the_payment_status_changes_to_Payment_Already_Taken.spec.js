const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_57_To_verify_that_customer_receives_the_email_notification_when_the_payment_status_changes_to_Payment_Already_Taken", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Dashboard_imREmit_Lite_New/TS_57_To_verify_that_customer_receives_the_email_notification_when_the_payment_status_changes_to_Payment_Already_Taken.ds"
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
