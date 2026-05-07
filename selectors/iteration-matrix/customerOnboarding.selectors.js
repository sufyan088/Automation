const { customerManagementPaymentMethodSelectors } = require('./customerManagementPaymentMethod.selectors.js');
const { customerManagementAdminTwoSelectors } = require('./customerManagementAdminTwo.selectors.js');

const customerOnboardingSelectors = {
  ...customerManagementPaymentMethodSelectors,
  headings: {
    ...customerManagementPaymentMethodSelectors.headings,
    participantRegister: customerManagementAdminTwoSelectors.wizard.participantRegisterHeading,
    runnerConfiguration: customerManagementAdminTwoSelectors.wizard.runnerConfigurationHeading
  },
  wizard: {
    ...customerManagementPaymentMethodSelectors.wizard,
    participantRegisterHeading: customerManagementAdminTwoSelectors.wizard.participantRegisterHeading,
    runnerConfigurationHeading: customerManagementAdminTwoSelectors.wizard.runnerConfigurationHeading,
    runnerTypeDropdown: customerManagementAdminTwoSelectors.wizard.runnerTypeDropdown,
    openReconRunnerConfigButton: customerManagementAdminTwoSelectors.wizard.openReconRunnerConfigButton,
    openPaymentRunnerConfigButton: customerManagementAdminTwoSelectors.wizard.openPaymentRunnerConfigButton,
    addReconRunnerConfigButton: customerManagementAdminTwoSelectors.wizard.addReconRunnerConfigButton,
    addPaymentRunnerConfigButton: customerManagementAdminTwoSelectors.wizard.addPaymentRunnerConfigButton,
    completeRunnerConfigButton: customerManagementAdminTwoSelectors.wizard.completeRunnerConfigButton,
    previousButton: [
      { type: 'role', role: 'button', options: { name: /^Previous\b/i }, name: 'wizard-previous-button' },
      {
        type: 'custom',
        name: 'wizard-previous-footer-button',
        factory: (page) => page.locator('button').filter({ hasText: /^Previous$/ }).last()
      },
      { type: 'text', value: 'Previous page', options: { exact: true }, name: 'wizard-previous-page-text' }
    ],
    backToListButton: [
      ...customerManagementPaymentMethodSelectors.wizard.backToListButton,
      { type: 'role', role: 'link', options: { name: /back to list/i }, name: 'back-to-list-link' }
    ],
    returnToTopButton: [
      { type: 'role', role: 'button', options: { name: /return to top/i }, name: 'return-to-top-button' },
      { type: 'text', value: 'Return to top', options: { exact: true }, name: 'return-to-top-text' }
    ],
    searchAllEntriesField: [
      { type: 'placeholder', value: 'Search all entries...', name: 'search-all-entries-field' },
      { type: 'placeholder', value: 'Search all customers...', name: 'search-all-customers-field' }
    ]
  },
  actionsMenuItems: {
    ...customerManagementPaymentMethodSelectors.actionsMenuItems,
    updatePaymentMethod: [
      { type: 'text', value: 'Update Payment Method', options: { exact: true }, name: 'update-payment-method' },
      { type: 'text', value: 'Edit Payment Method', options: { exact: true }, name: 'edit-payment-method' },
      { type: 'text', value: 'Edit', options: { exact: true }, name: 'edit-generic' }
    ],
    deletePaymentMethod: [
      { type: 'text', value: 'Delete Payment Method', options: { exact: true }, name: 'delete-payment-method' },
      { type: 'text', value: 'Delete', options: { exact: true }, name: 'delete-generic' }
    ],
    updateParticipant: [
      { type: 'text', value: 'Update Participant', options: { exact: true }, name: 'update-participant' },
      { type: 'text', value: 'Edit Participant', options: { exact: true }, name: 'edit-participant' },
      { type: 'text', value: 'Edit', options: { exact: true }, name: 'edit-participant-generic' }
    ],
    deleteParticipant: [
      { type: 'text', value: 'Delete Participant', options: { exact: true }, name: 'delete-participant' },
      { type: 'text', value: 'Delete', options: { exact: true }, name: 'delete-participant-generic' }
    ]
  },
  dialogs: {
    ...customerManagementPaymentMethodSelectors.dialogs,
    confirmDeleteButton: [
      { type: 'role', role: 'button', options: { name: /^Delete\b/i }, name: 'confirm-delete-button' },
      { type: 'text', value: 'Delete', options: { exact: true }, name: 'confirm-delete-text' }
    ],
    saveButton: [
      { type: 'role', role: 'button', options: { name: /^Save\b/i }, name: 'dialog-save-button' },
      { type: 'text', value: 'Save', options: { exact: true }, name: 'dialog-save-text' }
    ]
  },
  toasts: {
    ...customerManagementPaymentMethodSelectors.toasts,
    paymentMethodUpdated: [
      { type: 'text', value: 'Payment method successfully updated', options: { exact: true }, name: 'payment-method-updated' },
      { type: 'text', value: 'Success!', options: { exact: true }, name: 'payment-method-updated-generic' }
    ],
    paymentMethodDeleted: [
      { type: 'text', value: 'Payment method deleted successfully', options: { exact: true }, name: 'payment-method-deleted' },
      { type: 'text', value: 'Success!', options: { exact: true }, name: 'payment-method-deleted-generic' }
    ],
    participantSaved: [
      { type: 'text', value: 'Participant saved successfully', options: { exact: true }, name: 'participant-saved' },
      { type: 'text', value: 'Success!', options: { exact: true }, name: 'participant-saved-generic' }
    ],
    participantDeleted: [
      { type: 'text', value: 'Participant deleted successfully', options: { exact: true }, name: 'participant-deleted' },
      { type: 'text', value: 'Success!', options: { exact: true }, name: 'participant-deleted-generic' }
    ]
  }
};

module.exports = {
  customerOnboardingSelectors
};
