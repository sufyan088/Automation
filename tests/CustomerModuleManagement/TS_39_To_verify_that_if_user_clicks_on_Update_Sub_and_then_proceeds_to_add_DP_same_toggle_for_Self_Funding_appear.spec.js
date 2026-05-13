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
  addSubscriptionModule,
  toggleSelfFundingForModule,
  confirmUpdateSubscription,
  closeSession
} = require('./_shared');

test('TS_39_To_verify_that_if_user_clicks_on_Update_Sub_and_then_proceeds_to_add_DP_same_toggle_for_Self_Funding_appear', async ({ page }) => {
  const data = loadRuntimeData();
  const customerName = buildUniqueCustomerName(data.customerModuleBaseName);

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Admin module and Customer Management', async () => {
    await openAdminModule(page);
    await openCustomerManagement(page);
  });

  await test.step('Create a customer with imREmit module only', async () => {
    await createCustomerWithModules(page, {
      customerName,
      programManager: data.customerModuleProgramManager,
      modules: ['ImREmit']
    });
  });

  await test.step('Open Customer Module Management and search customer', async () => {
    await openCustomerModuleManagement(page);
    await searchCustomer(page, customerName);
  });

  await test.step('Open Update Subscription and add Duplicate Payments self funding', async () => {
    await openUpdateSubscription(page);
    await addSubscriptionModule(page, 'Duplicate Payments');
    await toggleSelfFundingForModule(page, 'Duplicate Payments');
    await confirmUpdateSubscription(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});