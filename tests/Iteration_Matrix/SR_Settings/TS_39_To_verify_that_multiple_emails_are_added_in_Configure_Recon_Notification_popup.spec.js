const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_39_To_verify_that_multiple_emails_are_added_in_Configure_Recon_Notification_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_39_To_verify_that_multiple_emails_are_added_in_Configure_Recon_Notification_popup.ds"
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
