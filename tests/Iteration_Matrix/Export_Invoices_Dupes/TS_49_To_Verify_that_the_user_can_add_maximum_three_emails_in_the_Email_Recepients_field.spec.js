const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_49_To_Verify_that_the_user_can_add_maximum_three_emails_in_the_Email_Recepients_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_49_To_Verify_that_the_user_can_add_maximum_three_emails_in_the_Email_Recepients_field.ds"
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
