const { test, loadRuntimeData, loginAsAdmin, closeSession, supplierManagementImremitNewHelpers } = require('./_shared');

test("TS_66_To_verify_that_User_Credentials_can_be_added_during_supplier_enrollment", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_New/TS_66_To_verify_that_User_Credentials_can_be_added_during_supplier_enrollment.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await supplierManagementImremitNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
