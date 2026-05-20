const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtSupplierTransactionLossHelpers } = require('./_shared');

test("TS_10_Verify_that_Search_All_Entries_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Supplier_Transaction_Loss/TS_10_Verify_that_Search_All_Entries_button_is_functional.ds"
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
