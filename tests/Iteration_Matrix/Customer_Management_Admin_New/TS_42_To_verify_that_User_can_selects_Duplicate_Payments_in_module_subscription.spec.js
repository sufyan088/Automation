const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminNewHelpers,
  customerManagementAdminNewSelectors
} = require('./_shared');

test("TS_42_To_verify_that_User_can_selects_Duplicate_Payments_in_module_subscription", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_New/TS_42_To_verify_that_User_can_selects_Duplicate_Payments_in_module_subscription.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminNewHelpers.openCreateCustomerForm(page, data);
    await customerManagementAdminNewHelpers.selectModules(page, [
      customerManagementAdminNewSelectors.modules.duplicatePayments
    ]);
    await customerManagementAdminNewHelpers.expectModuleSelected(
      page,
      customerManagementAdminNewSelectors.modules.duplicatePayments
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
