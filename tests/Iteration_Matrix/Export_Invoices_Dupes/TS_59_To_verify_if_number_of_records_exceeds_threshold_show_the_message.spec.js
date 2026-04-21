const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_59_To_verify_if_number_of_records_exceeds_threshold_show_the_message", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_59_To_verify_if_number_of_records_exceeds_threshold_show_the_message.ds"
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
