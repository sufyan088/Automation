const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminNmHelpers,
  customerManagementAdminNmSelectors
} = require('./_shared');

test("TS_96_To_verify_when_imREmit_Lite_is_selected_from_module_selection_Parent_Customer_dropdown_field_is_visible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_96_To_verify_when_imREmit_Lite_is_selected_from_module_selection_Parent_Customer_dropdown_field_is_visible.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminNmHelpers.openCreateCustomerForm(page, data);
    await customerManagementAdminNmHelpers.selectModules(page, [
      customerManagementAdminNmSelectors.modules.imREmitLite
    ]);
    await customerManagementAdminNmHelpers.expectParentCustomerVisible(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
