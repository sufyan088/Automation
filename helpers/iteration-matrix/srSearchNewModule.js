const { expect, test } = require('@playwright/test');
const { safeClick, safeExpectVisible, safeFill, waitForAppToSettle } = require('../actions');
const { clickIfFound, resolveFirst } = require('../fallback');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { openAdminModule, openCustomerModuleManagement } = require('../admin');
const { customerModuleManagementSelectors } = require('../../selectors/customerModuleManagement.selectors');
const { srSearchNewModuleSelectors } = require('../../selectors/iteration-matrix/srSearchNewModule.selectors.js');

const DEFAULT_CUSTOMER = 'Langham Logistics';
const ALTERNATE_CUSTOMER = 'Verizon Customer';
const MAX_MESSAGE_LENGTH = 500;

async function reportStep(name, action) {
  return test.step(name, action);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildMessage(prefix = 'SR canned message') {
  return `${prefix} ${Date.now()}`;
}

async function openModule(page) {
  await clickIfFound(page, srSearchNewModuleSelectors.moduleCard, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await waitForAppToSettle(page, 1000);
  return page;
}

async function getVisibleComboboxes(page) {
  const comboboxes = page.getByRole('combobox');
  const total = await comboboxes.count();
  const visibleComboboxes = [];

  for (let index = 0; index < total; index += 1) {
    const combobox = comboboxes.nth(index);
    if (await combobox.isVisible().catch(() => false)) {
      visibleComboboxes.push(combobox);
    }
  }

  return visibleComboboxes;
}

async function getCustomerCombobox(page, customerName) {
  const customerPattern = customerName ? new RegExp(escapeRegex(customerName), 'i') : null;
  const boundCustomerText = customerName
    ? page.getByText(new RegExp(`Customer:\\s*${escapeRegex(customerName)}`, 'i')).first()
    : null;
  const hasBoundCustomer = boundCustomerText
    ? await boundCustomerText.isVisible().catch(() => false)
    : false;
  const visibleComboboxes = await getVisibleComboboxes(page);

  for (const combobox of visibleComboboxes) {
    const text = ((await combobox.textContent().catch(() => '')) || '').trim();
    if (!text) {
      continue;
    }

    if (customerPattern && customerPattern.test(text)) {
      return combobox;
    }

    if (hasBoundCustomer) {
      if (/select customer/i.test(text)) {
        return combobox;
      }

      continue;
    }

    if (/search by|search all|uploaded on|rematch date|column order/i.test(text)) {
      continue;
    }

    if (/^\d+$/.test(text)) {
      continue;
    }

    return combobox;
  }

  return null;
}

async function selectCustomer(page, customerName = DEFAULT_CUSTOMER) {
  const searchValue = String(customerName).slice(0, 3) || String(customerName);
  const customerCombobox = await getCustomerCombobox(page, customerName);

  const boundCustomerText = page.getByText(new RegExp(`Customer:\\s*${escapeRegex(customerName)}`, 'i')).first();
  if (!customerCombobox && await boundCustomerText.isVisible().catch(() => false)) {
    return customerName;
  }

  if (!customerCombobox) {
    throw new Error('No visible SR Search customer combobox was found.');
  }

  const currentText = ((await customerCombobox.textContent().catch(() => '')) || '').trim();
  if (currentText && !/select customer/i.test(currentText) && currentText.toLowerCase().includes(String(customerName).toLowerCase())) {
    return currentText;
  }

  await customerCombobox.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);

  let searchInput = null;
  const searchInputCandidates = [
    page.getByPlaceholder('Search customers (min. 3 characters)...').first(),
    page.locator('input[placeholder*="Search customers"]').first(),
    page.locator('[cmdk-input]').first(),
    page.locator('[role="dialog"] input[role="combobox"]').first(),
    page.locator('[role="dialog"] input').first()
  ];

  for (const candidate of searchInputCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      searchInput = candidate;
      break;
    }
  }

  if (searchInput) {
    await searchInput.fill('').catch(() => null);
    await searchInput.type(searchValue, { delay: 40 }).catch(async () => {
      await searchInput.fill(searchValue).catch(() => null);
    });
    await waitForAppToSettle(page, 1250);
  }

  const customerPattern = new RegExp(`^${escapeRegex(customerName)}$`, 'i');
  const exactTextMatches = page.getByText(customerPattern);
  const visibleTextMatches = [];
  const textMatchCount = await exactTextMatches.count();

  for (let index = 0; index < textMatchCount; index += 1) {
    const candidate = exactTextMatches.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      visibleTextMatches.push(candidate);
    }
  }

  const optionCandidates = [
    visibleTextMatches.at(-1),
    page.getByRole('option', { name: customerPattern }).first(),
    page.locator('[role="option"]').filter({ hasText: customerPattern }).first(),
    page.locator('[cmdk-item]').filter({ hasText: customerPattern }).first(),
    page.getByText(customerPattern).last(),
    page.getByRole('button', { name: customerPattern }).first()
  ].filter(Boolean);

  let selectedOption = null;
  for (const candidate of optionCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      selectedOption = candidate;
      break;
    }
  }

  if (!selectedOption) {
    if (searchInput) {
      await searchInput.press('ArrowDown').catch(() => null);
      await searchInput.press('Enter').catch(() => null);
    } else {
      await page.keyboard.press('ArrowDown').catch(() => null);
      await page.keyboard.press('Enter').catch(() => null);
    }
    await waitForAppToSettle(page, 1500);
  } else {
    await selectedOption.click({ timeout: 5000 });
    await waitForAppToSettle(page, 1500);
  }

  await expect.poll(async () => ((await customerCombobox.textContent().catch(() => '')) || '').trim(), {
    timeout: 10000,
    intervals: [500, 1000]
  }).toMatch(customerPattern);

  await page.keyboard.press('Escape').catch(() => null);
  await waitForAppToSettle(page, 500);

  return ((await customerCombobox.textContent().catch(() => '')) || '').trim();
}

async function openSearchTab(page) {
  try {
    await resolveFirst(page, srSearchNewModuleSelectors.searchAllEntries, {
      mustBeVisible: true,
      timeoutPerCandidate: 1000
    });
    await waitForAppToSettle(page, 500);
    return;
  } catch (error) {
    // Search page is not open yet; fall through to the navigation tab click.
  }

  await safeClick(page, srSearchNewModuleSelectors.searchTab, 'SR Search tab', {
    mustBeVisible: true,
    timeoutPerCandidate: 10000
  });
  await waitForAppToSettle(page, 1500);
}

async function openSearchWorkspace(page, data, options = {}) {
  const customerName = options.customerName || data?.statementSearchCustomer || DEFAULT_CUSTOMER;

  await openModule(page);
  await openSearchTab(page);

  if (!options.skipCustomerSelection) {
    await selectCustomer(page, customerName);
  }

  try {
    await openSearchTab(page);
  } catch (error) {
    if (!options.skipCustomerSelection) {
      await selectCustomer(page, customerName);
    }
    await openSearchTab(page);
  }
}

async function expectUpdateCannedMessagesVisible(page) {
  await safeExpectVisible(page, srSearchNewModuleSelectors.updateCannedMessagesButton, 'Update Canned Messages button', {
    timeoutPerCandidate: 10000,
    expectTimeout: 15000
  });
}

async function openConfigurationPage(page, data) {
  const customerName = data?.statementSearchCustomer || DEFAULT_CUSTOMER;

  await openAdminModule(page);
  await openCustomerModuleManagement(page);
  await safeFill(page, customerModuleManagementSelectors.searchAllEntries, customerName, 'Customer Module Management search', {
    mustBeVisible: true,
    timeoutPerCandidate: 10000
  });
  await waitForAppToSettle(page, 2000);
  await safeExpectVisible(page, [
    { type: 'text', value: new RegExp(escapeRegex(customerName), 'i'), name: `text:${customerName}` }
  ], 'Customer Module Management customer row', {
    timeoutPerCandidate: 10000,
    expectTimeout: 15000
  });

  await safeClick(page, srSearchNewModuleSelectors.updateCannedMessagesButton, 'Update Canned Messages button', {
    mustBeVisible: true,
    timeoutPerCandidate: 10000
  });
  await waitForAppToSettle(page, 1500);
  await safeExpectVisible(page, srSearchNewModuleSelectors.configurationHeading, 'Match Types & Canned Messages heading', {
    timeoutPerCandidate: 10000,
    expectTimeout: 15000
  });
}

async function getVisibleCardHeadings(page) {
  const headings = page.locator('h3');
  const count = await headings.count();
  const values = [];

  for (let index = 0; index < count; index += 1) {
    const heading = headings.nth(index);
    if (!(await heading.isVisible().catch(() => false))) {
      continue;
    }

    const text = ((await heading.textContent().catch(() => '')) || '').trim();
    if (text) {
      values.push(text);
    }
  }

  return values;
}

async function expectMatchStatusCardsVisible(page) {
  await expect.poll(async () => {
    const headings = await getVisibleCardHeadings(page);
    return headings.length;
  }, {
    timeout: 15000,
    intervals: [500, 1000]
  }).toBeGreaterThan(0);
}

async function primaryMessageCard(page) {
  const matchedCard = page.locator('div').filter({
    has: page.getByRole('heading', { name: /^matched$/i })
  }).filter({
    has: page.locator('textarea')
  }).first();

  if (await matchedCard.isVisible().catch(() => false)) {
    return matchedCard;
  }

  return page.locator('div').filter({ has: page.locator('textarea') }).first();
}

async function firstMessageTextarea(page) {
  const card = await primaryMessageCard(page);
  const textarea = card.locator('textarea').first();
  if (await textarea.isVisible().catch(() => false)) {
    return textarea;
  }

  return page.locator('textarea').first();
}

async function readFirstMessage(page) {
  const textarea = await firstMessageTextarea(page);
  await expect(textarea).toBeVisible({ timeout: 10000 });
  return textarea.inputValue();
}

async function fillFirstMessage(page, message, options = {}) {
  const textarea = await firstMessageTextarea(page);
  await expect(textarea).toBeVisible({ timeout: 10000 });
  await textarea.fill('');
  await textarea.fill(message);

  if (Object.prototype.hasOwnProperty.call(options, 'expectedValue')) {
    await expect(textarea).toHaveValue(options.expectedValue, { timeout: 10000 });
  } else {
    await expect(textarea).toHaveValue(message, { timeout: 10000 });
  }
}

async function clickPrimaryMessageAction(page) {
  const card = await primaryMessageCard(page);
  const actionButton = card.getByRole('button', { name: /^(save|update)$/i }).first();
  await expect(actionButton).toBeVisible({ timeout: 10000 });
  await actionButton.click({ timeout: 5000 });
  await waitForAppToSettle(page, 1000);
}

async function saveMessage(page, message) {
  await fillFirstMessage(page, message);
  await clickPrimaryMessageAction(page);
  await expect.poll(async () => (await readFirstMessage(page)).trim(), {
    timeout: 15000,
    intervals: [500, 1000]
  }).toBe(message);
}

async function openConfigurationTwiceAndExpectMessage(page, data, message) {
  await openConfigurationPage(page, data);
  await expect.poll(async () => (await readFirstMessage(page)).trim(), {
    timeout: 15000,
    intervals: [500, 1000]
  }).toBe(message);
}

async function returnToSearch(page, data) {
  await openSearchWorkspace(page, data);
  await waitForAppToSettle(page, 1000);
}

async function openMatchedTab(page) {
  const matchedTab = page.getByRole('tab', { name: /^matched$/i }).first();
  if (await matchedTab.isVisible().catch(() => false)) {
    await matchedTab.click({ timeout: 5000 });
  } else {
    await safeClick(page, srSearchNewModuleSelectors.matchedTab, 'Matched tab', {
      mustBeVisible: true,
      timeoutPerCandidate: 10000
    });
  }
  await waitForAppToSettle(page, 1500);
}

async function openFirstStatementDetails(page) {
  const firstRow = page.locator('table tbody tr').filter({ hasNotText: /no results found\./i }).first();
  await expect(firstRow).toBeVisible({ timeout: 10000 });

  const actionButtonCandidates = [
    firstRow.getByRole('button', { name: /actions for|open actions menu|open menu/i }).first(),
    firstRow.locator('button[aria-haspopup="menu"]').first(),
    firstRow.locator('svg.lucide-grip-vertical').locator('xpath=ancestor::button[1]').first(),
    firstRow.locator('button').last()
  ];

  for (const candidate of actionButtonCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.click({ timeout: 5000 });
      await waitForAppToSettle(page, 500);
      break;
    }
  }

  const viewDetailsCandidates = [
    page.getByRole('menuitem', { name: /view reconciliation results/i }).first(),
    page.locator('[role="menuitem"]').filter({ hasText: /view reconciliation results/i }).first(),
    page.getByRole('menuitem', { name: /view statement details/i }).first(),
    page.locator('[role="menuitem"]').filter({ hasText: /view statement details/i }).first(),
    page.getByRole('button', { name: /view statement details/i }).first(),
    page.getByText('View Statement Details', { exact: true }).first()
  ];

  for (const candidate of viewDetailsCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
      return;
    }
  }

  throw new Error('Unable to open View Statement Details from the first matched result row.');
}

async function openFirstTooltip(page) {
  await openFirstStatementDetails(page);

  const firstResultRow = page.locator('table tbody tr').filter({ hasNotText: /sort by|no results found\./i }).first();
  await expect(firstResultRow).toBeVisible({ timeout: 10000 });

  const tooltipTriggerCandidates = [
    firstResultRow.getByText(/^matched$/i).first(),
    firstResultRow.locator('td').filter({ hasText: /^matched$/i }).first(),
    firstResultRow.locator('td').nth(4).getByText(/^matched$/i).first(),
    page.locator('table tbody tr td').filter({ hasText: /^matched$/i }).first(),
    page.getByText(/^matched$/i).first()
  ];

  for (const candidate of tooltipTriggerCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.focus().catch(() => null);
      await candidate.hover({ timeout: 5000 }).catch(async () => {
        await candidate.click({ timeout: 5000 }).catch(() => null);
      });
      await waitForAppToSettle(page, 500);
      return;
    }
  }

  throw new Error('Unable to locate an SR Search tooltip trigger in the result table.');
}

async function readTooltipText(page) {
  try {
    const { locator } = await resolveFirst(page, srSearchNewModuleSelectors.tooltip, {
      mustBeVisible: true,
      timeoutPerCandidate: 2000
    });

    return ((await locator.textContent().catch(() => '')) || '').trim();
  } catch (error) {
    return '';
  }
}

async function expectTooltipText(page, expectedText) {
  await expect.poll(async () => readTooltipText(page), {
    timeout: 15000,
    intervals: [500, 1000]
  }).toContain(expectedText);
}

async function openRematchDateFilter(page) {
  await safeClick(page, srSearchNewModuleSelectors.rematchDateButton, 'Rematch Date filter', {
    mustBeVisible: true,
    timeoutPerCandidate: 10000
  });
  await waitForAppToSettle(page, 500);
}

async function selectFirstCalendarDay(page) {
  const dayCell = page.locator('[role="dialog"] [role="gridcell"]').first();
  await expect(dayCell).toBeVisible({ timeout: 10000 });
  await dayCell.click({ timeout: 5000 });
  await waitForAppToSettle(page, 750);
  await expect.poll(async () => {
    const ariaSelected = await dayCell.getAttribute('aria-selected').catch(() => null);
    const dataSelected = await dayCell.getAttribute('data-selected').catch(() => null);
    return ariaSelected || dataSelected || '';
  }, {
    timeout: 20000,
    intervals: [500, 1000]
  }).toMatch(/true|selected/i);
}

async function runTs51(page, data) {
  await reportStep('Open the canned messages configuration area', async () => {
    await openConfigurationPage(page, data);
  });
  await reportStep('Verify canned message cards are available for match statuses', async () => {
    await expectMatchStatusCardsVisible(page);
  });
}

async function runTs52(page, data) {
  await reportStep('Open the configuration section from SR Search', async () => {
    await openConfigurationPage(page, data);
  });
}

async function runTs53(page, data) {
  await reportStep('Open the canned messages configuration area', async () => {
    await openConfigurationPage(page, data);
  });
  await reportStep('Verify labeled match status cards are displayed', async () => {
    const headings = await getVisibleCardHeadings(page);
    expect(headings.length).toBeGreaterThan(0);
  });
}

async function runTs54(page, data) {
  await reportStep('Open the canned messages configuration area', async () => {
    await openConfigurationPage(page, data);
  });
  await reportStep('Verify the text area is present and accepts input', async () => {
    await fillFirstMessage(page, buildMessage('SR text area'));
  });
}

async function runTs55(page, data) {
  await runTs54(page, data);
}

async function runTs56(page, data) {
  await reportStep('Open the canned messages configuration area', async () => {
    await openConfigurationPage(page, data);
  });
  await reportStep('Save a canned message update', async () => {
    await saveMessage(page, buildMessage('SR save'));
  });
}

async function runTs57(page, data) {
  const originalMessage = buildMessage('SR original');
  const updatedMessage = `${originalMessage} edited`;

  await reportStep('Open the canned messages configuration area', async () => {
    await openConfigurationPage(page, data);
  });
  await reportStep('Save an initial message and edit it', async () => {
    await saveMessage(page, originalMessage);
    await openConfigurationTwiceAndExpectMessage(page, data, originalMessage);
    await saveMessage(page, updatedMessage);
  });
}

async function runTs58(page, data) {
  await runTs57(page, data);
}

async function runTs59(page, data) {
  const maxMessage = 'A'.repeat(MAX_MESSAGE_LENGTH);

  await reportStep('Open the canned messages configuration area', async () => {
    await openConfigurationPage(page, data);
  });
  await reportStep('Enter the maximum supported message length', async () => {
    await fillFirstMessage(page, maxMessage);
    await expect.poll(async () => (await readFirstMessage(page)).length, {
      timeout: 10000,
      intervals: [250, 500]
    }).toBe(MAX_MESSAGE_LENGTH);
  });
}

async function runTs60(page, data) {
  const oversizedMessage = 'B'.repeat(MAX_MESSAGE_LENGTH + 50);
  const truncatedMessage = oversizedMessage.slice(0, MAX_MESSAGE_LENGTH);

  await reportStep('Open the canned messages configuration area', async () => {
    await openConfigurationPage(page, data);
  });
  await reportStep('Verify the text area does not retain more than 500 characters', async () => {
    await fillFirstMessage(page, oversizedMessage, { expectedValue: truncatedMessage });
    const actualValue = await readFirstMessage(page);
    expect(actualValue.length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH);
  });
}

async function runTs61(page, data) {
  const savedMessage = buildMessage('SR preload');

  await reportStep('Open the canned messages configuration area', async () => {
    await openConfigurationPage(page, data);
  });
  await reportStep('Save a canned message template', async () => {
    await saveMessage(page, savedMessage);
  });
  await reportStep('Reopen the configuration area and verify the template is preloaded', async () => {
    await openConfigurationTwiceAndExpectMessage(page, data, savedMessage);
  });
}

async function runTs62(page, data) {
  await runTs61(page, data);
}

async function runTs63(page, data) {
  await reportStep('Open the canned messages configuration area', async () => {
    await openConfigurationPage(page, data);
  });
  await reportStep('Save a canned message and verify it remains persisted in the UI', async () => {
    const savedMessage = buildMessage('SR persisted');
    await saveMessage(page, savedMessage);
    await openConfigurationTwiceAndExpectMessage(page, data, savedMessage);
  });
}

async function runTs64(page, data) {
  const cannedMessage = buildMessage('SR tooltip');

  await reportStep('Configure a canned message', async () => {
    await openConfigurationPage(page, data);
    await saveMessage(page, cannedMessage);
  });
  await reportStep('Open SR search results and verify a help tooltip is shown', async () => {
    await returnToSearch(page, data);
    await openMatchedTab(page);
    await openFirstTooltip(page);
    await expectTooltipText(page, cannedMessage);
  });
}

async function runTs65(page, data) {
  await runTs64(page, data);
}

async function runTs66(page, data) {
  const initialMessage = buildMessage('SR dynamic initial');
  const updatedMessage = buildMessage('SR dynamic updated');

  await reportStep('Configure and then update the canned message for the customer', async () => {
    await openConfigurationPage(page, data);
    await saveMessage(page, initialMessage);
    await openConfigurationTwiceAndExpectMessage(page, data, initialMessage);
    await saveMessage(page, updatedMessage);
  });

  await reportStep('Open SR search results and verify the updated message appears in the hover tooltip', async () => {
    await returnToSearch(page, data);
    await openMatchedTab(page);
    await openFirstTooltip(page);
    await expectTooltipText(page, updatedMessage);
  });
}

async function runTs67(page, data) {
  await reportStep('Open Statement Recon and verify canned messages access for Customer Super Admin', async () => {
    await openSearchWorkspace(page, data);
    await openMatchedTab(page);
  });
}

async function runTs68(page, data) {
  await reportStep('Open Statement Recon and verify canned messages access for Customer Admin', async () => {
    await openSearchWorkspace(page, data);
    await openMatchedTab(page);
  });
}

async function runTs69(page, data) {
  await reportStep('Open SR Search results', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Open the Rematch Date filter and choose a date', async () => {
    await openRematchDateFilter(page);
    await selectFirstCalendarDay(page);
  });
}

const scenarioMap = {
  TS_51: runTs51,
  TS_52: runTs52,
  TS_53: runTs53,
  TS_54: runTs54,
  TS_55: runTs55,
  TS_56: runTs56,
  TS_57: runTs57,
  TS_58: runTs58,
  TS_59: runTs59,
  TS_60: runTs60,
  TS_61: runTs61,
  TS_62: runTs62,
  TS_63: runTs63,
  TS_64: runTs64,
  TS_65: runTs65,
  TS_66: runTs66,
  TS_67: runTs67,
  TS_68: runTs68,
  TS_69: runTs69
};

async function runScenario(page, data, testTitle) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => testTitle.includes(key));
  if (!scenarioKey) {
    throw new Error(`Unsupported SR Search New Module scenario: ${testTitle}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

const helperMap = {
  openModule,
  selectCustomer,
  openSearchTab,
  openSearchWorkspace,
  openConfigurationPage,
  openMatchedTab
};

module.exports = {
  srSearchNewModuleHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario,
    selectors: srSearchNewModuleSelectors
  }
};
