const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminNewHelpers,
  customerManagementAdminNewSelectors
} = require('./_shared');

test("TS_52_To_verify_that_User_can_selects_DP_and_SR_at_same_time_in_module_subscription_it_show_self_funding_Toggle", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_New/TS_52_To_verify_that_User_can_selects_DP_and_SR_at_same_time_in_module_subscription_it_show_self_funding_Toggle.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminNewHelpers.openCreateCustomerForm(page, data);
    await customerManagementAdminNewHelpers.selectModules(page, [
      customerManagementAdminNewSelectors.modules.duplicatePayments,
      customerManagementAdminNewSelectors.modules.statementRecon
    ]);
    await customerManagementAdminNewHelpers.expectSelfFundingControls(
      page,
      customerManagementAdminNewSelectors.modules.duplicatePayments,
      customerManagementAdminNewSelectors.labels.selfFundingDisabled
    );
    await customerManagementAdminNewHelpers.expectSelfFundingControls(
      page,
      customerManagementAdminNewSelectors.modules.statementRecon,
      customerManagementAdminNewSelectors.labels.selfFundingDisabled
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
