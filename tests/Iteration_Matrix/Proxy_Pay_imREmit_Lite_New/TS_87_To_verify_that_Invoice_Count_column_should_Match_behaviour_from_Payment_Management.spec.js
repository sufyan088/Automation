const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_87_To_verify_that_Invoice_Count_column_should_Match_behaviour_from_Payment_Management", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_imREmit_Lite_New/TS_87_To_verify_that_Invoice_Count_column_should_Match_behaviour_from_Payment_Management.ds"
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
