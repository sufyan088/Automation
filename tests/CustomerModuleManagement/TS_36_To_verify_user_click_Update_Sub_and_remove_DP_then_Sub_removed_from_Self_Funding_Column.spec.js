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
  toggleSelfFundingForModule,
  removeSubscriptionModule,
  confirmUpdateSubscription,
  expectNoDataInSelfFundingColumn,
  closeSession
} = require('./_shared');

test('TS_36_To_verify_user_click_Update_Sub_and_remove_DP_then_Sub_removed_from_Self_Funding_Column', async ({ page }) => {
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

  await test.step('Open Update Subscription and disable Duplicate Payments self funding', async () => {
    await openUpdateSubscription(page);
    await toggleSelfFundingForModule(page, 'Duplicate Payments');
    await removeSubscriptionModule(page, 'Duplicate Payments');
    await confirmUpdateSubscription(page);
  });

  await test.step('Verify Self Funding column shows no data', async () => {
    await expectNoDataInSelfFundingColumn(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});