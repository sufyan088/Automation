const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_55_To_verify_that_Add_Invoice_Numbers_search_field_should_be_functional_under_Advanced_Search", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_imREmit_New/TS_55_To_verify_that_Add_Invoice_Numbers_search_field_should_be_functional_under_Advanced_Search.ds"
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
