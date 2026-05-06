const { test, loadRuntimeData, loginAsAdmin, closeSession, customerModuleManagementAdminModuleNewHelpers } = require('./_shared');

test("TS_31_To_verify_new_column_called_Self_Funding_in_Customer_Module_Table", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Module_Management_Admin_Module_New/TS_31_To_verify_new_column_called_Self_Funding_in_Customer_Module_Table.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerModuleManagementAdminModuleNewHelpers.runScenario(page, data, 'TS_31_To_verify_new_column_called_Self_Funding_in_Customer_Module_Table');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
