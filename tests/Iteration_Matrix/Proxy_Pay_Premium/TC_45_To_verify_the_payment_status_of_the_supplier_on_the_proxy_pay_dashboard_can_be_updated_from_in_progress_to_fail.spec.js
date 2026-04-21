const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TC_45_To_verify_the_payment_status_of_the_supplier_on_the_proxy_pay_dashboard_can_be_updated_from_in_progress_to_fail", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Premium/TC_45_To_verify_the_payment_status_of_the_supplier_on_the_proxy_pay_dashboard_can_be_updated_from_in_progress_to_fail.ds"
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
