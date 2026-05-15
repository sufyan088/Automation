const proxypayImremitMoudleSelectors = {
  moduleTabs: {
    imremit: [
      { type: 'role', role: 'link', options: { name: /imremit/i }, name: 'imremit-link' },
      { type: 'role', role: 'button', options: { name: /imremit/i }, name: 'imremit-button' },
      { type: 'text', value: /imremit/i, name: 'imremit-text' }
    ],
    proxyPayDashboard: [
      { type: 'role', role: 'link', options: { name: /proxy pay dashboard/i }, name: 'proxy-pay-dashboard-link' },
      { type: 'role', role: 'button', options: { name: /proxy pay dashboard/i }, name: 'proxy-pay-dashboard-button' },
      { type: 'css', value: 'a[href*="/proxy-pay-dashboard"]', name: 'proxy-pay-dashboard-href' },
      { type: 'text', value: /proxy pay dashboard/i, name: 'proxy-pay-dashboard-text' }
    ]
  },
  headings: {
    proxyPayDashboard: [
      { type: 'role', role: 'heading', options: { name: /proxy pay dashboard/i }, name: 'proxy-pay-dashboard-heading' },
      { type: 'text', value: /proxy pay dashboard/i, name: 'proxy-pay-dashboard-text' }
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
        factory: (page) => page.locator('button[role="combobox"], [role="combobox"]').first(),
        name: 'any-combobox-trigger'
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
  list: {
    toggleColumnVisibility: [
      { type: 'role', role: 'button', options: { name: /column settings|column order|column views?/i }, name: 'column-settings-button' },
      { type: 'text', value: /column settings|column order|column views?/i, name: 'column-settings-text' },
      { type: 'role', role: 'button', options: { name: /toggle column visibility options/i }, name: 'toggle-column-visibility-button' },
      { type: 'label', value: /toggle column visibility options/i, name: 'toggle-column-visibility-label' },
      { type: 'css', value: 'button[aria-label*="Toggle column visibility options"]', name: 'toggle-column-visibility-css' }
    ]
  },
  table: {
    header(label) {
      return [
        { type: 'role', role: 'button', options: { name: new RegExp(label, 'i') }, name: `${label}-header-button` },
        { type: 'text', value: new RegExp(`^${label}$`, 'i'), name: `${label}-header-text` }
      ];
    },
    cellText(label) {
      return [
        { type: 'text', value: new RegExp(`^${label}$`, 'i'), name: `${label}-cell-text` }
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
          factory: (page) => page.locator('[role="menu"], [data-radix-popper-content-wrapper]').locator('[role="menuitemcheckbox"], [role="menuitem"], div').filter({ hasText: new RegExp(`^${escapedLabel}$`, 'i') }).first(),
          name: `${label}-column-option-row`
        }
      ];
    }
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
        factory: (page) => page.locator('[role="menuitem"]').filter({ hasText: /descending|desc|dsc/i }).first(),
        name: 'descending-menuitem-container'
      },
      { type: 'text', value: /descending|desc|dsc/i, name: 'descending-text' },
      { type: 'role', role: 'menuitem', options: { name: /descending|desc|dsc/i }, name: 'descending-menuitem' }
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
  proxypayImremitMoudleSelectors
};
