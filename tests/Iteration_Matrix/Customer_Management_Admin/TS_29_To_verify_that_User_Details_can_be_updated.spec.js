const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminHelpers
} = require('./_shared');

test("TS_29_To_verify_that_User_Details_can_be_updated", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_29_To_verify_that_User_Details_can_be_updated.ds"
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
    await customerManagementAdminHelpers.verifyVisibleText(page, 'User Details');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
