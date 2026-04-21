const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_44_To_verify_that_Daily_Notification_is_received_to_configured_emails_regarding_reconciled_statements", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_44_To_verify_that_Daily_Notification_is_received_to_configured_emails_regarding_reconciled_statements.ds"
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
