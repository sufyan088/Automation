const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_43_To_verify_Payment_Date_filter_is_functional_on_the_Export_Dupes", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_43_To_verify_Payment_Date_filter_is_functional_on_the_Export_Dupes.ds"
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
