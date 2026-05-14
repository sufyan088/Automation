const mgmtPaymentsPostedSelectors = {
  admin: {
    heading: [
      'h1:has-text("Admin")',
      'main h1:has-text("Admin")'
    ],
    moduleEntry: [
      'a[href="/app/admin/mis"]',
      'a[href="/app/admin"]',
      'a:has-text("Admin")',
      '[role="link"]:has-text("Admin")',
      'button:has-text("Admin")'
    ],
    misLink: [
      'a[href="/app/admin/mis"]',
      'a:has-text("MGMT Information System")',
      '[role="link"]:has-text("MGMT Information System")'
    ]
  },
  mis: {
    landingHeading: [
      'h2:has-text("MIS Payments Received")',
      'h2:has-text("MIS Payments Posted")',
      'text="MIS Payments Received"'
    ],
    paymentsPostedTab: [
      'button:has-text("Payments Posted")',
      '[role="tab"]:has-text("Payments Posted")'
    ],
    graphHeading: [
      '#graph-container h3:has-text("Payments Posted Graph")',
      'h3:has-text("Payments Posted Graph")'
    ],
    tableHeading: [
      '#table-container h3:has-text("Payments Posted Table")',
      'h3:has-text("Payments Posted Table")'
    ],
    adjustFiltersButton: [
      'button:has-text("Adjust Filters")',
      'button:has-text("Hide Filters")'
    ],
    showTableButton: [
      'button:has-text("Show Table")',
      'button:has-text("Open Table")'
    ],
    hideTableButton: [
      'button:has-text("Hide Table")',
      'button:has-text("Close Table")'
    ],
    showChartButton: [
      'button:has-text("Show Chart")',
      'button:has-text("Open Chart")'
    ],
    hideChartButton: [
      'button:has-text("Hide Chart")',
      'button:has-text("Close Chart")'
    ],
    chartContent: [
      '#graph-container img',
      '#graph-container svg',
      'img[alt*="chart" i]',
      'img[alt*="graph" i]',
      'tabpanel[aria-label="Payments Posted"] img'
    ],
    returnToTopButton: [
      'button:has-text("Return to top")',
      'button:has-text("Return To Top")',
      'span:has-text("Return to top")'
    ],
    downloadReportButton: [
      'button:has-text("Download Report")'
    ],
    downloadGraphButton: [
      'button:has-text("Download Chart")',
      'button:has-text("Download Graph")',
      'button:has-text("DownloadGraph")',
      '[role="menuitem"]:has-text("Download Graph")',
      '[role="menuitem"]:has-text("Download Chart")'
    ],
    downloadImageButton: [
      'button:has-text("Download Image")',
      'button:has-text("DownloadImage")',
      '[role="menuitem"]:has-text("Download Image")'
    ],
    downloadBothButton: [
      'button:has-text("Download Both")',
      'button:has-text("DownloadBoth")',
      '[role="menuitem"]:has-text("Download Both")',
      '[role="menuitem"]:has-text("DownloadBoth")'
    ],
    showTrendlineCheckbox: [
      'label:has-text("Show Trendline")',
      'input[type="checkbox"][name*="trend"]'
    ],
    searchAllEntriesInput: [
      '#table-container input[placeholder="Search all entries..."]',
      'input[placeholder="Search all entries..."]',
      'input[placeholder*="Search all entries"]'
    ],
    paginationTrigger: [
      '#table-container button[role="combobox"]',
      '#table-container button:has(svg.lucide-chevron-down)',
      '#table-container button:has(svg.lucide-chevrons-up-down)'
    ],
    pageSizeOption: (size) => [
      `[role="option"]:has-text("${size}")`,
      `div[role="option"]:has-text("${size}")`,
      `text="${size}"`
    ],
    columnViewTrigger: [
      'button:has-text("Column Order")',
      'button[aria-label="Column settings"]',
      'button:has-text("Column View")',
      'button:has-text("Column Views")'
    ],
    paginationButton: {
      next: [
        'button[aria-label*="next" i]',
        'button:has-text("Next")'
      ],
      previous: [
        'button[aria-label*="previous" i]',
        'button:has-text("Previous")'
      ],
      first: [
        'button[aria-label*="first" i]',
        'button:has-text("First")'
      ],
      last: [
        'button[aria-label*="last" i]',
        'button:has-text("Last")'
      ]
    },
    pageSummary: [
      '#table-container p:has-text("Page:")',
      'p:has-text("Page:")'
    ],
    tableHeader: (name) => [
      `#table-container button span:has-text("${name}")`,
      `#table-container th:has-text("${name}")`,
      `th:has-text("${name}")`,
      `button:has-text("${name}")`
    ],
    sortOption: (name) => [
      `[role="menuitem"]:has-text("${name}")`,
      `[role="option"]:has-text("${name}")`,
      `span:has-text("${name}")`,
      `text="${name}"`
    ],
    hideColumnOption: [
      '[role="menuitem"]:has-text("Hide column")',
      'span:has-text("Hide column")'
    ],
    columnSettingOption: [
      'button[aria-label*="Hide" i]',
      '[role="menuitemcheckbox"]'
    ],
    tableBodyRows: [
      '#table-container tbody tr',
      'tbody tr'
    ]
  },
  filters: {
    heading: [
      'h3:has-text("MIS Filter Settings")',
      'text="MIS Filter Settings"'
    ],
    basicTab: [
      'button:has-text("Basic Filters")'
    ],
    advancedTab: [
      'button:has-text("Advanced Filters")'
    ],
    yearLabel: [
      'label:has-text("Year:")'
    ],
    moduleLabel: [
      'label:has-text("Module:")'
    ],
    customersLabel: [
      'label:has-text("Customers:*")',
      'label:has-text("Customers")'
    ],
    monthLabel: [
      'label:has-text("Month:")'
    ],
    quarterLabel: [
      'label:has-text("Quarter:")'
    ],
    yearTrigger: [
      'button:has-text("current")',
      'button:has-text("previous")',
      'label:has-text("Year:") + button',
      'button[role="combobox"]'
    ],
    moduleTrigger: [
      'button:has-text("All modules selected")',
      'label:has-text("Module:") + button'
    ],
    customerTrigger: [
      '[role="combobox"]:has-text("All modules customers selected")',
      '[role="combobox"]:has-text("All imREmit customers selected")',
      '[role="combobox"]:has-text("All imREmit lite customers selected")',
      'div:has-text("All modules customers selected")',
      'div:has-text("All imREmit customers selected")',
      'div:has-text("All imREmit lite customers selected")',
      'button:has-text("All modules customers selected")',
      'button:has-text("All imREmit customers selected")',
      'button:has-text("All imREmit lite customers selected")'
    ],
    customerSearchInput: [
      'input[placeholder*="Search customers"]',
      'input[placeholder*="min 3 characters"]'
    ],
    monthTrigger: [
      '[role="combobox"]:has-text("All months selected")',
      '[role="combobox"]:has-text("Select months from")',
      'div:has-text("All months selected")',
      'div:has-text("Select months from")',
      'button:has-text("All months selected")',
      'label:has-text("Month:") + button'
    ],
    quarterTrigger: [
      '[role="combobox"]:has-text("All quarters selected")',
      'div:has-text("All quarters selected")',
      'button:has-text("All quarters selected")',
      'label:has-text("Quarter:") + button'
    ],
    option: (name) => [
      `[role="option"]:has(span:has-text("${name}"))`,
      `[role="option"]:has-text("${name}")`,
      `div[role="option"]:has-text("${name}")`,
      `span:has-text("${name}")`,
      `div:has-text("${name}")`
    ],
    customerOptions: [
      '[role="option"]',
      'div[role="option"]'
    ],
    resetButton: [
      'button:has-text("Reset")',
      'button:has-text("Reset Filters")'
    ],
    clearAllButton: [
      '[aria-label*="Clear all selections"]',
      '[role="combobox"] span:has-text("Clear All")',
      'span:has-text("Clear All")'
    ]
  }
};

module.exports = {
  mgmtPaymentsPostedSelectors
};
