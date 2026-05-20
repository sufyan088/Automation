const srReportingNewSelectors = {
  module: {
    heading: [
      'h1:has-text("Statement Recon")',
      'text=Statement Recon'
    ],
    reportingLink: [
      'a:has-text("Reporting")',
      'text=Reporting'
    ]
  },
  reporting: {
    heading: [
      'text=Select Customer:*',
      'text=Please select customer',
      'nav[aria-label="StatementRecon Subroute Navigation"] a[aria-current="page"]:has-text("Reporting")',
      'nav[aria-label="StatementRecon Subroute Navigation"] a:has-text("Reporting")'
    ],
    customerTrigger: [
      'button[role="combobox"]:has-text("Select customer")',
      'button[role="combobox"]',
      'text=Select customer...'
    ],
    customerSearch: [
      'input[placeholder*="Search customers" i]',
      'input[placeholder*="min. 3 characters" i]'
    ],
    settingsTab: [
      'button:has-text("Settings")'
    ],
    statementsTab: [
      '[role="tab"]:has-text("Statements")',
      'button:has-text("Statements")'
    ],
    exportSettingsHistoryButton: [
      'button:has-text("Export Settings Modifications History")',
      'button:has-text("Export Settings Modifications Histo")'
    ],
    paginator: {
      last: [
        'button:has-text("Go to last page")',
        'text=Go to last page'
      ],
      first: [
        'button:has-text("Go to first page")',
        'text=Go to first page'
      ],
      next: [
        'button[aria-label*="next" i]',
        'button:has(svg.lucide-chevron-right)'
      ],
      previous: [
        'button[aria-label*="previous" i]',
        'button:has(svg.lucide-chevron-left)'
      ]
    }
  },
  modal: {
    heading: [
      'h2:has-text("Export Settings Modifications History Report")',
      'text=Export Settings Modifications History Report'
    ],
    tabs: {
      columns: ['button:has-text("Columns")'],
      options: ['button:has-text("Options")'],
      delivery: ['button:has-text("Delivery")']
    },
    selectAll: [
      'label:has-text("Select All")',
      'text=Select All'
    ],
    fileOptionsHeading: [
      'text=File Options'
    ],
    fileNameInput: [
      'input[placeholder*="file name" i]',
      'input[name*="fileName" i]',
      'input[value*="report" i]'
    ],
    downloadMethod: [
      'label:has-text("Download")',
      'text=Download'
    ],
    emailMethod: [
      'label:has-text("Email")',
      'text=Email'
    ],
    emailInput: [
      'input[placeholder*="Type email and press Enter" i]'
    ],
    addEmailButton: [
      'button:has(svg.lucide-plus)',
      'text=Add Email'
    ],
    downloadReportButton: [
      'button:has-text("Download Report")'
    ],
    closeButton: [
      'button[aria-label="Close"]',
      'button:has(svg.lucide-x)',
      'button:has-text("Close")'
    ]
  },
  table: {
    headers: {
      dateModified: [
        'button[aria-label*="Date Modified" i]'
      ],
      action: [
        'button[aria-label*="Action" i]'
      ],
      settingName: [
        'button[aria-label*="Setting Name" i]'
      ],
      modifiedBy: [
        'button[aria-label*="Modified By" i]'
      ]
    },
    columnOrderButton: [
      'button:has-text("Column Order")',
      'button[aria-label*="Column settings" i]'
    ]
  }
};

module.exports = {
  srReportingNewSelectors
};
