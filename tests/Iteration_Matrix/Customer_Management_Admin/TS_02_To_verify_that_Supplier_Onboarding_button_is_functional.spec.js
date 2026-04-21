const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_02_To_verify_that_Supplier_Onboarding_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_02_To_verify_that_Supplier_Onboarding_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Admin landing page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.verifyAdminLandingPage(page);
  });

  await test.step('Open remapped Customer Module Management page', async () => {
    await customerManagementAdminHelpers.openAdminSection(page, 'customerModuleManagement');
    await customerManagementAdminHelpers.verifyCurrentRoute(page, 'customerModuleManagement');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
