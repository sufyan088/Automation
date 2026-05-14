const mgmtPercentageGrowthSelectors = {
  admin: {
    heading: [
      'h1:has-text("Admin")',
      'main h1:has-text("Admin")'
    ],
    moduleEntry: [
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
      'text="MIS Payments Received"'
    ],
    percentageGrowthTab: [
      'button:has-text("Percentage Growth")',
      '[role="tab"]:has-text("Percentage Growth")'
    ],
    percentageGrowthHeading: [
      'h2:has-text("MIS Percentage Growth")',
      'text="MIS Percentage Growth"'
    ],
    graphHeading: [
      '#graph-container h3:has-text("Percentage Growth Graph")',
      'h3:has-text("Percentage Growth Graph")'
    ],
    tableHeading: [
      '#table-container h3:has-text("Percentage Growth Table")',
      'h3:has-text("Percentage Growth Table")'
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
    returnToTopButton: [
      'button:has-text("Return to top")',
      'button:has-text("Return To Top")',
      'text="Return to top"'
    ],
    downloadReportButton: [
      'button:has-text("Download Report")'
    ],
    downloadGraphButton: [
      'button:has-text("Download Chart")',
      'button:has-text("DownloadGraph")',
      'button:has-text("Download Graph")',
      '[role="menuitem"]:has-text("Download Graph")'
    ],
    downloadImageButton: [
      'button:has-text("Download Chart")',
      'button:has-text("DownloadImage")',
      'button:has-text("Download Image")',
      '[role="menuitem"]:has-text("Download Image")'
    ],
    downloadBothButton: [
      'button:has-text("DownloadBoth")',
      'button:has-text("Download Both")',
      '[role="menuitem"]:has-text("Download Both")'
    ],
    showTrendlinesCheckbox: [
      'label:has-text("Show Trendline")',
      'label:has-text("Show Trendlines")',
      'input[type="checkbox"][name*="trend"]'
    ],
    showDifferencesCheckbox: [
      'label:has-text("Show Differences")',
      'input[type="checkbox"][name*="difference"]'
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
      'button:has-text("Column settings")',
      'button:has-text("Column View")',
      'button:has-text("Column Views")',
      'button:has-text("Columns")'
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
      `#table-container th:has-text("${name}")`,
      `th:has-text("${name}")`,
      `button:has-text("${name}")`
    ],
    tableCell: (name) => [
      `#table-container td:has-text("${name}")`,
      `td:has-text("${name}")`
    ],
    sortOption: (name) => [
      `[role="menuitem"]:has-text("${name}")`,
      `[role="option"]:has-text("${name}")`,
      `text="${name}"`
    ]
  },
  filters: {
    heading: [
      'h3:has-text("MIS Filter Settings")',
      'text="MIS Filter Settings"'
    ],
    customersLabel: [
      'label:has-text("Customers:*")',
      'label:has-text("Customers")'
    ],
    customerTrigger: [
      'button:has-text("All customers selected")',
      'button:has-text("All customers")',
      'button[role="combobox"]'
    ],
    customerTriggerValue: [
      'div:has-text("All customers selected")',
      'span:has-text("All customers selected")'
    ],
    customerSearchInput: [
      'input[placeholder*="Search customers (min 3 characters)"]',
      'input[placeholder*="Search customers"]'
    ],
    customerOption: (name) => [
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
      'button:has-text("Reset")'
    ]
  }
};

module.exports = {
  mgmtPercentageGrowthSelectors
};
