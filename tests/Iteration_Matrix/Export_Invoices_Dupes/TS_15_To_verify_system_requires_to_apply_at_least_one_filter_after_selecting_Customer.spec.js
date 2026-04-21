const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_15_To_verify_system_requires_to_apply_at_least_one_filter_after_selecting_Customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_15_To_verify_system_requires_to_apply_at_least_one_filter_after_selecting_Customer.ds"
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
