const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_14_To_verify_that_Payment_Type_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Customer Management page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
  });

  await test.step('Open Column Order and verify current options', async () => {
    await customerManagementAdminHelpers.openColumnOrder(page);
    await customerManagementAdminHelpers.verifyColumnOrderOptionVisible(page, 'Customer Name');
    await customerManagementAdminHelpers.verifyColumnOrderOptionVisible(page, 'Onboarding Status');
    await customerManagementAdminHelpers.verifyColumnOrderOptionVisible(page, 'External ID');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
