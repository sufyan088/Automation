const fs = require('fs');
const path = require('path');

const scenarioDescriptionMap = [
  {
    pattern: /^TS_01_/i,
    objective: 'Confirm the Statement Recon upload workspace opens and displays the Recon Configuration screen.',
    steps: [
      'Open the Statement Recon module.',
      'Land on the Recon Configuration screen.',
      'Verify the Statement Recon heading is visible.'
    ]
  },
  {
    pattern: /^TS_02_/i,
    objective: 'Verify the Select Customer control allows a Statement Recon customer to be chosen on the upload workspace.',
    steps: [
      'Open the Statement Recon module.',
      'Open the Select Customer control.',
      'Choose the configured customer and verify it remains selected.'
    ]
  },
  {
    pattern: /^TS_03_/i,
    objective: 'Verify the supplier search control allows the target supplier to be applied for the selected customer.',
    steps: [
      'Open the Statement Recon workspace for the selected customer.',
      'Open the supplier search control.',
      'Search for the target supplier and verify the selection is applied.'
    ]
  },
  {
    pattern: /^TS_04_/i,
    objective: 'Verify uploading a statement file advances the workflow into the Statement Mapping form.',
    steps: [
      'Open the Statement Recon workspace and select the supplier.',
      'Upload a statement file from the upload form.',
      'Verify the Statement Mapping screen is displayed.'
    ]
  },
  {
    pattern: /^TS_05_/i,
    objective: 'Verify the plus icon opens the Create New Supplier Group flow from Recon Configuration.',
    steps: [
      'Open the Statement Recon workspace for the selected supplier.',
      'Use the plus icon from Recon Configuration.',
      'Verify the Create New Supplier Group dialog is displayed.'
    ]
  },
  {
    pattern: /^TS_06_/i,
    objective: 'Verify a new supplier grouping can be created from the Create Supplier Group popup.',
    steps: [
      'Open the Statement Recon workspace for the selected supplier.',
      'Open the Create New Supplier Group dialog.',
      'Enter a new group name and save the supplier grouping successfully.'
    ]
  },
  {
    pattern: /^TS_07_/i,
    objective: 'Verify the uploaded statement exposes the expected mapping rows on the Statement Mapping form.',
    steps: [
      'Open the Statement Recon workspace and upload a statement file.',
      'Advance to the Statement Mapping screen.',
      'Verify the expected invoice and PO mapping rows are visible.'
    ]
  },
  {
    pattern: /^TS_08_/i,
    objective: 'Verify a new statement mapping can be configured and saved from the Statement Mapping form.',
    steps: [
      'Open the Statement Mapping screen for an uploaded statement.',
      'Configure the mapping name, date format, and vendor field assignments.',
      'Save the mapping and verify the workflow advances successfully.'
    ]
  },
  {
    pattern: /^TS_09_/i,
    objective: 'Verify the Use Existing Mapping action is available from the Statement Mapping workflow.',
    steps: [
      'Open the Statement Mapping screen for an uploaded statement.',
      'Locate the Use Existing Mapping action.',
      'Verify the existing-mapping flow can be opened from the mapping page.'
    ]
  },
  {
    pattern: /^TS_10_/i,
    objective: 'Verify a saved mapping can be selected on the reconciliation form and that Reconcile Statement becomes available.',
    steps: [
      'Create and save a new mapping for the uploaded statement.',
      'Open the reconciliation form and select the saved mapping.',
      'Verify the Reconcile Statement action is visible on the reconciliation screen.'
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

function enrichStatementUploadReport({ resultsDir }) {
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
    console.log(`Enriched Statement_Upload business descriptions in ${updatedCount} Allure result files.`);
  }
}

module.exports = {
  enrichStatementUploadReport,
};