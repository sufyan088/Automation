const fs = require('fs');
const path = require('path');

const scenarioDescriptionMap = [
  {
    pattern: /^TS_51_/i,
    objective: 'Verify the canned message configuration surface is available for Statement Recon match statuses.',
    steps: [
      'Open Admin Customer Module Management for the target customer.',
      'Open Match Types & Canned Messages.',
      'Verify the match-status configuration cards are visible.'
    ]
  },
  {
    pattern: /^TS_52_/i,
    objective: 'Verify users can access the Statement Recon canned message configuration section.',
    steps: [
      'Open Admin Customer Module Management for the target customer.',
      'Launch Match Types & Canned Messages.',
      'Confirm the configuration page is displayed.'
    ]
  },
  {
    pattern: /^TS_53_/i,
    objective: 'Verify the canned message screen displays separate labeled cards for the available match statuses.',
    steps: [
      'Open Match Types & Canned Messages for the target customer.',
      'Review the visible configuration cards.',
      'Confirm the match-status cards are labeled and displayed.'
    ]
  },
  {
    pattern: /^TS_54_/i,
    objective: 'Verify the canned message editor text area is available and accepts user input.',
    steps: [
      'Open Match Types & Canned Messages.',
      'Select the primary message template card.',
      'Enter text into the message template editor.'
    ]
  },
  {
    pattern: /^TS_55_/i,
    objective: 'Verify users can edit the canned message text area content for a Statement Recon template.',
    steps: [
      'Open Match Types & Canned Messages.',
      'Focus the primary message template editor.',
      'Enter or revise the message template text.'
    ]
  },
  {
    pattern: /^TS_56_/i,
    objective: 'Verify the Save action persists a Statement Recon canned message update.',
    steps: [
      'Open Match Types & Canned Messages.',
      'Update the primary message template text.',
      'Save and confirm the edited value persists.'
    ]
  },
  {
    pattern: /^TS_57_/i,
    objective: 'Verify an existing Statement Recon canned message can be edited and saved again.',
    steps: [
      'Open Match Types & Canned Messages.',
      'Save an initial message template value.',
      'Edit the same template and confirm the updated value persists.'
    ]
  },
  {
    pattern: /^TS_58_/i,
    objective: 'Verify the Update action works when a canned message already exists for the selected match status.',
    steps: [
      'Open Match Types & Canned Messages.',
      'Load an existing template value.',
      'Update the template and verify the new value is retained.'
    ]
  },
  {
    pattern: /^TS_59_/i,
    objective: 'Verify the canned message editor accepts the supported maximum of 500 characters.',
    steps: [
      'Open Match Types & Canned Messages.',
      'Enter a 500-character message into the editor.',
      'Confirm the full supported length is retained.'
    ]
  },
  {
    pattern: /^TS_60_/i,
    objective: 'Verify the canned message editor does not retain more than 500 characters.',
    steps: [
      'Open Match Types & Canned Messages.',
      'Enter a message longer than 500 characters.',
      'Confirm the retained value is limited to the supported maximum.'
    ]
  },
  {
    pattern: /^TS_61_/i,
    objective: 'Verify an existing Statement Recon canned message is preloaded when the same configuration card is reopened.',
    steps: [
      'Open Match Types & Canned Messages and save a template value.',
      'Reopen the same configuration surface for the customer.',
      'Confirm the saved template text is preloaded.'
    ]
  },
  {
    pattern: /^TS_62_/i,
    objective: 'Verify users can reopen a saved Statement Recon canned message and review or edit the persisted text.',
    steps: [
      'Open Match Types & Canned Messages and save a template value.',
      'Reopen the configuration card for the same match status.',
      'Confirm the persisted text is available for review or editing.'
    ]
  },
  {
    pattern: /^TS_63_/i,
    objective: 'Verify saved Statement Recon canned messages remain persisted in the configuration UI for later use.',
    steps: [
      'Open Match Types & Canned Messages.',
      'Save a template value for the primary match status.',
      'Reopen the configuration and confirm the saved value is still present.'
    ]
  },
  {
    pattern: /^TS_64_/i,
    objective: 'Verify a configured canned message is exposed to users from the Statement Recon result experience.',
    steps: [
      'Configure a Statement Recon canned message for the primary match status.',
      'Open Statement Recon Search results for the customer.',
      'Inspect the matched-result help/tooltip experience for the configured message.'
    ]
  },
  {
    pattern: /^TS_65_/i,
    objective: 'Verify the Statement Recon result help tooltip matches the configured canned message content.',
    steps: [
      'Save a known canned message template.',
      'Open Statement Recon Search and move to the relevant result state.',
      'Verify the displayed tooltip/help content matches the configured template.'
    ]
  },
  {
    pattern: /^TS_66_/i,
    objective: 'Verify the Statement Recon canned message experience updates when switching between customers.',
    steps: [
      'Save a canned message for the default customer.',
      'Return to Statement Recon Search and switch to another customer.',
      'Confirm the result experience updates for the newly selected customer.'
    ]
  },
  {
    pattern: /^TS_67_/i,
    objective: 'Verify a Customer Super Admin can access the Statement Recon canned message experience.',
    steps: [
      'Sign in as a Customer Super Admin user.',
      'Open Statement Recon.',
      'Confirm the canned message-capable Statement Recon experience is accessible.'
    ]
  },
  {
    pattern: /^TS_68_/i,
    objective: 'Verify a Customer Admin can access the Statement Recon canned message experience.',
    steps: [
      'Sign in as a Customer Admin user.',
      'Open Statement Recon.',
      'Confirm the canned message-capable Statement Recon experience is accessible.'
    ]
  },
  {
    pattern: /^TS_69_/i,
    objective: 'Verify the Rematch Date filter is available and functional on Statement Recon Search results.',
    steps: [
      'Open Statement Recon Search results for the selected customer.',
      'Open the Rematch Date filter control.',
      'Choose a date and confirm the filter accepts the selection.'
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

function enrichSrSearchNewModuleReport({ resultsDir }) {
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
    console.log(`Enriched SR_Search_New_Module business descriptions in ${updatedCount} Allure result files.`);
  }
}

module.exports = {
  enrichSrSearchNewModuleReport,
};
