const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TC_24_To_verify_the_sorting_arrows_in_the_proxy_pay_entries_asc", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Dashboard_imREmit_Lite/TC_24_To_verify_the_sorting_arrows_in_the_proxy_pay_entries_asc.ds"
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
