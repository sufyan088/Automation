const { test, loadRuntimeData, loginAsAdmin, closeSession, proxyPayImremitNewHelpers } = require('./_shared');

test("TS_54_To_verify_that_Invoice_Count_column_should_Match_behaviour_from_Payment_Management", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_imREmit_New/TS_54_To_verify_that_Invoice_Count_column_should_Match_behaviour_from_Payment_Management.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await proxyPayImremitNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
