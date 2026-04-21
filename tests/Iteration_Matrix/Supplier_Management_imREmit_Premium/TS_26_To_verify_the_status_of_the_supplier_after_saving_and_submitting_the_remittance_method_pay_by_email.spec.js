const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_26_To_verify_the_status_of_the_supplier_after_saving_and_submitting_the_remittance_method_pay_by_email", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_(Premium)/TS_26_To_verify_the_status_of_the_supplier_after_saving_and_submitting_the_remittance_method_pay_by_email.ds"
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
