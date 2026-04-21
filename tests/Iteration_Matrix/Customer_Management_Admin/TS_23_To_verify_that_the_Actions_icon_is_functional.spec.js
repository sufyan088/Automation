const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminHelpers
} = require('./_shared');

test("TS_23_To_verify_that_the_Actions_icon_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_23_To_verify_that_the_Actions_icon_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.openFirstRowActionsMenu(page);
    await customerManagementAdminHelpers.verifyVisibleText(page, 'Edit Customer Details');
    await customerManagementAdminHelpers.verifyVisibleText(page, 'View Customer Profile');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
