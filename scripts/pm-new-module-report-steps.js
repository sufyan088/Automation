const fs = require('fs');
const path = require('path');

const scenarioDescriptionMap = [
  {
    pattern: /^TS_87_/i,
    objective: 'Verify the Payment Management grid includes a visible Updated Date column for payment rows.',
    steps: [
      'Open Payment Management for a selected customer.',
      'Display the payment results grid.',
      'Confirm the Updated Date column header is visible in the table.'
    ]
  },
  {
    pattern: /^TS_88_/i,
    objective: 'Verify the Updated Date column supports descending sort from the column header action menu in Payment Management.',
    steps: [
      'Open Payment Management for a selected customer.',
      'Open the Updated Date column action menu and apply Descending.',
      'Verify the visible Updated Date values are ordered from newest to oldest.'
    ]
  },
  {
    pattern: /^TS_89_/i,
    objective: 'Verify the Updated Date column can be hidden from the Payment Management grid using the column header action menu.',
    steps: [
      'Open Payment Management for a selected customer.',
      'Open the Updated Date column action menu and choose Hide column.',
      'Confirm the Updated Date header is no longer visible in the grid.'
    ]
  },
  {
    pattern: /^TS_90_/i,
    objective: 'Verify Updated Date is available as a selectable entry in the Payment Management column visibility menu.',
    steps: [
      'Open Payment Management for a selected customer.',
      'Open the column visibility control for the payment grid.',
      'Confirm Updated Date appears in the available column list.'
    ]
  },
  {
    pattern: /^TS_91_/i,
    objective: 'Verify Updated Date is enabled by default in the Payment Management column visibility menu.',
    steps: [
      'Open Payment Management for a selected customer.',
      'Open the column visibility control for the payment grid.',
      'Confirm Updated Date is shown as checked by default.'
    ]
  },
  {
    pattern: /^TS_92_/i,
    objective: 'Verify each visible payment row in Payment Management displays Updated Date values using the MM/DD/YYYY format.',
    steps: [
      'Open Payment Management for a selected customer.',
      'Review the visible payment rows in the payment grid.',
      'Confirm each Updated Date value matches the expected MM/DD/YYYY format.'
    ]
  },
  {
    pattern: /^TS_93_/i,
    objective: 'Verify the Updated Date column supports ascending sort from the column header action menu in Payment Management.',
    steps: [
      'Open Payment Management for a selected customer.',
      'Open the Updated Date column action menu and apply Ascending.',
      'Verify the visible Updated Date values are ordered from oldest to newest.'
    ]
  },
  {
    pattern: /^TS_94_/i,
    objective: 'Verify the Search Supplier dropdown only lists suppliers related to the currently selected customers in Payment Management.',
    steps: [
      'Open Payment Management with the required customer selection applied.',
      'Search within the supplier dropdown for a supplier tied to the selected customers.',
      'Confirm the supplier results only include suppliers relevant to that customer selection.'
    ]
  },
  {
    pattern: /^TS_95_/i,
    objective: 'Verify a Supplier Admin can filter Payment Management to fully paid payments with the expected closed and delivered statuses.',
    steps: [
      'Open Payment Management as a Supplier Admin user.',
      'Apply the fully paid status filters for Closed and Delivered payment outcomes.',
      'Confirm the visible payment rows reflect the requested statuses.'
    ]
  },
  {
    pattern: /^TS_96_/i,
    objective: 'Verify removing a customer from the current Payment Management selection immediately refreshes the table and removes that customer context.',
    steps: [
      'Open Payment Management with multiple customers selected.',
      'Remove one customer from the active customer selection.',
      'Confirm the removed customer is no longer selected and the payment table refreshes accordingly.'
    ]
  },
  {
    pattern: /^TS_97_/i,
    objective: 'Verify users can select multiple customers from the Payment Management customer selector and keep them applied.',
    steps: [
      'Open Payment Management.',
      'Select multiple customers from the customer selector.',
      'Confirm both selected customers remain visible in the active selection.'
    ]
  },
  {
    pattern: /^TS_98_/i,
    objective: 'Verify the Invoices tab in Payment Details exposes the Confirmation Number field after locating a successful payment record.',
    steps: [
      'Open Payment Management and locate the target payment record.',
      'Open Payment Details for the payment and navigate to the Invoices tab.',
      'Confirm the Confirmation Number column is visible for the invoice data.'
    ]
  },
  {
    pattern: /^TS_99_/i,
    objective: 'Verify comments added from Payment Details display a Date/Time field in the comments history.',
    steps: [
      'Open Payment Management and drill into Payment Details for a payment row.',
      'Add a new comment from the comments area.',
      'Confirm the comments history shows the Date/Time column for the added entry.'
    ]
  }
];

function extractSpecFile(description) {
  const lines = String(description || '').split(/\r?\n/);
  const specLine = lines.find((line) => /^Spec File:/i.test(line));
  return specLine || null;
}

function humanizeScenarioName(testName) {
  return String(testName || '')
    .replace(/\.spec\.js$/i, '')
    .replace(/^TS_(\d+)_/i, 'TS $1 - ')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildDescription(result, scenario) {
  const descriptionLines = [
    `Scenario: ${humanizeScenarioName(result.name)}`,
    `Business Objective: ${scenario.objective}`,
    'Business Flow:',
    ...scenario.steps.map((step, index) => `${index + 1}. ${step}`)
  ];
  const specLine = extractSpecFile(result.description);

  if (specLine) {
    descriptionLines.push(specLine);
  }

  return descriptionLines.join('\n');
}

function enrichPmNewModuleReport({ resultsDir }) {
  let updatedCount = 0;

  for (const entry of fs.readdirSync(resultsDir)) {
    if (!entry.endsWith('-result.json')) {
      continue;
    }

    const filePath = path.join(resultsDir, entry);
    const result = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const scenario = scenarioDescriptionMap.find(({ pattern }) => pattern.test(result.name || ''));

    if (!scenario) {
      continue;
    }

    result.description = buildDescription(result, scenario);
    fs.writeFileSync(filePath, JSON.stringify(result), 'utf8');
    updatedCount += 1;
  }

  if (updatedCount > 0) {
    console.log(`Enriched PM_New_Module business descriptions in ${updatedCount} Allure result files.`);
  }
}

module.exports = {
  enrichPmNewModuleReport,
};