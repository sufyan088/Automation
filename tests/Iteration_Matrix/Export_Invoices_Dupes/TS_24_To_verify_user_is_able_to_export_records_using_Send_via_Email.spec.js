const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_24_To_verify_user_is_able_to_export_records_using_Send_via_Email", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_24_To_verify_user_is_able_to_export_records_using_Send_via_Email.ds"
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
