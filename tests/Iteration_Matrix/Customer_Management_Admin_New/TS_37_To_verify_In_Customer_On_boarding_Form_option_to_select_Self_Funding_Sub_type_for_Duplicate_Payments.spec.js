const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminNewHelpers,
  customerManagementAdminNewSelectors
} = require('./_shared');

test("TS_37_To_verify_In_Customer_On_boarding_Form_option_to_select_Self_Funding_Sub_type_for_Duplicate_Payments", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_New/TS_37_To_verify_In_Customer_On_boarding_Form_option_to_select_Self_Funding_Sub_type_for_Duplicate_Payments.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminNewHelpers.openCreateCustomerForm(page, data);
    await customerManagementAdminNewHelpers.selectModules(page, [
      customerManagementAdminNewSelectors.modules.duplicatePayments
    ]);
    await customerManagementAdminNewHelpers.expectSelfFundingControls(
      page,
      customerManagementAdminNewSelectors.modules.duplicatePayments,
      customerManagementAdminNewSelectors.labels.selfFundingDisabled
    );
    await customerManagementAdminNewHelpers.toggleSelfFunding(
      page,
      customerManagementAdminNewSelectors.modules.duplicatePayments
    );
    await customerManagementAdminNewHelpers.expectCreateCustomerButtonVisible(page);
    await customerManagementAdminNewHelpers.submitCustomer(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
