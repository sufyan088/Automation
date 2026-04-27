const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminNewHelpers,
  customerManagementAdminNewSelectors
} = require('./_shared');

test("TS_48_To_verify_that_if_User_selects_Statement_Recon_then_show_Funding_Options_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_New/TS_48_To_verify_that_if_User_selects_Statement_Recon_then_show_Funding_Options_field.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminNewHelpers.openCreateCustomerForm(page, data);
    await customerManagementAdminNewHelpers.selectModules(page, [
      customerManagementAdminNewSelectors.modules.statementRecon
    ]);
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
