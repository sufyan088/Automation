const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminHelpers
} = require('./_shared');

test("TS_30_To_verify_that_Back_to_list_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_30_To_verify_that_Back_to_list_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'userManagement');
    await customerManagementAdminHelpers.openFirstRowActionsMenu(page);
    await customerManagementAdminHelpers.verifyVisibleText(page, 'View User Profile');
    await customerManagementAdminHelpers.clickVisibleText(page, 'View User Profile');
    await page.waitForURL((url) => /\/app\/admin\/user-management\/[^/]+\/view$/.test(url.pathname), {
      timeout: 15000
    });
    await page.getByRole('link', { name: /back to list/i }).first().click({ timeout: 5000 });
    await page.waitForURL((url) => /\/app\/admin\/user-management$/.test(url.pathname), {
      timeout: 15000
    });
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
