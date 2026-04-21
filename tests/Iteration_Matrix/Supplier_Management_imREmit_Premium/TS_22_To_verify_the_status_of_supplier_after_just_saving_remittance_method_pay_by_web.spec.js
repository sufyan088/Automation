const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_22_To_verify_the_status_of_supplier_ after_just_saving_remittance_method_pay_by_web", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_(Premium)/TS_22_To_verify_the_status_of_supplier_ after_just_saving_remittance_method_pay_by_web.ds"
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
