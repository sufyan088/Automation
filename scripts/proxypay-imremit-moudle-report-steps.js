const fs = require('fs');
const path = require('path');

const scenarioDescriptionMap = [
  {
    pattern: /^TS_62_/i,
    objective: 'Verify each visible payment row on the Proxy Pay Dashboard displays Updated Date values using the MM/DD/YYYY format.',
    steps: [
      'Open the Proxy Pay Dashboard for the selected imREmit customer.',
      'Review the visible payment rows in the dashboard grid.',
      'Confirm each Updated Date value matches the expected MM/DD/YYYY format.'
    ]
  },
  {
    pattern: /^TS_63_/i,
    objective: 'Verify the Proxy Pay Dashboard data table includes a visible Updated Date column for payment rows.',
    steps: [
      'Open the Proxy Pay Dashboard for the selected imREmit customer.',
      'Display the payment results grid.',
      'Confirm the Updated Date column header is visible in the table.'
    ]
  },
  {
    pattern: /^TS_64_/i,
    objective: 'Verify the Updated Date column supports ascending sort from the column header action menu.',
    steps: [
      'Open the Proxy Pay Dashboard for the selected imREmit customer.',
      'Open the Updated Date column action menu and apply Ascending.',
      'Verify the visible Updated Date values are ordered from oldest to newest.'
    ]
  },
  {
    pattern: /^TS_65_/i,
    objective: 'Verify the Updated Date column supports descending sort from the column header action menu.',
    steps: [
      'Open the Proxy Pay Dashboard for the selected imREmit customer.',
      'Open the Updated Date column action menu and apply Descending.',
      'Verify the visible Updated Date values are ordered from newest to oldest.'
    ]
  },
  {
    pattern: /^TS_66_/i,
    objective: 'Verify the Updated Date column can be hidden from the Proxy Pay Dashboard grid using the column header action menu.',
    steps: [
      'Open the Proxy Pay Dashboard for the selected imREmit customer.',
      'Open the Updated Date column action menu and choose Hide column.',
      'Confirm the Updated Date header is no longer visible in the grid.'
    ]
  },
  {
    pattern: /^TS_67_/i,
    objective: 'Verify Updated Date is available as a selectable entry in the Proxy Pay Dashboard column visibility menu.',
    steps: [
      'Open the Proxy Pay Dashboard for the selected imREmit customer.',
      'Open the column visibility control for the payment grid.',
      'Confirm Updated Date appears in the available column list.'
    ]
  },
  {
    pattern: /^TS_68_/i,
    objective: 'Verify Updated Date is enabled by default in the Proxy Pay Dashboard column visibility menu.',
    steps: [
      'Open the Proxy Pay Dashboard for the selected imREmit customer.',
      'Open the column visibility control for the payment grid.',
      'Confirm Updated Date is shown as checked by default.'
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
    console.log(`Enriched ProxyPay_imREmit_Moudle business descriptions in ${updatedCount} Allure result files.`);
  }
}

module.exports = {
  enrichProxypayImremitMoudleReport,
};