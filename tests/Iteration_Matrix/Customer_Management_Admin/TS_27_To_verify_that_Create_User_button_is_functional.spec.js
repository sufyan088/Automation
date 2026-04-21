const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminHelpers
} = require('./_shared');

test("TS_27_To_verify_that_Create_User_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_27_To_verify_that_Create_User_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'userManagement');
    await page.getByRole('link', { name: /create user/i }).first().click({ timeout: 5000 });
    await page.waitForURL((url) => /\/app\/admin\/user-management\/create$/.test(url.pathname), {
      timeout: 15000
    });
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
