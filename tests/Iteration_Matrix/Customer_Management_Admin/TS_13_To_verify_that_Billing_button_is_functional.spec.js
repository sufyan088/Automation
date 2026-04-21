const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_13_To_verify_that_Billing_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Customer Management page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
  });

  await test.step('Open Status filter and verify current options', async () => {
    await customerManagementAdminHelpers.openFilterButton(page, 'status');
    await customerManagementAdminHelpers.verifyVisibleText(page, 'Active');
    await customerManagementAdminHelpers.verifyVisibleText(page, 'Pending');
    await customerManagementAdminHelpers.clickVisibleText(page, 'Active');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
