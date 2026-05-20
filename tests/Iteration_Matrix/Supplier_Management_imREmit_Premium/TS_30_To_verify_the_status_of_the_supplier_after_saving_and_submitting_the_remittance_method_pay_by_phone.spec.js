const { test, loadRuntimeData, loginAsAdmin, closeSession, supplierManagementImremitPremiumHelpers } = require('./_shared');

test("TS_30_To_verify_the_status_of_the_supplier_after_saving_and_submitting_the_remittance_method _pay_by_phone", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_(Premium)/TS_30_To_verify_the_status_of_the_supplier_after_saving_and_submitting_the_remittance_method _pay_by_phone.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await supplierManagementImremitPremiumHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
