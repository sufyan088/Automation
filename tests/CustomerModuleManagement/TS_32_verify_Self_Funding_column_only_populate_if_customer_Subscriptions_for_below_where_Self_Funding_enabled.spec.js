const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  openAdminModule,
  openCustomerManagement,
  openCustomerModuleManagement,
  buildUniqueCustomerName,
  createCustomerWithModules,
  searchCustomer,
  closeSession,
  safeExpectVisible,
  customerModuleManagementSelectors
} = require('./_shared');

test('TS_32_verify_Self_Funding_column_only_populate_if_customer_Subscriptions_for_below_where_Self_Funding_enabled', async ({ page }) => {
  const data = loadRuntimeData();
  const customerName = buildUniqueCustomerName(data.customerModuleBaseName);

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Admin module and Customer Management', async () => {
    await openAdminModule(page);
    await openCustomerManagement(page);
  });

  await test.step('Create a customer with Duplicate Payments self funding enabled', async () => {
    await createCustomerWithModules(page, {
      customerName,
      programManager: data.customerModuleProgramManager,
      modules: ['Duplicate Payments'],
      selfFundingModules: ['Duplicate Payments']
    });
  });

  await test.step('Open Customer Module Management', async () => {
    await openCustomerModuleManagement(page);
  });

  await test.step('Search for the created customer', async () => {
    await searchCustomer(page, customerName);
  });

  await test.step('Verify Self Funding column is visible', async () => {
    await safeExpectVisible(page, customerModuleManagementSelectors.selfFundingColumnHeader, 'Self Funding column header');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});