const { test, loadRuntimeData, loginAsAdmin, closeSession, proxyPayImremitNewHelpers } = require('./_shared');

test("TS_59_To_verify_that_Add_Invoice_Numbers_search_field_should_Match_behaviour_from_Payment_Management", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_imREmit_New/TS_59_To_verify_that_Add_Invoice_Numbers_search_field_should_Match_behaviour_from_Payment_Management.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await proxyPayImremitNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
