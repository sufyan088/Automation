const { test, loadRuntimeData, loginAsAdmin, closeSession, customerModuleManagementAdminModuleNewHelpers } = require('./_shared');

test("TS_29_To_verify_that_Management_Role_has_access_to_Customer_Module_Management", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Module_Management_Admin_Module_New/TS_29_To_verify_that_Management_Role_has_access_to_Customer_Module_Management.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerModuleManagementAdminModuleNewHelpers.runScenario(page, data, 'TS_29_To_verify_that_Management_Role_has_access_to_Customer_Module_Management');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
