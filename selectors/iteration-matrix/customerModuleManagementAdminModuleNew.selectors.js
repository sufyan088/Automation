const { customerModuleManagementAdminModuleSelectors } = require('./customerModuleManagementAdminModule.selectors.js');
const { customerManagementAdminNewSelectors } = require('./customerManagementAdminNew.selectors.js');

const customerModuleManagementAdminModuleNewSelectors = {
  modulePage: customerModuleManagementAdminModuleSelectors,
  customerManagement: customerManagementAdminNewSelectors,
  modules: customerManagementAdminNewSelectors.modules,
  columns: {
    customerName: 'Customer Name',
    subscriptions: 'Subscriptions',
    selfFunding: 'Self Funding'
  },
  labels: {
    selfFundingDisabled: customerManagementAdminNewSelectors.labels.selfFundingDisabled,
    selfFundingEnabled: customerManagementAdminNewSelectors.labels.selfFundingEnabled,
    statementReconRendered: 'Statement Reconciliation'
  }
};

module.exports = {
  customerModuleManagementAdminModuleNewSelectors
};
