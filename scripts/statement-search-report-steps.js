const fs = require('fs');
const path = require('path');

const scenarioDescriptionMap = [
  {
    pattern: /^TS_01_/i,
    objective: 'Confirm the Statement Search workspace opens and displays the reconciliation results grid for the selected customer.',
    steps: [
      'Open the Statement Recon workspace for the active customer.',
      'Navigate to the Search tab.',
      'Verify the Statement Search grid and search input are visible.'
    ]
  },
  {
    pattern: /^TS_02_/i,
    objective: 'Verify the last-page pagination control responds on the Statement Search results grid.',
    steps: [
      'Open the Statement Search workspace.',
      'Use the last-page pagination control.',
      'Confirm the grid accepts the page navigation action.'
    ]
  },
  {
    pattern: /^TS_03_/i,
    objective: 'Verify the previous-page pagination control returns the results grid to an earlier page.',
    steps: [
      'Open the Statement Search workspace.',
      'Advance the results grid to a later page.',
      'Use the previous-page control to navigate back.'
    ]
  },
  {
    pattern: /^TS_04_/i,
    objective: 'Verify the first-page pagination control returns the results grid to the beginning of the result set.',
    steps: [
      'Open the Statement Search workspace.',
      'Move away from the first page.',
      'Use the first-page control to return to the start of the grid.'
    ]
  },
  {
    pattern: /^TS_05_/i,
    objective: 'Verify the next-page pagination control advances the Statement Search results grid.',
    steps: [
      'Open the Statement Search workspace.',
      'Use the next-page control.',
      'Confirm the grid responds to forward pagination.'
    ]
  },
  {
    pattern: /^TS_06_/i,
    objective: 'Verify the Column Views control can open column settings and toggle grid visibility options.',
    steps: [
      'Open the Statement Search workspace.',
      'Open the Column Order panel.',
      'Toggle a column visibility option and close the panel.'
    ]
  },
  {
    pattern: /^TS_07_/i,
    objective: 'Verify the Return to Top utility returns the page viewport to the top of the Statement Search screen.',
    steps: [
      'Open the Statement Search workspace.',
      'Scroll to the bottom of the page.',
      'Use Return to Top and confirm the viewport resets to the top.'
    ]
  },
  {
    pattern: /^TS_08_/i,
    objective: 'Verify ascending sort actions are available from the Statement Search grid headers.',
    steps: [
      'Open the Statement Search workspace.',
      'Open multiple header menus.',
      'Apply ascending sort actions from the available column controls.'
    ]
  },
  {
    pattern: /^TS_09_/i,
    objective: 'Verify descending sort actions are available from the Statement Search grid headers.',
    steps: [
      'Open the Statement Search workspace.',
      'Open multiple header menus.',
      'Apply descending sort actions from the available column controls.'
    ]
  },
  {
    pattern: /^TS_10_/i,
    objective: 'Verify a visible Statement Search grid column can be hidden from the header action menu.',
    steps: [
      'Open the Statement Search workspace.',
      'Open a column header action menu.',
      'Use Hide and verify the visible column count decreases.'
    ]
  },
  {
    pattern: /^TS_11_/i,
    objective: 'Verify the pagination size control exposes the supported page-size options and applies the selected values.',
    steps: [
      'Open the Statement Search workspace.',
      'Open the pagination size selector.',
      'Review the supported sizes and switch between multiple page-size values.'
    ]
  },
  {
    pattern: /^TS_12_/i,
    objective: 'Verify the Search all entries field filters the Statement Search grid using a known reconciliation value.',
    steps: [
      'Open the Statement Search workspace.',
      'Enter a known search value into Search all entries.',
      'Confirm the results grid contains the requested value.'
    ]
  },
  {
    pattern: /^TS_13_/i,
    objective: 'Verify the row action menu can open the Mapping Summary view from an actionable reconciliation result.',
    steps: [
      'Open the Statement Search workspace.',
      'Switch to a results tab that contains actionable rows.',
      'Open a row action menu and choose View Mapping Details.'
    ]
  },
  {
    pattern: /^TS_14_/i,
    objective: 'Verify the row action menu can open the reconciliation results view from an actionable reconciliation result.',
    steps: [
      'Open the Statement Search workspace.',
      'Switch to a results tab that contains actionable rows.',
      'Open a row action menu and choose View Statement Details.'
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

function enrichStatementSearchReport({ resultsDir }) {
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
    console.log(`Enriched Statement_Search business descriptions in ${updatedCount} Allure result files.`);
  }
}

module.exports = {
  enrichStatementSearchReport,
};