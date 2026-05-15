const { customerManagementAdminTwoSelectors } = require('./customerManagementAdminTwo.selectors.js');

const runnerConfigurationSelectors = {
  ...customerManagementAdminTwoSelectors,
  headings: {
    customerManagement: customerManagementAdminTwoSelectors.customerManagementHeading,
    createCustomer: customerManagementAdminTwoSelectors.createCustomerHeading,
    emailConfiguration: customerManagementAdminTwoSelectors.wizard.emailConfigurationHeading,
    paymentMethod: customerManagementAdminTwoSelectors.wizard.paymentMethodHeading,
    participantRegister: customerManagementAdminTwoSelectors.wizard.participantRegisterHeading,
    runnerConfiguration: customerManagementAdminTwoSelectors.wizard.runnerConfigurationHeading
  },
  wizard: {
    ...customerManagementAdminTwoSelectors.wizard,
    previousButton: [
      { type: 'role', role: 'button', options: { name: /^Previous$/i }, name: 'wizard-previous-button' },
      { type: 'text', value: 'Previous page', options: { exact: true }, name: 'wizard-previous-page-text' }
    ],
    completeButton: customerManagementAdminTwoSelectors.wizard.completeRunnerConfigButton,
    reconTab: [
      { type: 'role', role: 'button', options: { name: /^Recon$/i }, name: 'runner-type-recon-button' },
      { type: 'text', value: 'Recon', options: { exact: true }, name: 'runner-type-recon-text' }
    ],
    paymentTab: [
      { type: 'role', role: 'button', options: { name: /^Payment$/i }, name: 'runner-type-payment-button' },
      { type: 'text', value: 'Payment', options: { exact: true }, name: 'runner-type-payment-text' }
    ]
  },
  labels: {
    recordTypeRequired: 'Record Type Required',
    responseFileRequired: 'Response File Required',
    paymentFileAlerts: 'Payment File Alerts',
    multiAccountSupplierLogic: 'Enable Multi Account Supplier Logic',
    multiAccountSupplierId: 'Multi-Account Supplier ID',
    customerReconFileTransfer: 'Customer recon file transfer',
    emptyReconRequired: 'Empty Recon Required',
    frequencyDaily: 'Frequency (Daily)',
    frequencyWeekly: 'Frequency (Weekly)',
    frequencyMonthly: 'Frequency (Monthly)',
    dailySelectedTime: 'Daily Selected Time',
    weeklySelectedTime: 'Weekly Selected Time',
    monthlySelectedTime: 'Monthly Selected Time',
    weeklySelectedValue: 'Weekly Selected Value',
    monthlySelectedValue: 'Monthly Selected Value',
    separateDailyReconFileBasedOnPostedDate: 'Separate Daily Recon File Based On Posted Date'
  },
  fields: {
    multiAccountSupplierId: [
      { type: 'label', value: 'Multi-Account Supplier ID', name: 'multi-account-supplier-id-label' },
      { type: 'css', value: 'input[name*="multi"][name*="supplier"]', name: 'multi-account-supplier-id-input' }
    ],
    dailyFileNamePart: [
      { type: 'css', value: 'input[name="fileNamePartDaily"]', name: 'daily-file-name-part' }
    ],
    weeklyFileNamePart: [
      { type: 'css', value: 'input[name="fileNamePartWeekly"]', name: 'weekly-file-name-part' }
    ],
    dailyHour: [
      { type: 'css', value: 'input[placeholder="12hours"]', name: 'time-hour-input' }
    ],
    dailyMinute: [
      { type: 'css', value: 'input[placeholder="minutes"]', name: 'time-minute-input' }
    ]
  }
};

module.exports = {
  runnerConfigurationSelectors
};
