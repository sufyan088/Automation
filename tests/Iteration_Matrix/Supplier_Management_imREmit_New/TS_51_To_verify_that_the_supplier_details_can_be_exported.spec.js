const { test, loadRuntimeData, loginAsAdmin, closeSession, supplierManagementImremitNewHelpers } = require('./_shared');

test("TS_51_To_verify_that_the_supplier_details_can_be_exported", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_New/TS_51_To_verify_that_the_supplier_details_can_be_exported.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await supplierManagementImremitNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
