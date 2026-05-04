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
  openUpdateSubscription,
  removeSubscriptionModule,
  confirmUpdateSubscription,
  closeSession
} = require('./_shared');

test('TS_33_verify_user_clicks_Update_Sub_then_proceeds_to_remove_DP_should_removed_from_Sub_Col', async ({ page }) => {
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

  await test.step('Open Customer Module Management and search customer', async () => {
    await openCustomerModuleManagement(page);
    await searchCustomer(page, customerName);
  });

  await test.step('Open Update Subscription and remove Duplicate Payments', async () => {
    await openUpdateSubscription(page);
    await removeSubscriptionModule(page, 'Duplicate Payments');
    await confirmUpdateSubscription(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});