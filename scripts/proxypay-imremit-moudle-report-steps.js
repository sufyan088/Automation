const fs = require('fs');
const path = require('path');

const scenarioDescriptionMap = [
  {
    pattern: /^TS_48_/i,
    objective: 'Verify the Proxy Pay Dashboard includes a visible Invoice Count column for the selected customer.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Display the payment results grid.',
      'Confirm the Invoice Count column is visible.'
    ]
  },
  {
    pattern: /^TS_49_/i,
    objective: 'Verify the Invoice Count column supports ascending sort from the column header action menu.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Apply Ascending on the Invoice Count column.',
      'Verify the visible Invoice Count values are ordered from lowest to highest.'
    ]
  },
  {
    pattern: /^TS_50_/i,
    objective: 'Verify the Invoice Count column supports descending sort from the column header action menu.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Apply Descending on the Invoice Count column.',
      'Verify the visible Invoice Count values are ordered from highest to lowest.'
    ]
  },
  {
    pattern: /^TS_51_/i,
    objective: 'Verify the Invoice Count column can be hidden from the Proxy Pay Dashboard grid.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Open the Invoice Count column menu and choose Hide column.',
      'Confirm the Invoice Count header is no longer visible.'
    ]
  },
  {
    pattern: /^TS_52_/i,
    objective: 'Verify Invoice Count is available in the Proxy Pay Dashboard column visibility menu.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Open the column visibility menu.',
      'Confirm Invoice Count appears in the available column list.'
    ]
  },
  {
    pattern: /^TS_53_/i,
    objective: 'Verify Invoice Count is checked by default in the Proxy Pay Dashboard column visibility menu.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Open the column visibility menu.',
      'Confirm Invoice Count is enabled by default.'
    ]
  },
  {
    pattern: /^TS_54_/i,
    objective: 'Verify the Proxy Pay Dashboard row actions expose payment details behavior consistent with Payment Management.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Open the row actions menu for a payment entry.',
      'Confirm View Payment Details is available.'
    ]
  },
  {
    pattern: /^TS_55_/i,
    objective: 'Verify the Add Invoice Numbers field is functional under Advanced Search in Proxy Pay Dashboard.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Open Advanced Search.',
      'Confirm the Add Invoice Numbers field accepts input.'
    ]
  },
  {
    pattern: /^TS_56_/i,
    objective: 'Verify the Invoice Number field accepts a single invoice number as input.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Search for a single invoice number from Advanced Search.',
      'Open payment details and confirm the selected invoice number is visible.'
    ]
  },
  {
    pattern: /^TS_57_/i,
    objective: 'Verify the Invoice Number field accepts multiple invoice numbers and returns matching payment rows.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Enter multiple invoice numbers in Advanced Search.',
      'Confirm the matching invoice results are displayed.'
    ]
  },
  {
    pattern: /^TS_58_/i,
    objective: 'Verify the Invoice Number field accepts multiple comma-separated invoice numbers and returns matching payment rows.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Enter comma-separated invoice numbers in Advanced Search.',
      'Confirm the matching invoice results are displayed.'
    ]
  },
  {
    pattern: /^TS_59_/i,
    objective: 'Verify the Add Invoice Numbers field behaves the same in Proxy Pay Dashboard and Payment Management.',
    steps: [
      'Search for an invoice number in Proxy Pay Dashboard Advanced Search.',
      'Open Payment Management and search for the same invoice number.',
      'Confirm the invoice result is returned in both modules.'
    ]
  },
  {
    pattern: /^TS_60_/i,
    objective: 'Verify invalid or non-existent invoice numbers return no results in Proxy Pay Dashboard.',
    steps: [
      'Open the Proxy Pay Dashboard for a selected imREmit customer.',
      'Search for an invalid invoice number from Advanced Search.',
      'Confirm the results grid shows no results.'
    ]
  },
  {
    pattern: /^TS_61_/i,
    objective: 'Verify users can select multiple customers from the Proxy Pay Dashboard customer selector.',
    steps: [
      'Open the Proxy Pay Dashboard.',
      'Select multiple customers from the customer selector.',
      'Confirm both selected customers remain visible.'
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

function enrichProxypayImremitMoudleReport({ resultsDir }) {
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
    console.log(`Enriched Proxy_Pay_imREmit_New business descriptions in ${updatedCount} Allure result files.`);
  }
}

module.exports = {
  enrichProxypayImremitMoudleReport,
};