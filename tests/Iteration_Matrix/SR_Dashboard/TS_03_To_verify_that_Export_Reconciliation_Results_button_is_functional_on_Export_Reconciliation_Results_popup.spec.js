const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_03_To_verify_that_Export_Reconciliation_Results_button_is_functional_on_Export_Reconciliation_Results_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Dashboard/TS_03_To_verify_that_Export_Reconciliation_Results_button_is_functional_on_Export_Reconciliation_Results_popup.ds"
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
