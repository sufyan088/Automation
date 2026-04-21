const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_50_To_verify_that_Recipient_Email_Address_field_allows_up_to_3_email_addresses", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search/TS_50_To_verify_that_Recipient_Email_Address_field_allows_up_to_3_email_addresses.ds"
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
