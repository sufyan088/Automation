const { test, loadRuntimeData, loginAsAdmin, closeSession, supplierManagementImremitNewHelpers } = require('./_shared');

test("TS_77_To_verify_Advanced_Search_with_Updated_Date", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_New/TS_77_To_verify_Advanced_Search_with_Updated_Date.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await supplierManagementImremitNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
