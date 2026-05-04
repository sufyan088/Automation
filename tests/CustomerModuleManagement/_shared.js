const { loadRuntimeData } = require('../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../helpers/auth');
const { openAdminModule, openCustomerManagement, openCustomerModuleManagement } = require('../../helpers/admin');
const {
  buildUniqueCustomerName,
  createCustomerWithModules,
  toggleSelfFundingColumn,
  searchCustomer,
  openUpdateSubscription,
  addSubscriptionModule,
  removeSubscriptionModule,
  toggleSelfFundingForModule,
  confirmUpdateSubscription,
  expectNoDataInSelfFundingColumn
} = require('../../helpers/customerModuleManagement');
const { safeExpectVisible } = require('../../helpers/actions');
const { adminSelectors } = require('../../selectors/admin.selectors');
const { customerModuleManagementSelectors } = require('../../selectors/customerModuleManagement.selectors');

async function closeSession(page) {
  try {
    await logout(page);
  } catch (error) {
    console.log(`Logout skipped for Customer Module Management cleanup: ${error.message}`);
  }
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  openAdminModule,
  openCustomerManagement,
  openCustomerModuleManagement,
  buildUniqueCustomerName,
  createCustomerWithModules,
  toggleSelfFundingColumn,
  searchCustomer,
  openUpdateSubscription,
  addSubscriptionModule,
  removeSubscriptionModule,
  toggleSelfFundingForModule,
  confirmUpdateSubscription,
  expectNoDataInSelfFundingColumn,
  closeSession,
  safeExpectVisible,
  adminSelectors,
  customerModuleManagementSelectors
};