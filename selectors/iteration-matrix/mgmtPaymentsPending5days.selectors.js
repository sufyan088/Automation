const mgmtPaymentsPending5daysSelectors = {
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
    pendingPaymentsTab: [
      {
        type: 'role',
        role: 'tab',
        options: { name: 'Outstanding Balance Payments > 5 Days', exact: true },
        name: 'pending 5 days tab'
      },
      { type: 'text', value: 'Outstanding Balance Payments > 5 Days', options: { exact: true }, name: 'pending 5 days text' }
    ],
    pendingPaymentsHeading: [
      {
        type: 'role',
        role: 'tab',
        options: { name: 'Outstanding Balance Payments > 5 Days', exact: true, selected: true },
        name: 'selected pending 5 days tab'
      },
      { type: 'role', role: 'heading', options: { name: 'MIS Pending Payments', exact: true }, name: 'pending payments heading' },
      { type: 'text', value: 'MIS Pending Payments', options: { exact: true }, name: 'pending payments heading text' }
    ]
  },
  page: {
    adjustFiltersButton: [
      { type: 'role', role: 'button', options: { name: 'Adjust Filters', exact: true }, name: 'adjust filters button' },
      { type: 'text', value: 'Adjust Filters', options: { exact: true }, name: 'adjust filters text' }
    ],
    downloadReportButton: [
      { type: 'role', role: 'button', options: { name: 'Download Report', exact: true }, name: 'download report button' },
      { type: 'text', value: 'Download Report', options: { exact: true }, name: 'download report text' }
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
      { type: 'role', role: 'button', options: { name: 'Show Amounts Chart', exact: true }, name: 'show amounts chart button' },
      { type: 'role', role: 'button', options: { name: 'Show Counts Chart', exact: true }, name: 'show counts chart button' },
      { type: 'role', role: 'button', options: { name: 'Show Chart', exact: true }, name: 'show chart button' },
      { type: 'role', role: 'button', options: { name: 'Show Charts', exact: true }, name: 'show charts button' },
      { type: 'text', value: 'Show Amounts Chart', options: { exact: true }, name: 'show amounts chart text' },
      { type: 'text', value: 'Show Counts Chart', options: { exact: true }, name: 'show counts chart text' },
      { type: 'text', value: 'Show Chart', options: { exact: true }, name: 'show chart text' },
      { type: 'text', value: 'Show Charts', options: { exact: true }, name: 'show charts text' }
    ],
    hideChartButton: [
      { type: 'role', role: 'button', options: { name: 'Hide Amounts Chart', exact: true }, name: 'hide amounts chart button' },
      { type: 'role', role: 'button', options: { name: 'Hide Counts Chart', exact: true }, name: 'hide counts chart button' },
      { type: 'role', role: 'button', options: { name: 'Hide Chart', exact: true }, name: 'hide chart button' },
      { type: 'role', role: 'button', options: { name: 'Hide Charts', exact: true }, name: 'hide charts button' },
      { type: 'text', value: 'Hide Amounts Chart', options: { exact: true }, name: 'hide amounts chart text' },
      { type: 'text', value: 'Hide Counts Chart', options: { exact: true }, name: 'hide counts chart text' },
      { type: 'text', value: 'Hide Chart', options: { exact: true }, name: 'hide chart text' },
      { type: 'text', value: 'Hide Charts', options: { exact: true }, name: 'hide charts text' }
    ],
    returnToTopButton: [
      { type: 'role', role: 'button', options: { name: 'Return To Top', exact: true }, name: 'return to top button' },
      { type: 'text', value: 'Return To Top', options: { exact: true }, name: 'return to top text' },
      { type: 'text', value: 'Return to Top', options: { exact: true }, name: 'return to top text lower' }
    ],
    searchAllEntriesInput: [
      { type: 'placeholder', value: 'Search all entries...', name: 'search all entries placeholder' },
      { type: 'custom', name: 'search all entries textbox', factory: (page) => page.locator('input[placeholder="Search all entries..."]').first() }
    ],
    paginationButton: [
      {
        type: 'custom',
        name: 'table pagination combobox',
        factory: (page) => page.locator('#table-container [role="combobox"], #table-container button[aria-haspopup="listbox"], #table-container button[dir="ltr"]').last()
      }
    ],
    columnViewsButton: [
      { type: 'role', role: 'button', options: { name: 'Column Views', exact: true }, name: 'column views button' },
      { type: 'text', value: 'Column Views', options: { exact: true }, name: 'column views text' }
    ],
    pendingPaymentAmountsHeading: [
      { type: 'role', role: 'heading', options: { name: 'Outstanding Balance Payment Amount', exact: true }, name: 'outstanding amount heading' },
      { type: 'text', value: 'Outstanding Balance Payment Amount', options: { exact: true }, name: 'outstanding amount heading text' },
      { type: 'role', role: 'heading', options: { name: 'Pending Payment Amounts', exact: true }, name: 'amounts heading' }
    ],
    pendingPaymentCountsHeading: [
      { type: 'role', role: 'heading', options: { name: 'Outstanding Balance Payment Count', exact: true }, name: 'outstanding count heading' },
      { type: 'text', value: 'Outstanding Balance Payment Count', options: { exact: true }, name: 'outstanding count heading text' },
      { type: 'role', role: 'heading', options: { name: 'Pending Payment Counts', exact: true }, name: 'counts heading' }
    ],
    pendingPaymentsTableHeading: [
      { type: 'role', role: 'heading', options: { name: 'Pending Payments Table', exact: true }, name: 'table heading' },
      { type: 'text', value: 'Pending Payments Table', options: { exact: true }, name: 'table heading text' },
      { type: 'custom', name: 'table container', factory: (page) => page.locator('#table-container').first() }
    ],
    tableElement: [
      { type: 'custom', name: 'pending payments table', factory: (page) => page.locator('#table-container table').first() },
      { type: 'role', role: 'table', name: 'visible table' }
    ],
    graphLegendPayByWeb: [
      { type: 'role', role: 'button', options: { name: 'Pay by Web', exact: true }, name: 'pay by web button' },
      { type: 'text', value: 'Pay by Web', options: { exact: true }, name: 'pay by web legend' },
      { type: 'text', value: 'Pay By Web', options: { exact: true }, name: 'pay by web option' }
    ],
    graphLegendPayByEmail: [
      { type: 'role', role: 'button', options: { name: 'Pay by Email', exact: true }, name: 'pay by email button' },
      { type: 'text', value: 'Pay by Email', options: { exact: true }, name: 'pay by email legend' },
      { type: 'text', value: 'Pay By Email', options: { exact: true }, name: 'pay by email option' }
    ],
    graphLegendPayByPhone: [
      { type: 'role', role: 'button', options: { name: 'Pay by Phone', exact: true }, name: 'pay by phone button' },
      { type: 'text', value: 'Pay by Phone', options: { exact: true }, name: 'pay by phone legend' },
      { type: 'text', value: 'Pay By Phone', options: { exact: true }, name: 'pay by phone option' }
    ],
    graphLegendTotal: [
      { type: 'role', role: 'button', options: { name: 'Total', exact: true }, name: 'total button' },
      { type: 'text', value: 'Total', options: { exact: true }, name: 'total legend' }
    ],
    showTrendlineCheckbox: [
      { type: 'role', role: 'checkbox', options: { name: 'Show Trendline', exact: true }, name: 'show trendline checkbox' },
      { type: 'label', value: 'Show Trendline', name: 'show trendline label' }
    ],
    dayLabelCurrentMonth: [
      { type: 'text', value: 'May 2026', options: { exact: true }, name: 'current month label' }
    ],
    headerCustomerName: [
      { type: 'custom', name: 'customer name header button', factory: (page) => page.locator('#table-container button').filter({ hasText: 'Customer Name' }).first() },
      { type: 'text', value: 'Customer Name', options: { exact: true }, name: 'customer name header' }
    ],
    headerSupplierName: [
      { type: 'custom', name: 'supplier name header button', factory: (page) => page.locator('#table-container button').filter({ hasText: 'Supplier Name' }).first() },
      { type: 'text', value: 'Supplier Name', options: { exact: true }, name: 'supplier name header' }
    ],
    headerPid: [
      { type: 'custom', name: 'pid header button', factory: (page) => page.locator('#table-container button').filter({ hasText: 'PID' }).first() },
      { type: 'text', value: 'PID', options: { exact: true }, name: 'pid header' }
    ],
    headerPaymentNumber: [
      { type: 'custom', name: 'payment number header button', factory: (page) => page.locator('#table-container button').filter({ hasText: 'Payment Number' }).first() },
      { type: 'text', value: 'Payment Number', options: { exact: true }, name: 'payment number header' }
    ],
    headerDaysAging: [
      { type: 'custom', name: 'days aging header button', factory: (page) => page.locator('#table-container button').filter({ hasText: 'Days Aging' }).first() },
      { type: 'text', value: 'Days Aging', options: { exact: true }, name: 'days aging header' }
    ],
    headerPaymentStatus: [
      { type: 'custom', name: 'payment status header button', factory: (page) => page.locator('#table-container button').filter({ hasText: 'Payment Status' }).first() },
      { type: 'text', value: 'Payment Status', options: { exact: true }, name: 'payment status header' }
    ],
    headerPaymentStatusDescription: [
      { type: 'custom', name: 'payment status description header button', factory: (page) => page.locator('#table-container button').filter({ hasText: 'Payment Status Description' }).first() },
      { type: 'text', value: 'Payment Status Description', options: { exact: true }, name: 'payment status description header' }
    ],
    sortAscOption: [
      { type: 'text', value: 'Asc', options: { exact: true }, name: 'asc option' },
      { type: 'text', value: 'Ascending', options: { exact: true }, name: 'ascending option' }
    ],
    sortDescOption: [
      { type: 'text', value: 'Desc', options: { exact: true }, name: 'desc option' },
      { type: 'text', value: 'Descending', options: { exact: true }, name: 'descending option' }
    ],
    sortHideOption: [
      { type: 'text', value: 'Hide', options: { exact: true }, name: 'hide option' },
      { type: 'text', value: 'Hide column', options: { exact: true }, name: 'hide column option' }
    ]
  },
  filters: {
    dialogHeading: [
      { type: 'role', role: 'heading', options: { name: 'MIS Filter Settings', exact: true }, name: 'filter dialog heading' },
      { type: 'text', value: 'MIS Filter Settings', options: { exact: true }, name: 'filter dialog heading text' }
    ],
    basicFiltersTab: [
      { type: 'role', role: 'tab', options: { name: 'Basic Filters', exact: true }, name: 'basic filters tab' },
      { type: 'text', value: 'Basic Filters', options: { exact: true }, name: 'basic filters text' }
    ],
    advancedFiltersTab: [
      { type: 'role', role: 'tab', options: { name: 'Advanced Filters', exact: true }, name: 'advanced filters tab' },
      { type: 'text', value: 'Advanced Filters', options: { exact: true }, name: 'advanced filters text' }
    ],
    closeDialogButton: [
      { type: 'text', value: 'Close the dialog to view results.', options: { exact: true }, name: 'close dialog text' }
    ],
    moduleLabel: [
      { type: 'text', value: 'Module:', options: { exact: true }, name: 'module label' }
    ],
    customersLabel: [
      { type: 'text', value: 'Customers:*', options: { exact: true }, name: 'customers label' }
    ],
    remittanceMethodLabel: [
      { type: 'text', value: 'Remittance Method:', options: { exact: true }, name: 'remittance label' },
      { type: 'text', value: 'Sender:', options: { exact: true }, name: 'sender label' }
    ],
    supplierNameLabel: [
      { type: 'text', value: 'Supplier Name:', options: { exact: true }, name: 'supplier name label' },
      { type: 'text', value: 'Supplier Name', options: { exact: true }, name: 'supplier name label text' }
    ],
    supplierIdLabel: [
      { type: 'text', value: 'Supplier ID:', options: { exact: true }, name: 'supplier id label' },
      { type: 'text', value: 'Supplier ID', options: { exact: true }, name: 'supplier id label text' },
      { type: 'text', value: 'Supplier Number:', options: { exact: true }, name: 'supplier number label' },
      { type: 'text', value: 'Supplier Number', options: { exact: true }, name: 'supplier number label text' }
    ],
    paymentStatusLabel: [
      { type: 'text', value: 'Payment Status:', options: { exact: true }, name: 'payment status label' },
      { type: 'text', value: 'Payment Status', options: { exact: true }, name: 'payment status label text' }
    ],
    statusDescriptionLabel: [
      { type: 'text', value: 'Status Description:', options: { exact: true }, name: 'status description label' },
      { type: 'text', value: 'Payment Status Description', options: { exact: true }, name: 'payment status description label text' }
    ],
    daysAgingLabel: [
      { type: 'text', value: 'Days Aging:', options: { exact: true }, name: 'days aging label' },
      { type: 'text', value: 'Days Aging', options: { exact: true }, name: 'days aging label text' }
    ],
    moduleTrigger: [
      { type: 'text', value: 'All modules selected', options: { exact: true }, name: 'all modules trigger text' },
      {
        type: 'custom',
        name: 'all modules combobox',
        factory: (page) => page.getByRole('tabpanel', { name: 'Basic Filters' }).getByRole('combobox').nth(0)
      }
    ],
    customersTrigger: [
      { type: 'text', value: 'All customers selected', options: { exact: true }, name: 'all customers trigger' },
      { type: 'text', value: 'All modules customers selected', options: { exact: true }, name: 'all modules customers trigger' },
      {
        type: 'custom',
        name: 'customers combobox',
        factory: (page) => page.getByRole('tabpanel', { name: 'Basic Filters' }).getByRole('combobox').nth(1)
      }
    ],
    remittanceMethodTrigger: [
      {
        type: 'custom',
        name: 'remittance method trigger',
        factory: (page) => page.getByRole('tabpanel', { name: 'Basic Filters' }).getByRole('combobox').nth(2)
      }
    ],
    supplierNameTrigger: [
      { type: 'text', value: 'All suppliers selected', options: { exact: true }, name: 'all suppliers trigger' },
      {
        type: 'custom',
        name: 'supplier name trigger',
        factory: (page) => page.getByRole('tabpanel', { name: 'Advanced Filters' }).getByRole('combobox').nth(2)
      }
    ],
    supplierIdTrigger: [
      {
        type: 'custom',
        name: 'supplier id trigger',
        factory: (page) => page.getByRole('tabpanel', { name: 'Advanced Filters' }).getByRole('combobox').nth(3)
      }
    ],
    paymentStatusTrigger: [
      { type: 'text', value: 'All statuses selected', options: { exact: true }, name: 'all statuses trigger' },
      {
        type: 'custom',
        name: 'payment status trigger',
        factory: (page) => page.getByRole('tabpanel', { name: 'Advanced Filters' }).getByRole('combobox').nth(4)
      }
    ],
    statusDescriptionTrigger: [
      {
        type: 'custom',
        name: 'status description trigger',
        factory: (page) => page.getByRole('tabpanel', { name: 'Advanced Filters' }).getByRole('combobox').nth(5)
      }
    ],
    daysAgingTrigger: [
      {
        type: 'custom',
        name: 'days aging trigger',
        factory: (page) => page.getByRole('tabpanel', { name: 'Advanced Filters' }).getByRole('combobox').nth(1)
      }
    ],
    allModulesSelected: [
      { type: 'text', value: 'All modules selected', options: { exact: true }, name: 'all modules selected' },
      {
        type: 'custom',
        name: 'all modules selected combobox',
        factory: (page) => page.getByRole('tabpanel', { name: 'Basic Filters' }).getByRole('combobox').nth(0)
      }
    ],
    allCustomersSelected: [
      { type: 'text', value: 'All customers selected', options: { exact: true }, name: 'all customers selected' },
      { type: 'text', value: 'All modules customers selected', options: { exact: true }, name: 'all modules customers selected' },
      {
        type: 'custom',
        name: 'all customers selected combobox',
        factory: (page) => page.getByRole('tabpanel', { name: 'Basic Filters' }).getByRole('combobox').nth(1)
      }
    ],
    allSuppliersSelected: [
      { type: 'text', value: 'All suppliers selected', options: { exact: true }, name: 'all suppliers selected' },
      { type: 'text', value: 'Select a customer first', options: { exact: true }, name: 'select a customer first' },
      {
        type: 'custom',
        name: 'supplier name combobox',
        factory: (page) => page.getByRole('tabpanel', { name: 'Advanced Filters' }).getByRole('combobox').nth(2)
      }
    ],
    allStatusesSelected: [
      { type: 'text', value: 'All statuses selected', options: { exact: true }, name: 'all statuses selected' },
      {
        type: 'custom',
        name: 'payment status combobox',
        factory: (page) => page.getByRole('tabpanel', { name: 'Advanced Filters' }).getByRole('combobox').nth(4)
      }
    ],
    payByWebOption: [
      { type: 'text', value: 'Pay By Web', options: { exact: true }, name: 'pay by web option' }
    ],
    payByEmailOption: [
      { type: 'text', value: 'Pay By Email', options: { exact: true }, name: 'pay by email option' }
    ],
    payByPhoneOption: [
      { type: 'text', value: 'Pay By Phone', options: { exact: true }, name: 'pay by phone option' }
    ]
  }
};

module.exports = {
  mgmtPaymentsPending5daysSelectors
};
