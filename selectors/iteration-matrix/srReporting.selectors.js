const srReportingSelectors = {
  module: {
    heading: [
      'h1:has-text("Statement Recon")',
      'text=Statement Recon'
    ],
    reportingLink: [
      'nav[aria-label="StatementRecon Subroute Navigation"] a:has-text("Reporting")',
      'a:has-text("Reporting")'
    ]
  },
  common: {
    calendarDay: [
      'button[name="day"]:not([disabled])',
      '.rdp-day button:not([disabled])'
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
    statementsTab: [
      '[role="tab"]:has-text("Statements")',
      'button:has-text("Statements")'
    ],
    settingsTab: [
      '[role="tab"]:has-text("Settings")',
      'button:has-text("Settings")'
    ],
    exportStatementsButton: [
      'button:has-text("Export Statement Upload Counts")'
    ],
    exportSettingsHistoryButton: [
      'button:has-text("Export Settings Modifications History")',
      'button:has-text("Export Settings Modifications Histo")'
    ]
  },
  statements: {
    cards: {
      uploadsByUser: ['h3:has-text("Uploads by User")'],
      userStatusDetails: ['h3:has-text("User Status Details")'],
      overallStatusBreakdown: ['h3:has-text("Overall Status Breakdown")'],
      all: [
        'h3:has-text("Uploads by User")',
        'h3:has-text("User Status Details")',
        'h3:has-text("Overall Status Breakdown")'
      ]
    },
    userSlice: [
      'path.cursor-pointer',
      'svg [class*="cursor-pointer"]'
    ],
    clearSelectionButton: [
      'button:has-text("Clear Selection")'
    ],
    backToUserOverviewButton: [
      'button:has-text("Back to User Overview")',
      'button:has-text("Clear Selection")'
    ],
    filters: {
      userName: [
        'input[placeholder*="Filter uploaded by" i]',
        'input[placeholder*="uploaded by" i]'
      ],
      dateRange: [
        'button:has-text("Filter by date range")',
        '#date'
      ]
    },
    table: {
      uploadedByHeader: [
        'button[aria-label*="Uploaded By" i]',
        'span:has-text("Uploaded By")'
      ],
      uploadCountHeader: [
        'button[aria-label*="Upload Count" i]',
        'span:has-text("Upload Count")'
      ]
    },
    columnOrderButton: [
      'button:has-text("Column Order")',
      'button[aria-label*="Column settings" i]'
    ],
    columnToggle: [
      'button[role="switch"]',
      '[data-state] button[value="on"]',
      'button[aria-pressed]',
      '[role="dialog"] button[aria-label*="Hide" i]',
      '[role="dialog"] button[value="on"]'
    ],
    pagination: {
      trigger: [
        'button[role="combobox"]:has-text("10")',
        '[role="combobox"]:has-text("10")'
      ],
      options: {
        twentyFive: [
          'text=/^25$/',
          '[role="option"]:has-text("25")'
        ],
        fifty: [
          'text=/^50$/',
          '[role="option"]:has-text("50")'
        ],
        hundred: [
          'text=/^100$/',
          '[role="option"]:has-text("100")'
        ]
      }
    }
  },
  settings: {
    cards: {
      modificationsByActionType: ['h3:has-text("Modifications by Action Type")'],
      settingNameModifications: ['h3:has-text("Setting Name Modifications")'],
      modificationsByUser: ['h3:has-text("Modifications by User")'],
      all: [
        'h3:has-text("Modifications by Action Type")',
        'h3:has-text("Setting Name Modifications")',
        'h3:has-text("Modifications by User")'
      ]
    },
    filters: {
      modifiedBy: [
        'input[placeholder*="Filter Modified By" i]'
      ],
      dateRange: [
        'button:has-text("Filter by date range")',
        '#date'
      ]
    },
    clearFiltersButton: [
      'button:has-text("Reset filters")',
      'button:has-text("Reset Filters")'
    ],
    table: {
      allHeaders: [
        'span:has-text("Date Modified")',
        'span:has-text("Action")',
        'span:has-text("Setting Name")',
        'span:has-text("Old Value")',
        'span:has-text("New Value")',
        'span:has-text("Old L/T Type")',
        'span:has-text("New L/T Type")',
        'span:has-text("Old Email Config")',
        'span:has-text("New Email Config")',
        'span:has-text("Modified By")',
        'span:has-text("Customer Name")',
        'span:has-text("Supplier Name")'
      ]
    }
  },
  modal: {
    heading: [
      'h2:has-text("Export Statements Report")',
      'text=Export Statements Report',
      'h2:has-text("Export Settings Modifications History Report")',
      'text=Export Settings Modifications History Report'
    ],
    tabs: {
      columns: ['button:has-text("Select Columns")', 'button:has-text("Columns")'],
      options: ['button:has-text("File Options")', 'button:has-text("Options")'],
      delivery: ['button:has-text("Delivery Method")', 'button:has-text("Delivery")']
    },
    downloadReportButton: [
      'button:has-text("Download Report")',
      'button:has-text("Download Export")'
    ],
    sendEmailReportButton: [
      'button:has-text("Send Email with Report")',
      'button:has-text("Send Email with Export")'
    ],
    emailMethod: [
      'label:has-text("Email")',
      'text=Email'
    ],
    emailInput: [
      'input[placeholder*="Type email" i]',
      'input[type="email"]'
    ],
    addEmailButton: [
      'button:has(svg.lucide-plus)',
      'text=Add Email'
    ]
  },
  notifications: {
    success: [
      'text=Success!',
      'text=exported successfully',
      'text=has been exported successfully'
    ]
  }
};

module.exports = {
  srReportingSelectors
};
