const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminHelpers
} = require('./_shared');

test("TS_31_To_verify_that_ID_in_Column_Views_is_visible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_31_To_verify_that_ID_in_Column_Views_is_visible.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'userManagement');
    await customerManagementAdminHelpers.openColumnOrder(page);
    await customerManagementAdminHelpers.verifyColumnOrderOptionVisible(page, 'Username');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
