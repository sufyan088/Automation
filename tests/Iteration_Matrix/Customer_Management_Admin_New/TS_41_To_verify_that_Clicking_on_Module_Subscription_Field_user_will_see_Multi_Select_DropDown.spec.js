const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminNewHelpers,
  customerManagementAdminNewSelectors
} = require('./_shared');

test("TS_41_To_verify_that_Clicking_on_Module_Subscription_Field_user_will_see_Multi_Select_DropDown", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_New/TS_41_To_verify_that_Clicking_on_Module_Subscription_Field_user_will_see_Multi_Select_DropDown.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminNewHelpers.openCreateCustomerForm(page, data);
    await customerManagementAdminNewHelpers.expectModuleOptions(page, [
      customerManagementAdminNewSelectors.modules.duplicatePayments,
      customerManagementAdminNewSelectors.modules.imREmit,
      customerManagementAdminNewSelectors.modules.statementRecon
    ]);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
