const { test } = require('@playwright/test');
const { loadRuntimeData, loginAsAdmin, openAdminModule, openCustomerModuleManagement, closeSession, safeExpectVisible, customerModuleManagementSelectors } = require('./_shared');

test('TS_30_To_verify_a_new_column_called_Self_Funding_in_Customer_Module_Table', async ({ page }) => {
  const data = loadRuntimeData();

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Admin module', async () => {
    await openAdminModule(page);
  });

  await test.step('Open Customer Module Management', async () => {
    await openCustomerModuleManagement(page);
  });

  await test.step('Verify Self Funding column is visible', async () => {
    await safeExpectVisible(page, customerModuleManagementSelectors.selfFundingColumnHeader, 'Self Funding column header');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});