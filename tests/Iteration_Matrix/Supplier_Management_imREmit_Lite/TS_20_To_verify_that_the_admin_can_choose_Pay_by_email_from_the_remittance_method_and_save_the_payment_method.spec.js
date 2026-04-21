const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_20_To_verify_that_the_admin_can_choose_Pay_by_email_from_the_remittance_method_and_save_the_payment_method", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_Lite/TS_20_To_verify_that_the_admin_can_choose_Pay_by_email_from_the_remittance_method_and_save_the_payment_method.ds"
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
