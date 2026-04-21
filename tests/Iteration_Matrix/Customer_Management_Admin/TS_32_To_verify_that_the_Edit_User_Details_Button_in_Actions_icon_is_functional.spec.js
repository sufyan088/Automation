const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminHelpers
} = require('./_shared');

test("TS_32_To_verify_that_the_Edit_User_Details_Button_in_Actions_icon_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_32_To_verify_that_the_Edit_User_Details_Button_in_Actions_icon_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'userManagement');
    await customerManagementAdminHelpers.openFirstRowActionsMenu(page);
    await customerManagementAdminHelpers.verifyVisibleText(page, 'Edit User Details');
    await customerManagementAdminHelpers.clickVisibleText(page, 'Edit User Details');
    await page.waitForURL((url) => /\/app\/admin\/user-management\/[^/]+\/edit$/.test(url.pathname), {
      timeout: 15000
    });
    await customerManagementAdminHelpers.verifyVisibleText(page, 'Edit User');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
