const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TC_15_To_verify_advanced_search_with_remittance_method", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Premium/TC_15_To_verify_advanced_search_with_remittance_method.ds"
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
