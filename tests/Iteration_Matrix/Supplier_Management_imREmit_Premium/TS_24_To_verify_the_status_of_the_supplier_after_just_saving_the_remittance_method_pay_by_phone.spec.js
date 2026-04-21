const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_24_To_verify_the_status_of_the_supplier_after_just_saving_the_remittance_method_pay_by_phone", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_(Premium)/TS_24_To_verify_the_status_of_the_supplier_after_just_saving_the_remittance_method_pay_by_phone.ds"
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
