const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_16_To_verify_that_Settlement_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Customer Management page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
  });

  await test.step('Open Column Order and use Show All', async () => {
    await customerManagementAdminHelpers.openColumnOrder(page);
    await customerManagementAdminHelpers.clickColumnOrderAction(page, 'Show All');
    await customerManagementAdminHelpers.verifyColumnOrderOptionVisible(page, 'Customer Name');
    await customerManagementAdminHelpers.verifyColumnOrderOptionVisible(page, 'External ID');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
