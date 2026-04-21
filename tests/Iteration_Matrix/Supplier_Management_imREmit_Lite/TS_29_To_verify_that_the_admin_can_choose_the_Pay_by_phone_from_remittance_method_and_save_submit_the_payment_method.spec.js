const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_29_To_verify_that_the_admin_can_choose_the_Pay_by_phone_from_remittance_method_and_save_submit_the_payment_method", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_Lite/TS_29_To_verify_that_the_admin_can_choose_the_Pay_by_phone_from_remittance_method_and_save_submit_the_payment_method.ds"
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
