const pmNewModuleSelectors = {
  moduleTabs: {
    imremit: [
      { type: 'role', role: 'link', options: { name: /imremit( premium)?/i }, name: 'imremit-link' },
      { type: 'role', role: 'button', options: { name: /imremit( premium)?/i }, name: 'imremit-button' },
      { type: 'text', value: /imremit( premium)?/i, name: 'imremit-text' }
    ],
    paymentManagement: [
      { type: 'role', role: 'link', options: { name: /^payment management$/i }, name: 'payment-management-link' },
      { type: 'role', role: 'button', options: { name: /^payment management$/i }, name: 'payment-management-button' },
      { type: 'css', value: 'a[href*="/payment-management"]', name: 'payment-management-href' },
      { type: 'text', value: /^payment management$/i, name: 'payment-management-text' }
    ]
  },
  headings: {
    paymentManagement: [
      { type: 'role', role: 'heading', options: { name: /^payment management$/i }, name: 'payment-management-heading' },
      { type: 'text', value: /^payment management$/i, name: 'payment-management-heading-text' }
    ],
    updatedDate: [
      { type: 'role', role: 'button', options: { name: /updated date/i }, name: 'updated-date-header-button' },
      { type: 'text', value: /^updated date$/i, name: 'updated-date-header-text' }
    ]
  },
  customerPicker: {
    trigger: [
      {
        type: 'custom',
        factory: (page) => page.locator('button[role="combobox"], [role="combobox"]').filter({ hasText: /select customer|select customers|select all/i }).first(),
        name: 'customer-picker-trigger'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('section form button[role="combobox"], form button[role="combobox"]').first(),
        name: 'customer-picker-form-trigger'
      }
    ],
    searchInput: [
      { type: 'placeholder', value: /search customers? \(min\. 3 characters\)\.\.\.|search customers?/i, name: 'customer-search-placeholder' },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="dialog"], [data-radix-popper-content-wrapper]').locator('input').first(),
        name: 'customer-search-input'
      }
    ]
  },
  supplierPicker: {
    trigger: [
      { type: 'role', role: 'button', options: { name: /select suppliers?/i }, name: 'supplier-picker-trigger-button' },
      { type: 'text', value: /select suppliers?\.\.\./i, name: 'supplier-picker-trigger-text' }
    ],
    searchInput: [
      { type: 'placeholder', value: /search suppliers?\.\.\./i, name: 'supplier-search-placeholder' },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="dialog"], [data-radix-popper-content-wrapper]').locator('input').first(),
        name: 'supplier-search-input'
      }
    ]
  },
  filters: {
    paymentNumberInput: [
      { type: 'placeholder', value: /payment number/i, name: 'payment-number-placeholder' },
      { type: 'css', value: 'input[name="paymentNumber"]', name: 'payment-number-input-name' },
      { type: 'role', role: 'textbox', options: { name: /^payment number\.?\.\.?$/i }, name: 'payment-number-textbox' },
      { type: 'role', role: 'textbox', options: { name: /payment number/i }, name: 'payment-number-textbox-broad' }
    ],
    statusTrigger: [
      { type: 'role', role: 'button', options: { name: /^status$/i }, name: 'status-filter-button' },
      { type: 'text', value: /^status$/i, name: 'status-filter-text' }
    ]
  },
  rowActions: {
    menu: [
      {
        type: 'custom',
        factory: (page) => page.getByRole('button', { name: /open row menu/i }).first(),
        name: 'row-actions-open-row-menu'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('table tbody tr').first().locator('button[aria-haspopup="menu"]').first(),
        name: 'row-actions-aria-haspopup-menu'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('table tbody tr').first().locator('button').last(),
        name: 'row-actions-last-button'
      }
    ]
  },
  list: {
    toggleColumnVisibility: [
      { type: 'role', role: 'button', options: { name: /column settings|column order|column views?/i }, name: 'column-visibility-button' },
      { type: 'text', value: /column settings|column order|column views?/i, name: 'column-visibility-text' },
      { type: 'css', value: 'button[aria-label*="column visibility"], button[aria-label*="Toggle column visibility options"]', name: 'column-visibility-aria' }
    ]
  },
  table: {
    header(label) {
      const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return [
        {
          type: 'custom',
          factory: (page) => page.locator('table thead th').filter({
            has: page.locator('button').filter({ hasText: new RegExp(`^${escapedLabel}$`, 'i') }).first()
          }).locator('button').first(),
          name: `${label}-header-table-button`
        },
        {
          type: 'custom',
          factory: (page) => page.getByRole('columnheader', { name: new RegExp(`sort by ${escapedLabel}`, 'i') }).locator('button').first(),
          name: `${label}-header-columnheader-button`
        },
        { type: 'role', role: 'button', options: { name: new RegExp(label, 'i') }, name: `${label}-header-button` },
        { type: 'text', value: new RegExp(`^${label}$`, 'i'), name: `${label}-header-text` }
      ];
    },
    columnOption(label) {
      const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return [
        {
          type: 'custom',
          factory: (page) => page.locator('[role="menu"], [data-radix-popper-content-wrapper]').locator(`text=/^${escapedLabel}$/i`).first(),
          name: `${label}-column-option-text`
        },
        {
          type: 'custom',
          factory: (page) => page.locator('[role="menu"], [data-radix-popper-content-wrapper]').locator('label, [role="menuitemcheckbox"], button, div').filter({ hasText: new RegExp(`^${escapedLabel}$`, 'i') }).first(),
          name: `${label}-column-option-row`
        }
      ];
    }
  },
  menus: {
    ascending: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menu"], [data-radix-popper-content-wrapper]').getByText(/^Ascending$/i).locator('xpath=ancestor::*[@role="menuitem" or self::button][1]').first(),
        name: 'ascending-popup-text-ancestor-row'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('body > div, [data-radix-popper-content-wrapper]').locator('[role="menuitem"], button').filter({ hasText: /ascending/i }).first(),
        name: 'ascending-popup-row'
      },
      {
        type: 'custom',
        factory: (page) => page.getByText(/^ascending$/i).last(),
        name: 'ascending-text-exact-last'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /ascending|asc/i }).first(),
        name: 'ascending-menuitem-container'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menu"], [data-radix-popper-content-wrapper]').locator('div, button, span').filter({ hasText: /ascending|asc/i }).first(),
        name: 'ascending-menu-text-container'
      },
      { type: 'role', role: 'menuitem', options: { name: /ascending|asc/i }, name: 'ascending-menuitem' },
      { type: 'text', value: /ascending|asc/i, name: 'ascending-text' }
    ],
    descending: [
      {
        type: 'custom',
        factory: (page) => page.locator('body > div, [data-radix-popper-content-wrapper]').locator('button, div').filter({ hasText: /^descending/i }).first(),
        name: 'descending-popup-row'
      },
      {
        type: 'custom',
        factory: (page) => page.getByText(/^descending$/i).last(),
        name: 'descending-text-exact-last'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /descending|desc|dsc/i }).first(),
        name: 'descending-menuitem-container'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menu"], [data-radix-popper-content-wrapper]').locator('div, button, span').filter({ hasText: /descending|desc|dsc/i }).first(),
        name: 'descending-menu-text-container'
      },
      { type: 'role', role: 'menuitem', options: { name: /descending|desc|dsc/i }, name: 'descending-menuitem' },
      { type: 'text', value: /descending|desc|dsc/i, name: 'descending-text' }
    ],
    hideColumn: [
      {
        type: 'custom',
        factory: (page) => page.locator('body > div, [data-radix-popper-content-wrapper]').locator('button, div').filter({ hasText: /^hide column/i }).first(),
        name: 'hide-column-popup-row'
      },
      {
        type: 'custom',
        factory: (page) => page.getByText(/^hide column$/i).last(),
        name: 'hide-column-text-exact-last'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /hide column|hide/i }).first(),
        name: 'hide-column-menuitem-container'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menu"], [data-radix-popper-content-wrapper]').locator('div, button, span').filter({ hasText: /hide column|hide/i }).first(),
        name: 'hide-column-text-container'
      },
      { type: 'role', role: 'menuitem', options: { name: /hide column|hide/i }, name: 'hide-column-menuitem' },
      { type: 'text', value: /hide column|hide/i, name: 'hide-column-text' }
    ]
  },
  detail: {
    viewPaymentDetails: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /view payment details/i }).first(),
        name: 'view-payment-details-menuitem-container'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menu"], [data-radix-popper-content-wrapper]').locator('div, button').filter({ hasText: /view payment details/i }).first(),
        name: 'view-payment-details-menu-container'
      },
      { type: 'role', role: 'menuitem', options: { name: /view payment details/i }, name: 'view-payment-details-menuitem' },
      { type: 'text', value: /view payment details/i, name: 'view-payment-details-text' }
    ],
    invoicesTab: [
      { type: 'role', role: 'tab', options: { name: /^invoices$/i }, name: 'invoices-tab' },
      { type: 'role', role: 'button', options: { name: /^invoices$/i }, name: 'invoices-button' },
      { type: 'text', value: /^invoices$/i, name: 'invoices-text' }
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
      },
      { type: 'role', role: 'button', options: { name: /^comments$/i }, name: 'comments-button' },
      { type: 'text', value: /^comments$/i, name: 'comments-text' }
    ],
    commentInput: [
      { type: 'css', value: 'textarea#comments, textarea[name="comments"]', name: 'comment-textarea' },
      { type: 'label', value: /^comments$/i, name: 'comment-label' },
      { type: 'role', role: 'textbox', options: { name: /comments?/i }, name: 'comment-textbox' },
      { type: 'css', value: '[role="dialog"] textarea, textarea', name: 'comment-dialog-textarea' }
    ],
    addComment: [
      { type: 'role', role: 'button', options: { name: /add comment/i }, name: 'add-comment-button' },
      { type: 'text', value: /add comment/i, name: 'add-comment-text' }
    ],
    commentSuccess: [
      { type: 'text', value: /your comment was added successfully/i, name: 'comment-success-text' }
    ],
    dateTimeHeader: [
      { type: 'text', value: /^date\/time$/i, name: 'date-time-header-text' },
      { type: 'role', role: 'button', options: { name: /^date\/time$/i }, name: 'date-time-header-button' }
    ],
    confirmationNumberHeader: [
      { type: 'role', role: 'columnheader', options: { name: /confirmation number/i }, name: 'confirmation-number-header' },
      { type: 'text', value: /confirmation number/i, name: 'confirmation-number-text' }
    ]
  }
};

module.exports = {
  pmNewModuleSelectors
};
