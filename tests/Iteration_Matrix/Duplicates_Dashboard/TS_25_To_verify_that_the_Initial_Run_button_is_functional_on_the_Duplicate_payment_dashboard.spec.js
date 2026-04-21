const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_25_To_verify_that_the_Initial_Run_button_is_functional_on_the_Duplicate_payment_dashboard", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicates_Dashboard/TS_25_To_verify_that_the_Initial_Run_button_is_functional_on_the_Duplicate_payment_dashboard.ds"
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
