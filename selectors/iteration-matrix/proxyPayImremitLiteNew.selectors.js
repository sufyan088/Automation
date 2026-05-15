const proxyPayImremitLiteNewSelectors = {
  moduleTabs: {
    imremitLite: [
      { type: 'role', role: 'link', options: { name: /^imremit( lite)?$/i }, name: 'imremit-lite-link' },
      { type: 'role', role: 'button', options: { name: /^imremit( lite)?$/i }, name: 'imremit-lite-button' },
      { type: 'text', value: /^imremit( lite)?$/i, name: 'imremit-lite-text' }
    ],
    proxyPayDashboard: [
      { type: 'role', role: 'link', options: { name: /^proxy pay dashboard$/i }, name: 'proxy-pay-dashboard-link' },
      { type: 'role', role: 'button', options: { name: /^proxy pay dashboard$/i }, name: 'proxy-pay-dashboard-button' },
      { type: 'text', value: /^proxy pay dashboard$/i, name: 'proxy-pay-dashboard-text' }
    ],
    paymentManagement: [
      { type: 'role', role: 'link', options: { name: /^payment management$/i }, name: 'payment-management-link' },
      { type: 'role', role: 'button', options: { name: /^payment management$/i }, name: 'payment-management-button' },
      { type: 'text', value: /^payment management$/i, name: 'payment-management-text' }
    ]
  },
  headings: {
    app: [
      { type: 'role', role: 'heading', options: { name: /imremit \(lite\)/i }, name: 'imremit-lite-heading' },
      { type: 'text', value: /imremit \(lite\)/i, name: 'imremit-lite-text' }
    ],
    dashboard: [
      { type: 'role', role: 'heading', options: { name: /^proxy pay dashboard$/i }, name: 'proxy-pay-dashboard-heading' },
      { type: 'text', value: /^proxy pay dashboard$/i, name: 'proxy-pay-dashboard-text' }
    ],
    advancedSearch: [
      { type: 'role', role: 'heading', options: { name: /advanced search/i }, name: 'advanced-search-heading' },
      { type: 'text', value: /advanced search/i, name: 'advanced-search-text' }
    ]
  },
  customerPicker: {
    trigger: [
      { type: 'role', role: 'button', options: { name: /select customers?|select all/i }, name: 'customer-picker-trigger' },
      { type: 'css', value: 'form button[role="combobox"]', name: 'customer-picker-combobox' },
      { type: 'css', value: 'form button', name: 'customer-picker-button' }
    ],
    searchInput: [
      { type: 'placeholder', value: /search customers? \(min\.? 3 characters\)\.\.\./i, name: 'customer-search-placeholder' },
      { type: 'role', role: 'textbox', options: { name: /search customers?/i }, name: 'customer-search-textbox' },
      { type: 'css', value: 'input[placeholder*="Search customers"]', name: 'customer-search-css' }
    ]
  },
  toolbar: {
    advancedSearch: [
      { type: 'role', role: 'button', options: { name: /advanced search/i }, name: 'advanced-search-button' },
      { type: 'text', value: /advanced search/i, name: 'advanced-search-text' }
    ],
    columnViews: [
      { type: 'role', role: 'button', options: { name: /column order|column views/i }, name: 'column-views-button' },
      { type: 'text', value: /column order|column views/i, name: 'column-views-text' },
      { type: 'css', value: 'button[aria-label="Column settings"]', name: 'column-settings-aria-label' }
    ]
  },
  table: {
    invoiceCountHeader: [
      { type: 'role', role: 'button', options: { name: /^invoice count$/i }, name: 'invoice-count-button' },
      { type: 'text', value: /^invoice count$/i, name: 'invoice-count-text' }
    ],
    invoiceCountCell: [
      { type: 'custom', name: 'invoice-count-cell', factory: (page) => page.locator('tbody tr td').filter({ hasText: /^1$/ }).first() },
      { type: 'text', value: /^1$/, name: 'invoice-count-text-one' }
    ],
    noResults: [
      { type: 'role', role: 'cell', options: { name: /^no results\.?$/i }, name: 'no-results-cell' },
      { type: 'text', value: /^no results\.?$/i, name: 'no-results-text' }
    ]
  },
  dropdown: {
    ascending: [
      { type: 'role', role: 'menuitem', options: { name: /^ascending$/i }, name: 'ascending-menuitem' },
      { type: 'text', value: /^ascending$/i, name: 'ascending-text' }
    ],
    descending: [
      { type: 'role', role: 'menuitem', options: { name: /^descending$/i }, name: 'descending-menuitem' },
      { type: 'text', value: /^descending$/i, name: 'descending-text' }
    ],
    hideColumn: [
      { type: 'role', role: 'menuitem', options: { name: /hide column/i }, name: 'hide-column-menuitem' },
      { type: 'text', value: /hide column/i, name: 'hide-column-text' }
    ]
  },
  advancedSearch: {
    invoiceNumberInput: [
      { type: 'placeholder', value: /enter invoice numbers\.\.\./i, name: 'invoice-number-placeholder' },
      { type: 'role', role: 'textbox', options: { name: /invoice numbers?/i }, name: 'invoice-number-textbox' },
      { type: 'css', value: 'input[placeholder*="invoice numbers"]', name: 'invoice-number-css' }
    ],
    invoiceCountRow: [
      {
        type: 'custom',
        name: 'invoice-count-column-toggle-row',
        factory: (page) => page.locator('div, li').filter({ has: page.getByText(/^invoice count$/i) }).first()
      }
    ]
  }
};

module.exports = {
  proxyPayImremitLiteNewSelectors
};
