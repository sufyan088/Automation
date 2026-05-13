const { safeClick, safeExpectVisible, waitForAppToSettle } = require('./actions');
const { adminSelectors } = require('../selectors/admin.selectors');
const { customerModuleManagementSelectors } = require('../selectors/customerModuleManagement.selectors');

async function openAdminModule(page) {
  await page.waitForTimeout(2000);
  await safeClick(page, adminSelectors.moduleCard, 'Admin module card');
  await safeExpectVisible(page, adminSelectors.customerManagementNav, 'Customer Management navigation');
  await waitForAppToSettle(page, 1500);
}

async function openCustomerManagement(page) {
  await safeClick(page, adminSelectors.customerManagementNav, 'Customer Management navigation');
  await safeExpectVisible(page, adminSelectors.customerManagementHeading, 'Customer Management heading');
  await waitForAppToSettle(page, 1500);
}

async function openCustomerModuleManagement(page) {
  await safeClick(page, adminSelectors.customerModuleManagementNav, 'Customer Module Management navigation');
  await safeExpectVisible(page, customerModuleManagementSelectors.selfFundingColumnHeader, 'Self Funding column header');
  await waitForAppToSettle(page, 1500);
}

module.exports = {
  openAdminModule,
  openCustomerManagement,
  openCustomerModuleManagement
};