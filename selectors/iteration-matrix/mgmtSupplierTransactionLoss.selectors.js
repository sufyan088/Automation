const mgmtSupplierTransactionLossSelectors = {
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
    supplierTransactionLossTab: [
      'button:has-text("Supplier Transaction Loss")',
      '[role="tab"]:has-text("Supplier Transaction Loss")'
    ],
    supplierTransactionLossHeading: [
      'h2:has-text("Supplier Transaction Loss")',
      'text="Supplier Transaction Loss"'
    ],
    graphHeading: [
      '#transaction-loss-graph-container h3:has-text("Supplier Transaction Loss Chart")',
      'h3:has-text("Supplier Transaction Loss Chart")'
    ],
    tableHeading: [
      '#transaction-loss-table-container h3:has-text("Supplier Transaction Loss Table")',
      'h3:has-text("Supplier Transaction Loss Table")',
      '#transaction-loss-table-container span:has-text("PID")',
      'span:has-text("PID")'
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
    searchAllEntriesInput: [
      '#transaction-loss-table-container input[placeholder="Search all entries..."]',
      'input[placeholder="Search all entries..."]',
      'input[placeholder*="Search all entries"]'
    ],
    paginationButton: {
      next: [
        'button[aria-label*="next" i]',
        'span:has-text("Go to next page")',
        'button:has-text("Next")'
      ],
      previous: [
        'button[aria-label*="previous" i]',
        'span:has-text("Go to previous page")',
        'button:has-text("Previous")'
      ],
      first: [
        'button[aria-label*="first" i]',
        'span:has-text("Go to first page")',
        'button:has-text("First")'
      ],
      last: [
        'button[aria-label*="last" i]',
        'span:has-text("Go to last page")',
        'button:has-text("Last")'
      ]
    },
    pageSummary: [
      '#transaction-loss-table-container p:has-text("Page:")',
      'p:has-text("Page:")'
    ],
    resultCell: (name) => [
      `#transaction-loss-table-container td:has-text("${name}")`,
      `#transaction-loss-table-container div:has-text("${name}")`,
      `td:has-text("${name}")`,
      `div:has-text("${name}")`
    ]
  }
};

module.exports = {
  mgmtSupplierTransactionLossSelectors
};
