const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminHelpers
} = require('./_shared');

test("TS_25_To_verify_that_the_View_Customer_Details_Button_in_Actions_icon_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_25_To_verify_that_the_View_Customer_Details_Button_in_Actions_icon_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.openFirstRowActionsMenu(page);
    await customerManagementAdminHelpers.verifyVisibleText(page, 'View Customer Profile');
    await customerManagementAdminHelpers.clickVisibleText(page, 'View Customer Profile');
    await page.waitForURL((url) => /\/app\/admin\/customer-management\/[^/]+\/view$/.test(url.pathname), {
      timeout: 15000
    });
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
