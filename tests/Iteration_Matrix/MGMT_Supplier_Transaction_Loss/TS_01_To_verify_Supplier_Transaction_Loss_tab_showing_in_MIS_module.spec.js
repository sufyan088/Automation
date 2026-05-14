const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtSupplierTransactionLossHelpers } = require('./_shared');

test("TS_01_To_verify_Supplier_Transaction_Loss_tab_showing_in_MIS_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Supplier_Transaction_Loss/TS_01_To_verify_Supplier_Transaction_Loss_tab_showing_in_MIS_module.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await mgmtSupplierTransactionLossHelpers.runScenario(page, __filename);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
