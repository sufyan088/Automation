const { customerManagementAdminNmSelectors } = require('./customerManagementAdminNm.selectors.js');

const customerOnboardingImremitLiteSelectors = {
  ...customerManagementAdminNmSelectors,
  actionMenuItems: {
    ...customerManagementAdminNmSelectors.actionMenuItems,
    deleteCustomer: [
      { type: 'text', value: 'Delete Customer', options: { exact: true }, name: 'delete-customer' }
    ]
  },
  viewProfile: {
    ...customerManagementAdminNmSelectors.viewProfile,
    backToCustomerManagementButton: [
      { type: 'role', role: 'link', options: { name: /back to customer management/i }, name: 'back-to-customer-management-link' },
      { type: 'role', role: 'button', options: { name: /back to customer management/i }, name: 'back-to-customer-management-button' },
      { type: 'role', role: 'link', options: { name: /back to list/i }, name: 'back-to-list-link' },
      { type: 'role', role: 'button', options: { name: /back to list/i }, name: 'back-to-list-button' },
      { type: 'text', value: 'Back to Customer Management', options: { exact: true }, name: 'back-to-customer-management-text' },
      { type: 'text', value: 'Back to list', options: { exact: true }, name: 'back-to-list-text' }
    ]
  },
  dialogs: {
    deleteCustomerConfirmButton: [
      { type: 'role', role: 'button', options: { name: /^Delete /i }, name: 'delete-customer-confirm-button' },
      { type: 'role', role: 'button', options: { name: /delete/i }, name: 'delete-generic-button' }
    ]
  },
  toasts: {
    customerDeleted: [
      { type: 'text', value: 'Customer deleted successfully', options: { exact: true }, name: 'customer-deleted-success' },
      { type: 'text', value: /deleted successfully/i, name: 'customer-deleted-regex' },
      { type: 'text', value: 'Success!', options: { exact: true }, name: 'customer-deleted-generic-success' }
    ]
  },
  defaults: {
    moduleName: 'ImREmit Lite'
  }
};

module.exports = {
  customerOnboardingImremitLiteSelectors
};
