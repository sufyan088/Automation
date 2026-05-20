const mgmtPercentageGrowthSelectors = {
  navigation: {
    adminModule: [
      { type: 'role', role: 'link', options: { name: 'Admin', exact: true }, name: 'admin link' },
      { type: 'role', role: 'button', options: { name: 'Admin', exact: true }, name: 'admin button' },
      { type: 'text', value: 'Admin', options: { exact: true }, name: 'admin text' },
      {
        type: 'xpath',
        value: "//*[contains(@class,'w-full h-full flex flex-col justify-center items-center')][8]",
        name: 'admin module tile'
      }
    ],
    adminHeading: [
      { type: 'role', role: 'heading', options: { name: 'Admin', exact: true }, name: 'admin heading' }
    ],
    mgmtInformationSystemLink: [
      { type: 'role', role: 'link', options: { name: 'MGMT Information System', exact: true }, name: 'mis link' },
      { type: 'text', value: 'MGMT Information System', options: { exact: true }, name: 'mis text' }
    ],
    percentageGrowthTab: [
      { type: 'role', role: 'tab', options: { name: 'Percentage Growth', exact: true }, name: 'percentage growth tab' },
      { type: 'role', role: 'button', options: { name: 'Percentage Growth', exact: true }, name: 'percentage growth button' },
      { type: 'text', value: 'Percentage Growth', options: { exact: true }, name: 'percentage growth text' }
    ],
    percentageGrowthHeading: [
      { type: 'role', role: 'heading', options: { name: 'MIS Percentage Growth', exact: true }, name: 'percentage growth heading' },
      { type: 'text', value: 'MIS Percentage Growth', options: { exact: true }, name: 'percentage growth heading text' }
    ]
  },
  page: {
    graphHeading: [
      { type: 'role', role: 'heading', options: { name: 'Percentage Growth Graph', exact: true }, name: 'graph heading' },
      { type: 'text', value: 'Percentage Growth Graph', options: { exact: true }, name: 'graph heading text' }
    ],
    adjustFiltersButton: [
      { type: 'role', role: 'button', options: { name: 'Adjust Filters', exact: true }, name: 'adjust filters button' },
      { type: 'text', value: 'Adjust Filters', options: { exact: true }, name: 'adjust filters text' }
    ],
    hideFiltersButton: [
      { type: 'role', role: 'button', options: { name: 'Hide Filters', exact: true }, name: 'hide filters button' },
      { type: 'text', value: 'Hide Filters', options: { exact: true }, name: 'hide filters text' }
    ],
    downloadReportButton: [
      { type: 'role', role: 'button', options: { name: 'Download Report', exact: true }, name: 'download report button' },
      { type: 'text', value: 'Download Report', options: { exact: true }, name: 'download report text' }
    ],
    downloadBothButton: [
      { type: 'role', role: 'button', options: { name: 'Download Both', exact: true }, name: 'download both button' },
      { type: 'text', value: 'Download Both', options: { exact: true }, name: 'download both text' }
    ],
    downloadChartButton: [
      { type: 'role', role: 'button', options: { name: 'Download Chart', exact: true }, name: 'download chart button' },
      { type: 'text', value: 'Download Chart', options: { exact: true }, name: 'download chart text' }
    ],
    showTableButton: [
      { type: 'role', role: 'button', options: { name: 'Show Table', exact: true }, name: 'show table button' },
      { type: 'text', value: 'Show Table', options: { exact: true }, name: 'show table text' }
    ],
    hideTableButton: [
      { type: 'role', role: 'button', options: { name: 'Hide Table', exact: true }, name: 'hide table button' },
      { type: 'text', value: 'Hide Table', options: { exact: true }, name: 'hide table text' }
    ],
    showChartButton: [
      { type: 'role', role: 'button', options: { name: 'Show Chart', exact: true }, name: 'show chart button' },
      { type: 'text', value: 'Show Chart', options: { exact: true }, name: 'show chart text' }
    ],
    hideChartButton: [
      { type: 'role', role: 'button', options: { name: 'Hide Chart', exact: true }, name: 'hide chart button' },
      { type: 'text', value: 'Hide Chart', options: { exact: true }, name: 'hide chart text' }
    ],
    returnToTopButton: [
      { type: 'role', role: 'button', options: { name: 'Return to top', exact: true }, name: 'return to top button' },
      { type: 'text', value: 'Return to top', options: { exact: true }, name: 'return to top text' },
      { type: 'text', value: 'Return To Top', options: { exact: true }, name: 'return to top alt text' }
    ],
    searchAllEntriesInput: [
      { type: 'placeholder', value: 'Search all entries...', name: 'search all entries placeholder' },
      { type: 'custom', name: 'search all entries textbox', factory: (page) => page.locator('input[placeholder="Search all entries..."]').first() }
    ],
    searchResetButton: [
      { type: 'role', role: 'button', options: { name: 'Search Reset', exact: true }, name: 'search reset button' },
      { type: 'text', value: 'Search Reset', options: { exact: true }, name: 'search reset text' },
      { type: 'custom', name: 'search reset composite button', factory: (page) => page.locator('button').filter({ hasText: /Search Reset/i }).first() }
    ],
    pageResetFiltersButton: [
      { type: 'role', role: 'button', options: { name: 'Reset', exact: true }, name: 'page reset button' },
      { type: 'text', value: 'Reset', options: { exact: true }, name: 'page reset text' },
      { type: 'role', role: 'button', options: { name: 'Reset Filters', exact: true }, name: 'page reset filters button' },
      { type: 'text', value: 'Reset Filters', options: { exact: true }, name: 'page reset filters text' },
      { type: 'custom', name: 'page reset filters button fallback', factory: (page) => page.locator('button').filter({ hasText: /^(Reset|Reset Filters)$/ }).first() }
    ],
    paginationButton: [
      { type: 'custom', name: 'table pagination combobox', factory: (page) => page.locator('#table-container [role="combobox"], #table-container button[aria-haspopup="listbox"], #table-container button[dir="ltr"]').last() }
    ],
    columnViewsButton: [
      { type: 'role', role: 'button', options: { name: 'Column Order', exact: true }, name: 'column order button' },
      { type: 'text', value: 'Column Order', options: { exact: true }, name: 'column order text' },
      { type: 'custom', name: 'column settings button', factory: (page) => page.locator('#table-container button[aria-label="Column settings"], button[aria-label="Column settings"]').first() },
      { type: 'role', role: 'button', options: { name: 'Column Views', exact: true }, name: 'column views button' },
      { type: 'text', value: 'Column Views', options: { exact: true }, name: 'column views text' }
    ],
    tableHeading: [
      { type: 'role', role: 'heading', options: { name: 'Percentage Growth Table', exact: true }, name: 'table heading' },
      { type: 'text', value: 'Percentage Growth Table', options: { exact: true }, name: 'table heading text' }
    ],
    tableElement: [
      { type: 'custom', name: 'percentage growth table', factory: (page) => page.locator('#table-container table').first() },
      { type: 'role', role: 'table', name: 'visible table' }
    ],
    nextPageButton: [
      { type: 'custom', name: 'next page button', factory: (page) => page.locator('#table-container button[aria-label*="next" i], #table-container :text("Go to next page")').first() },
      { type: 'text', value: 'Go to next page', options: { exact: true }, name: 'next page text' }
    ],
    previousPageButton: [
      { type: 'custom', name: 'previous page button', factory: (page) => page.locator('#table-container button[aria-label*="previous" i], #table-container :text("Go to previous page")').first() },
      { type: 'text', value: 'Go to previous page', options: { exact: true }, name: 'previous page text' }
    ],
    firstPageButton: [
      { type: 'custom', name: 'first page button', factory: (page) => page.locator('#table-container button[aria-label*="first" i], #table-container :text("Go to first page")').first() },
      { type: 'text', value: 'Go to first page', options: { exact: true }, name: 'first page text' }
    ],
    lastPageButton: [
      { type: 'custom', name: 'last page button', factory: (page) => page.locator('#table-container button[aria-label*="last" i], #table-container :text("Go to last page")').first() },
      { type: 'text', value: 'Go to last page', options: { exact: true }, name: 'last page text' }
    ],
    sortAscOption: [
      { type: 'text', value: 'Asc', options: { exact: true }, name: 'asc option' },
      { type: 'text', value: 'Ascending', options: { exact: true }, name: 'ascending option' }
    ],
    parentCustomerHeader: [
      { type: 'custom', name: 'parent customer header', factory: (page) => page.locator('#table-container').getByText(/Parent Customer/i).first() },
      { type: 'custom', name: 'parent customer column cell', factory: (page) => page.locator('#table-container tbody tr td:nth-child(2)').first() },
      { type: 'text', value: 'Parent Customer', options: { exact: true }, name: 'parent customer text' }
    ],
    sortDescOption: [
      { type: 'text', value: 'Desc', options: { exact: true }, name: 'desc option' },
      { type: 'text', value: 'Descending', options: { exact: true }, name: 'descending option' }
    ],
    sortHideOption: [
      { type: 'text', value: 'Hide', options: { exact: true }, name: 'hide option' },
      { type: 'text', value: 'Hide column', options: { exact: true }, name: 'hide column option' }
    ],
    showDifferencesCheckbox: [
      { type: 'role', role: 'checkbox', options: { name: 'Show Differences', exact: true }, name: 'show differences checkbox' },
      { type: 'label', value: 'Show Differences', name: 'show differences label' },
      { type: 'text', value: 'Show Differences', options: { exact: true }, name: 'show differences text' }
    ]
  },
  filters: {
    dialogHeading: [
      { type: 'role', role: 'heading', options: { name: 'MIS Filter Settings', exact: true }, name: 'filter dialog heading' },
      { type: 'text', value: 'MIS Filter Settings', options: { exact: true }, name: 'filter dialog text' }
    ],
    moduleLabel: [
      { type: 'text', value: 'Module:', options: { exact: true }, name: 'module label' }
    ],
    resetFiltersButton: [
      { type: 'role', role: 'button', options: { name: 'Reset', exact: true }, name: 'reset button' },
      { type: 'text', value: 'Reset', options: { exact: true }, name: 'reset text' },
      { type: 'role', role: 'button', options: { name: 'Reset Filters', exact: true }, name: 'reset filters button' },
      { type: 'text', value: 'Reset Filters', options: { exact: true }, name: 'reset filters text' },
      { type: 'custom', name: 'reset filters button fallback', factory: (page) => page.locator('[role="dialog"] button').filter({ hasText: /^(Reset|Reset Filters)$/ }).first() }
    ],
    customersLabel: [
      { type: 'text', value: 'Customers:*', options: { exact: true }, name: 'customers label' },
      { type: 'text', value: 'Customers:', options: { exact: true }, name: 'customers label base' }
    ],
    customerSearchInput: [
      { type: 'placeholder', value: 'Search customers (min 3 characters)...', name: 'search customers placeholder' },
      { type: 'placeholder', value: 'Search customers...', name: 'search customers alt placeholder' },
      { type: 'placeholder', value: 'Search customers (min. 3 characters)...', name: 'search customers alt placeholder 2' },
      { type: 'custom', name: 'dialog customer combobox', factory: (page) => page.locator('[role="dialog"] [role="combobox"]').last() }
    ],
    customerOptionsDialog: [
      { type: 'custom', name: 'customer options dialog', factory: (page) => page.locator('[role="dialog"]').filter({ has: page.locator('[role="option"], [role="combobox"]') }).last() }
    ],
    customerResetButton: [
      { type: 'custom', name: 'customer dialog reset button', factory: (page) => page.locator('[role="dialog"] button').filter({ hasText: /^Reset$/ }).first() },
      { type: 'role', role: 'button', options: { name: 'Reset', exact: true }, name: 'customer reset button' }
    ],
    allModulesSelected: [
      { type: 'text', value: 'All modules selected', options: { exact: true }, name: 'all modules selected' }
    ],
    allCustomersSelected: [
      { type: 'text', value: 'All customers selected', options: { exact: true }, name: 'all customers selected' },
      { type: 'text', value: 'All modules customers selected', options: { exact: true }, name: 'all modules customers selected' }
    ],
    senderLabel: [
      { type: 'text', value: 'Sender:', options: { exact: true }, name: 'sender label' }
    ],
    allSendersSelected: [
      { type: 'text', value: 'All senders selected', options: { exact: true }, name: 'all senders selected' },
      { type: 'text', value: 'All Senders', options: { exact: true }, name: 'all senders alt text' }
    ]
  }
};

module.exports = {
  mgmtPercentageGrowthSelectors
};
