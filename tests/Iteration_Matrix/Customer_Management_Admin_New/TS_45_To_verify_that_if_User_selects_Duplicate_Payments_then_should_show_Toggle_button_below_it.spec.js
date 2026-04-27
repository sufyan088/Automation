const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminNewHelpers,
  customerManagementAdminNewSelectors
} = require('./_shared');

test("TS_45_To_verify_that_if_User_selects_Duplicate_Payments_then_should_show_Toggle_button_below_it", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_New/TS_45_To_verify_that_if_User_selects_Duplicate_Payments_then_should_show_Toggle_button_below_it.ds"
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
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
