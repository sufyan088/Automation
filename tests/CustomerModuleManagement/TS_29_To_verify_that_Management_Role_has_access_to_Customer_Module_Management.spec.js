const { test } = require('@playwright/test');
const { loadRuntimeData, loginAsAdmin, openAdminModule, closeSession, safeExpectVisible, adminSelectors } = require('./_shared');

test('TS_29_To_verify_that_Management_Role_has_access_to_Customer_Module_Management', async ({ page }) => {
  const data = loadRuntimeData();

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Admin module', async () => {
    await openAdminModule(page);
  });

  await test.step('Verify Customer Module Management is visible', async () => {
    await safeExpectVisible(page, adminSelectors.customerModuleManagementNav, 'Customer Module Management navigation');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});