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

test('TS_37_To_verify_user_click_Update_Sub_and_remove_SR_then_Sub_removed_from_Self_Funding_Column', async ({ page }) => {
  const data = loadRuntimeData();
  const customerName = buildUniqueCustomerName(data.customerModuleBaseName);

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Admin module and Customer Management', async () => {
    await openAdminModule(page);
    await openCustomerManagement(page);
  });

  await test.step('Create a customer with Statement Recon self funding enabled', async () => {
    await createCustomerWithModules(page, {
      customerName,
      programManager: data.customerModuleProgramManager,
      modules: ['Statement Recon'],
      selfFundingModules: ['Statement Recon']
    });
  });

  await test.step('Open Customer Module Management and search customer', async () => {
    await openCustomerModuleManagement(page);
    await searchCustomer(page, customerName);
  });

  await test.step('Open Update Subscription and disable Statement Recon self funding', async () => {
    await openUpdateSubscription(page);
    await toggleSelfFundingForModule(page, 'Statement Recon');
    await removeSubscriptionModule(page, 'Statement Recon');
    await confirmUpdateSubscription(page);
  });

  await test.step('Verify Self Funding column shows no data', async () => {
    await expectNoDataInSelfFundingColumn(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});