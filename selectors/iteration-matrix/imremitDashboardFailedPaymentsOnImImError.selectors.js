const imremitDashboardFailedPaymentsOnImImErrorSelectors = {
  moduleTabs: {
    imremit: [
      { type: 'role', role: 'link', options: { name: /imremit/i }, name: 'imremit-link' },
      { type: 'role', role: 'button', options: { name: /imremit/i }, name: 'imremit-button' },
      { type: 'text', value: /imremit/i, name: 'imremit-text' }
    ],
    dashboard: [
      { type: 'role', role: 'link', options: { name: 'Dashboard', exact: true }, name: 'dashboard-link' },
      { type: 'role', role: 'button', options: { name: 'Dashboard', exact: true }, name: 'dashboard-button' },
      { type: 'css', value: 'a[href*="/dashboard"]', name: 'dashboard-href' }
    ]
  },
  headings: {
    overview: [
      { type: 'role', role: 'heading', options: { name: /your imremit overview/i }, name: 'overview-heading' }
    ],
    paymentManagement: [
      { type: 'role', role: 'heading', options: { name: /payment management/i }, name: 'payment-management-heading' }
    ],
    customerInformation: [
      { type: 'role', role: 'heading', options: { name: /customer information/i }, name: 'customer-information-heading' }
    ]
  },
  customerPicker: {
    trigger: [
      {
        type: 'custom',
        factory: (page) => page.locator('button[role="combobox"], [role="combobox"]').filter({ hasText: /select customer|select customers/i }).first(),
        name: 'customer-picker-trigger'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('button[role="combobox"], [role="combobox"]').first(),
        name: 'any-combobox-trigger'
      }
    ],
    searchInput: [
      { type: 'placeholder', value: /search customers?|select customers?/i, name: 'customer-search-placeholder' },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="dialog"], [data-radix-popper-content-wrapper]').locator('input').first(),
        name: 'customer-search-input'
      }
    ],
    options: [
      {
        type: 'custom',
        factory: (page) => page.getByRole('option').filter({ hasNotText: /^select all$/i }).first(),
        name: 'customer-option-non-select-all'
      },
      { type: 'role', role: 'option', options: {}, name: 'customer-option' },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="listbox"] [role="option"], [cmdk-list] [cmdk-item]').filter({ hasNotText: /^select all$/i }).first(),
        name: 'customer-option-fallback'
      }
    ]
  },
  dashboard: {
    failedPaymentsHeading: [
      { type: 'role', role: 'heading', options: { name: /failed payments on im/i }, name: 'failed-payments-heading' },
      { type: 'text', value: /failed payments on im/i, name: 'failed-payments-text' }
    ],
    review: [
      {
        type: 'custom',
        factory: (page) => page.getByRole('heading', { name: /failed payments on im/i }).locator('..').getByText(/^Review$/i).first(),
        name: 'failed-payments-review-near-heading'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('h3, [role="heading"]').filter({ hasText: /failed payments on im/i }).locator('..').getByRole('button', { name: /review/i }).first(),
        name: 'failed-payments-review-button'
      },
      { type: 'text', value: /^Review$/i, name: 'review-text' }
    ],
    viewCustomerDetails: [
      { type: 'text', value: /view full customer details|view customer details/i, name: 'view-customer-details-text' },
      { type: 'role', role: 'button', options: { name: /view full customer details|view customer details/i }, name: 'view-customer-details-button' }
    ],
    customerDetailsClose: [
      { type: 'label', value: /close/i, name: 'customer-details-close-label' },
      { type: 'role', role: 'button', options: { name: /close/i }, name: 'customer-details-close-button' },
      { type: 'text', value: /^Close$/i, name: 'customer-details-close-text' }
    ]
  },
  list: {
    failedPaymentsSummary: [
      { type: 'text', value: /failed payments on im/i, name: 'failed-payments-summary' }
    ],
    export: [
      { type: 'text', value: /export payment data|export data/i, name: 'export-text' },
      { type: 'role', role: 'button', options: { name: /export payment data|export data/i }, name: 'export-button' }
    ],
    columnView: [
      { type: 'role', role: 'button', options: { name: /column settings|column order|column view/i }, name: 'column-view-button' },
      { type: 'text', value: /column settings|column order|column view/i, name: 'column-view-text' }
    ],
    backToDashboard: [
      { type: 'role', role: 'button', options: { name: /back to dashboard/i }, name: 'back-to-dashboard-button' },
      { type: 'text', value: /back to dashboard/i, name: 'back-to-dashboard-text' }
    ],
    returnToTop: [
      { type: 'role', role: 'button', options: { name: /return to top|run to top/i }, name: 'return-to-top-button' },
      { type: 'text', value: /return to top|run to top/i, name: 'return-to-top-text' }
    ],
    actionsMenu: [
      {
        type: 'custom',
        factory: (page) => page.getByRole('button', { name: /open row menu/i }).first(),
        name: 'row-actions-open-row-menu'
      },
      {
        type: 'custom',
        factory: (page) => page.getByRole('button', { name: /menu/i }).first(),
        name: 'row-actions-menu-button'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('table tbody tr').first().locator('button').last(),
        name: 'row-actions-last-button'
      }
    ],
    viewPaymentDetails: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /view payment details/i }).first(),
        name: 'view-payment-details-menuitem-container'
      },
      { type: 'role', role: 'menuitem', options: { name: /view payment details/i }, name: 'view-payment-details-menuitem' },
      { type: 'text', value: /view payment details/i, name: 'view-payment-details-text' }
    ]
  },
  table: {
    header(label) {
      return [
        { type: 'role', role: 'button', options: { name: new RegExp(label, 'i') }, name: `${label}-header-button` },
        { type: 'text', value: new RegExp(`^${label}$`, 'i'), name: `${label}-header-text` }
      ];
    }
  },
  pagination: {
    next: [
      {
        type: 'custom',
        factory: (page) => page.getByText(/page:\s*\d+\s*of\s*\d+/i).first().locator('..').locator('..').locator('xpath=.//button[last()-1]'),
        name: 'next-page-pagination-cluster'
      },
      { type: 'role', role: 'button', options: { name: /go to next page|next page/i }, name: 'next-page-button' },
      { type: 'css', value: 'button[aria-label*="next page" i],button[title*="next page" i]', name: 'next-page-css' },
      { type: 'css', value: 'svg.lucide-arrow-right,svg.lucide-chevron-right', name: 'next-page-icon' }
    ],
    previous: [
      {
        type: 'custom',
        factory: (page) => page.getByText(/page:\s*\d+\s*of\s*\d+/i).first().locator('..').locator('..').locator('xpath=.//button[2]'),
        name: 'previous-page-pagination-cluster'
      },
      { type: 'role', role: 'button', options: { name: /go to previous page|previous page/i }, name: 'previous-page-button' },
      { type: 'css', value: 'button[aria-label*="previous page" i],button[title*="previous page" i]', name: 'previous-page-css' },
      { type: 'css', value: 'svg.lucide-arrow-left,svg.lucide-chevron-left', name: 'previous-page-icon' }
    ],
    first: [
      {
        type: 'custom',
        factory: (page) => page.getByText(/page:\s*\d+\s*of\s*\d+/i).first().locator('..').locator('..').locator('xpath=.//button[1]'),
        name: 'first-page-pagination-cluster'
      },
      { type: 'role', role: 'button', options: { name: /go to first page|first page/i }, name: 'first-page-button' },
      { type: 'css', value: 'button[aria-label*="first page" i],button[title*="first page" i]', name: 'first-page-css' }
    ],
    last: [
      {
        type: 'custom',
        factory: (page) => page.getByText(/page:\s*\d+\s*of\s*\d+/i).first().locator('..').locator('..').locator('xpath=.//button[last()]'),
        name: 'last-page-pagination-cluster'
      },
      { type: 'role', role: 'button', options: { name: /go to last page|last page/i }, name: 'last-page-button' },
      { type: 'css', value: 'button[aria-label*="last page" i],button[title*="last page" i]', name: 'last-page-css' }
    ]
  },
  detail: {
    nextPayment: [
      { type: 'role', role: 'button', options: { name: /next payment|next/i }, name: 'next-payment-button' },
      { type: 'text', value: /next payment/i, name: 'next-payment-text' }
    ],
    previousPayment: [
      { type: 'role', role: 'button', options: { name: /previous payment|previous/i }, name: 'previous-payment-button' },
      { type: 'text', value: /previous payment/i, name: 'previous-payment-text' }
    ],
    paymentList: [
      { type: 'role', role: 'link', options: { name: /payments? list/i }, name: 'payment-list-link' },
      { type: 'role', role: 'button', options: { name: /payments? list/i }, name: 'payment-list-button' },
      { type: 'text', value: /payments? list/i, name: 'payment-list-text' }
    ],
    comments: [
      {
        type: 'custom',
        factory: (page) => page.locator('button:not([disabled]):not([aria-disabled="true"])').filter({ hasText: /comments/i }).first(),
        name: 'comments-button-enabled'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="tab"]').filter({ hasText: /^comments$/i }).first(),
        name: 'comments-tab'
      }
    ],
    commentInput: [
      { type: 'css', value: 'textarea#comments, textarea[name="comments"]', name: 'comment-input-textarea' },
      { type: 'label', value: /^comments$/i, name: 'comment-input-label' },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="dialog"] textarea').first(),
        name: 'comment-input-dialog-textarea'
      }
    ],
    addComment: [
      { type: 'role', role: 'button', options: { name: /add comment/i }, name: 'add-comment-button' },
      { type: 'text', value: /add comment/i, name: 'add-comment-text' }
    ],
    saveComment: [
      { type: 'role', role: 'button', options: { name: /^save$/i }, name: 'save-comment-button' },
      { type: 'text', value: /^save$/i, name: 'save-comment-text' }
    ],
    commentSuccessToast: [
      { type: 'text', value: /your comment was added successfully/i, name: 'comment-added-toast' }
    ],
    commentRow(commentText) {
      return [
        {
          type: 'custom',
          factory: (page) => page.locator('[role="dialog"] table tbody tr').filter({ hasText: new RegExp(commentText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first(),
          name: 'comment-row-dialog'
        },
        {
          type: 'custom',
          factory: (page) => page.locator('table tbody tr').filter({ hasText: new RegExp(commentText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first(),
          name: 'comment-row-page'
        }
      ];
    },
    deleteCommentSuccessToast: [
      { type: 'text', value: /your comment was deleted successfully/i, name: 'comment-deleted-toast' }
    ],
    commentRowActions: [
      {
        type: 'custom',
        factory: (page) => page.locator('table tbody tr').first().locator('button').last(),
        name: 'comment-row-actions-first-row'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="dialog"] table tbody tr').first().locator('button').last(),
        name: 'comment-row-actions-dialog-first-row'
      }
    ],
    editComment: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /edit comment/i }).first(),
        name: 'edit-comment-menuitem-container'
      },
      { type: 'role', role: 'menuitem', options: { name: /edit comment/i }, name: 'edit-comment-menuitem' },
      { type: 'text', value: /edit comment/i, name: 'edit-comment-text' }
    ],
    deleteComment: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /delete comment/i }).first(),
        name: 'delete-comment-menuitem-container'
      },
      { type: 'role', role: 'menuitem', options: { name: /delete comment/i }, name: 'delete-comment-menuitem' },
      { type: 'text', value: /delete comment/i, name: 'delete-comment-text' }
    ],
    invoices: [
      { type: 'role', role: 'tab', options: { name: /invoices/i }, name: 'invoices-tab' },
      { type: 'role', role: 'button', options: { name: /invoices/i }, name: 'invoices-button' },
      { type: 'text', value: /^Invoices$/i, name: 'invoices-text' }
    ],
    generalInformation: [
      { type: 'role', role: 'tab', options: { name: /general information/i }, name: 'general-information-tab' },
      { type: 'role', role: 'button', options: { name: /general information/i }, name: 'general-information-button' },
      { type: 'text', value: /general information/i, name: 'general-information-text' }
    ],
    transactions: [
      { type: 'role', role: 'tab', options: { name: /transactions/i }, name: 'transactions-tab' },
      { type: 'role', role: 'button', options: { name: /transactions/i }, name: 'transactions-button' },
      { type: 'text', value: /^Transactions$/i, name: 'transactions-text' }
    ],
    authorizationAndDecline: [
      { type: 'role', role: 'tab', options: { name: /authorizations? and declines?/i }, name: 'authorization-and-decline-tab' },
      { type: 'role', role: 'button', options: { name: /authorizations? and declines?/i }, name: 'authorization-and-decline-button' },
      { type: 'text', value: /authorizations? and declines?/i, name: 'authorization-and-decline-text' }
    ],
    history: [
      { type: 'role', role: 'tab', options: { name: /history/i }, name: 'history-tab' },
      { type: 'role', role: 'button', options: { name: /history/i }, name: 'history-button' },
      { type: 'text', value: /^History$/i, name: 'history-text' }
    ],
    blockPayment: [
      { type: 'role', role: 'button', options: { name: /block payment|block/i }, name: 'block-payment-button' },
      { type: 'text', value: /block payment|block/i, name: 'block-payment-text' }
    ],
    print: [
      { type: 'role', role: 'button', options: { name: /print/i }, name: 'print-button' },
      { type: 'text', value: /^Print$/i, name: 'print-text' }
    ]
  },
  menus: {
    ascending: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /ascending|asc/i }).first(),
        name: 'ascending-menuitem-container'
      },
      { type: 'text', value: /ascending|asc/i, name: 'ascending-text' },
      { type: 'role', role: 'menuitem', options: { name: /ascending|asc/i }, name: 'ascending-menuitem' }
    ],
    descending: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /descending|dsc/i }).first(),
        name: 'descending-menuitem-container'
      },
      { type: 'text', value: /descending|dsc/i, name: 'descending-text' },
      { type: 'role', role: 'menuitem', options: { name: /descending|dsc/i }, name: 'descending-menuitem' }
    ],
    hideColumn: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /hide column|hide/i }).first(),
        name: 'hide-column-menuitem-container'
      },
      { type: 'text', value: /hide column|hide/i, name: 'hide-column-text' },
      { type: 'role', role: 'menuitem', options: { name: /hide column|hide/i }, name: 'hide-column-menuitem' }
    ]
  }
};

module.exports = {
  imremitDashboardFailedPaymentsOnImImErrorSelectors
};
