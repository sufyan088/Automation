const proxyPayImremitNewSelectors = {
  moduleTabs: {
    imremit: [
      { type: 'role', role: 'link', options: { name: /imremit( premium)?/i }, name: 'imremit-link' },
      { type: 'role', role: 'button', options: { name: /imremit( premium)?/i }, name: 'imremit-button' },
      { type: 'text', value: /imremit( premium)?/i, name: 'imremit-text' }
    ],
    proxyPayDashboard: [
      { type: 'role', role: 'link', options: { name: /^proxy pay dashboard$/i }, name: 'proxy-pay-dashboard-link' },
      { type: 'role', role: 'button', options: { name: /^proxy pay dashboard$/i }, name: 'proxy-pay-dashboard-button' },
      { type: 'css', value: 'a[href*="/proxy-pay-dashboard"]', name: 'proxy-pay-dashboard-href' },
      { type: 'text', value: /^proxy pay dashboard$/i, name: 'proxy-pay-dashboard-text' }
    ],
    paymentManagement: [
      { type: 'role', role: 'link', options: { name: /^payment management$/i }, name: 'payment-management-link' },
      { type: 'role', role: 'button', options: { name: /^payment management$/i }, name: 'payment-management-button' },
      { type: 'css', value: 'a[href*="/payment-management"]', name: 'payment-management-href' },
      { type: 'text', value: /^payment management$/i, name: 'payment-management-text' }
    ]
  },
  headings: {
    invoiceCount: [
      { type: 'role', role: 'button', options: { name: /invoice count/i }, name: 'invoice-count-header-button' },
      { type: 'text', value: /^invoice count$/i, name: 'invoice-count-header-text' }
    ],
    advancedSearch: [
      { type: 'role', role: 'heading', options: { name: /advanced search/i }, name: 'advanced-search-heading' },
      { type: 'text', value: /advanced search/i, name: 'advanced-search-text' }
    ],
    noResults: [
      { type: 'text', value: /^no results\.?$/i, name: 'no-results-text' }
    ]
  },
  customerPicker: {
    trigger: [
      {
        type: 'custom',
        factory: (page) => page.locator('button[role="combobox"], [role="combobox"]').filter({ hasText: /select customer|select customers|select all|cadent|cardworks|verizon/i }).first(),
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
  filters: {
    advancedSearchToggle: [
      { type: 'role', role: 'button', options: { name: /advanced search/i }, name: 'advanced-search-button' },
      { type: 'text', value: /advanced search/i, name: 'advanced-search-text-trigger' }
    ],
    invoiceNumbersInput: [
      { type: 'placeholder', value: /enter invoice numbers\.\.\./i, name: 'invoice-number-placeholder' },
      { type: 'role', role: 'textbox', options: { name: /invoice numbers?/i }, name: 'invoice-number-textbox' },
      { type: 'css', value: 'input[placeholder*="invoice numbers"]', name: 'invoice-number-css' }
    ]
  },
  rowActions: {
    menu: [
      {
        type: 'custom',
        factory: (page) => page.getByRole('button', { name: /open row menu|row actions|actions/i }).first(),
        name: 'row-actions-open-row-menu'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('button[aria-label*="row menu" i], button[aria-label*="row actions" i], button[title*="row actions" i], button[title*="actions" i]').first(),
        name: 'row-actions-aria-label'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('table tbody tr').first().locator('button[aria-haspopup="menu"]').first(),
        name: 'row-actions-aria-haspopup-menu'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('button[aria-haspopup="menu"]').first(),
        name: 'row-actions-any-aria-haspopup-menu'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('td:last-child button, td [role="button"]').first(),
        name: 'row-actions-last-cell-button'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg') }).last(),
        name: 'row-actions-last-button'
      }
    ]
  },
  detail: {
    viewPaymentDetails: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /view payment details/i }).first(),
        name: 'view-payment-details-menuitem'
      },
      { type: 'text', value: /view payment details/i, name: 'view-payment-details-text' }
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
          factory: (page) => page.getByRole('columnheader', { name: new RegExp(escapedLabel, 'i') }).locator('button').first(),
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
        factory: (page) => page.locator('[role="menu"], [data-radix-popper-content-wrapper]').locator('div, button, span').filter({ hasText: /ascending|asc/i }).first(),
        name: 'ascending-menu-row'
      },
      { type: 'role', role: 'menuitem', options: { name: /ascending|asc/i }, name: 'ascending-menuitem' },
      { type: 'text', value: /ascending|asc/i, name: 'ascending-text' }
    ],
    descending: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menu"], [data-radix-popper-content-wrapper]').locator('div, button, span').filter({ hasText: /descending|desc|dsc/i }).first(),
        name: 'descending-menu-row'
      },
      { type: 'role', role: 'menuitem', options: { name: /descending|desc|dsc/i }, name: 'descending-menuitem' },
      { type: 'text', value: /descending|desc|dsc/i, name: 'descending-text' }
    ],
    hideColumn: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="menu"], [data-radix-popper-content-wrapper]').locator('div, button, span').filter({ hasText: /hide column|hide/i }).first(),
        name: 'hide-column-menu-row'
      },
      { type: 'role', role: 'menuitem', options: { name: /hide column|hide/i }, name: 'hide-column-menuitem' },
      { type: 'text', value: /hide column|hide/i, name: 'hide-column-text' }
    ]
  }
};

module.exports = {
  proxyPayImremitNewSelectors
};
