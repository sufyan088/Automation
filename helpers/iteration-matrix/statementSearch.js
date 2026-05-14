const { expect, test } = require('@playwright/test');
const { safeClick, safeExpectVisible, safeFill, waitForAppToSettle } = require('../actions');
const { clickIfFound, resolveFirst } = require('../fallback');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { statementSearchSelectors } = require('../../selectors/iteration-matrix/statementSearch.selectors.js');

const DEFAULT_CUSTOMER = 'Langham Logistics';

async function reportStep(name, action) {
  return test.step(name, action);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function gridScope(page) {
  return page.locator('section').filter({
    has: page.getByPlaceholder('Search all entries...').first()
  }).first();
}

async function openModule(page) {
  await safeClick(page, statementSearchSelectors.moduleCard, 'Statement Recon module card');
  await waitForAppToSettle(page, 1000);
  await safeExpectVisible(page, statementSearchSelectors.heading, 'Statement Recon heading');
  return page;
}

async function selectCustomer(page, customerName = DEFAULT_CUSTOMER) {
  const searchValue = String(customerName).slice(0, 3) || String(customerName);

  await safeClick(page, statementSearchSelectors.customerCombobox, 'Select Customer combobox', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await waitForAppToSettle(page, 500);
  const searchInput = page.getByPlaceholder('Search customers (min. 3 characters)...').first();
  await safeFill(page, statementSearchSelectors.customerSearchInput, searchValue, 'Customer search', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await waitForAppToSettle(page, 1500);

  const customerNamePattern = new RegExp(`^${escapeRegex(customerName)}$`, 'i');
  const exactTextMatches = page.getByText(customerNamePattern);
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
    page.getByRole('option', { name: customerNamePattern }).first(),
    page.locator('[role="option"]').filter({ hasText: customerNamePattern }).first(),
    page.getByRole('button', { name: customerNamePattern }).first(),
    page.getByText(customerNamePattern).first()
  ].filter(Boolean);

  let customerOption = null;
  for (const candidate of optionCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      customerOption = candidate;
      break;
    }
  }
  if (!customerOption) {
    await searchInput.press('ArrowDown').catch(() => {});
    await searchInput.press('Enter').catch(() => {});
    await waitForAppToSettle(page, 1500);
  } else {
    await customerOption.click({ timeout: 5000 });
    await waitForAppToSettle(page, 1500);
  }

  const selectedCustomer = page.getByText(customerNamePattern).last();
  await expect(selectedCustomer).toBeVisible({ timeout: 10000 });
  await page.keyboard.press('Escape').catch(() => {});
  await waitForAppToSettle(page, 500);
}

async function openSearchTab(page) {
  await safeClick(page, statementSearchSelectors.searchTab, 'Statement Search tab', {
    mustBeVisible: true,
    timeoutPerCandidate: 10000
  });
  await waitForAppToSettle(page, 2000);
  await safeExpectVisible(page, statementSearchSelectors.searchAllEntries, 'Search all entries input', {
    timeoutPerCandidate: 10000,
    expectTimeout: 15000
  });
}

async function openSearchWorkspace(page, data) {
  const customerName = data?.statementSearchCustomer || DEFAULT_CUSTOMER;

  await openModule(page);
  await selectCustomer(page, customerName);

  try {
    await openSearchTab(page);
  } catch (error) {
    await selectCustomer(page, customerName);
    await openSearchTab(page);
  }
}

async function bodyShowsLoading(page) {
  return page.locator('body').evaluate((node) => {
    const text = node.innerText || '';
    return text.includes('Page: loading..') || text.includes('Viewing Entries: loading..') || text.includes('Loading suppliers...');
  }).catch(() => false);
}

async function openActionableResultsTab(page) {
  const candidateTabs = ['Not Fully Matched', 'Missing'];

  for (const tabName of candidateTabs) {
    const tab = page.getByRole('tab', { name: new RegExp(`^${escapeRegex(tabName)}$`, 'i') }).first();
    if (!(await tab.isVisible().catch(() => false))) {
      continue;
    }

    await tab.click({ timeout: 5000 });
    await waitForAppToSettle(page, 1500);

    try {
      await expect
        .poll(async () => {
          const loading = await bodyShowsLoading(page);
          const actionButtonCount = await page.locator('table tbody tr button').count().catch(() => 0);
          return { loading, actionButtonCount };
        }, { timeout: 20000 })
        .toEqual({ loading: false, actionButtonCount: expect.any(Number) });
    } catch (error) {
      // Fall through to the explicit button-count check below so the next tab can be tried.
    }

    const loading = await bodyShowsLoading(page);
    const actionButtonCount = await page.locator('table tbody tr button').count().catch(() => 0);
    if (!loading && actionButtonCount > 0) {
      return;
    }
  }

  throw new Error('Unable to find a Statement Search results tab with loaded rows and row actions.');
}

async function resolveNavigationButton(page, candidates, label) {
  const { locator } = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });

  const button = await locator.evaluateHandle((node) => {
    return node.closest('button') || node.closest('a') || node;
  });
  const element = button.asElement();
  if (!element) {
    throw new Error(`Unable to resolve clickable element for ${label}`);
  }

  return page.locator(`xpath=//*[@data-resolved-nav="${label}"]`);
}

async function clickNavigationButton(page, candidates, label) {
  try {
    await safeClick(page, candidates, label, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
  } catch (error) {
    const { locator } = await resolveFirst(page, candidates, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    const handle = await locator.elementHandle();
    const buttonHandle = await handle.evaluateHandle((node) => node.closest('button') || node.closest('a') || node);
    await buttonHandle.asElement().click();
  }

  await waitForAppToSettle(page, 1000);
}

async function getHeaderButtons(page) {
  const table = page.locator('table').first();
  await expect(table).toBeVisible({ timeout: 15000 });
  return table.locator('thead th button');
}

async function getHeaderLabels(page, limit = 5) {
  const buttons = await getHeaderButtons(page);
  const count = Math.min(await buttons.count(), limit + 1);
  const labels = [];

  for (let index = 0; index < count; index += 1) {
    const label = (await buttons.nth(index).textContent())?.trim();
    if (!label || /actions/i.test(label)) {
      continue;
    }
    labels.push(label);
    if (labels.length >= limit) {
      break;
    }
  }

  return labels;
}

async function openHeaderMenu(page, headerLabel) {
  const headerButton = page.locator('table thead th button').filter({
    hasText: new RegExp(`^${escapeRegex(headerLabel)}$`, 'i')
  }).first();
  await expect(headerButton).toBeVisible({ timeout: 10000 });
  await headerButton.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
}

async function clickVisibleMenuItem(page, labelPattern) {
  const menuItem = page.getByRole('menuitem', { name: labelPattern }).first();
  if (await menuItem.isVisible().catch(() => false)) {
    await menuItem.click({ timeout: 5000 });
    await waitForAppToSettle(page, 750);
    return;
  }

  const fallbackItem = page.getByText(labelPattern).first();
  await expect(fallbackItem).toBeVisible({ timeout: 10000 });
  await fallbackItem.click({ timeout: 5000 });
  await waitForAppToSettle(page, 750);
}

async function applyHeaderAction(page, actionLabel, maxHeaders = 3) {
  const headerLabels = await getHeaderLabels(page, maxHeaders);
  let appliedCount = 0;

  for (const headerLabel of headerLabels) {
    await openHeaderMenu(page, headerLabel);
    await clickVisibleMenuItem(page, actionLabel);
    appliedCount += 1;
  }

  return appliedCount;
}

async function openColumnOrder(page) {
  await safeClick(page, statementSearchSelectors.columnOrderButton, 'Column Order button', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await waitForAppToSettle(page, 750);
}

async function toggleFirstColumnVisibility(page) {
  await openColumnOrder(page);

  const visibilityToggle = page.locator('button[aria-label*="column"]').first();
  await expect(visibilityToggle).toBeVisible({ timeout: 10000 });
  await visibilityToggle.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
  await visibilityToggle.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
  await page.keyboard.press('Escape').catch(() => {});
}

async function clickPaginationSizeTrigger(page) {
  await safeClick(page, statementSearchSelectors.paginationSizeTrigger, 'Pagination size trigger', {
    mustBeVisible: true,
    timeoutPerCandidate: 10000
  });
  await waitForAppToSettle(page, 500);
}

async function selectPaginationSize(page, size) {
  await clickPaginationSizeTrigger(page);
  const option = page.getByRole('option', { name: new RegExp(`^${size}$`) }).first();
  if (await option.isVisible().catch(() => false)) {
    await option.click({ timeout: 5000 });
  } else {
    await page.getByText(new RegExp(`^${size}$`)).last().click({ timeout: 5000 });
  }
  await waitForAppToSettle(page, 1000);
}

async function expectPaginationOptions(page, sizes) {
  await clickPaginationSizeTrigger(page);
  for (const size of sizes) {
    const option = page.getByText(new RegExp(`^${size}$`)).last();
    await expect(option).toBeVisible({ timeout: 10000 });
  }
  await page.keyboard.press('Escape').catch(() => {});
}

async function searchAllEntries(page, value) {
  await safeFill(page, statementSearchSelectors.searchAllEntries, value, 'Search all entries', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await waitForAppToSettle(page, 1000);
}

async function expectTableContains(page, value) {
  await expect(page.locator('table tbody')).toContainText(value, { timeout: 15000 });
}

async function clickRowAction(page, candidates) {
  const rows = page.locator('table tbody tr');
  const rowCount = await rows.count();

  for (let index = 0; index < Math.min(rowCount, 10); index += 1) {
    const row = rows.nth(index);
    if (!(await row.isVisible().catch(() => false))) {
      continue;
    }

    const actionButton = row.locator('button').last();
    if (!(await actionButton.isVisible().catch(() => false))) {
      continue;
    }

    await actionButton.click({ timeout: 5000 });
    await waitForAppToSettle(page, 500);

    try {
      const { locator } = await resolveFirst(page, candidates, {
        mustBeVisible: true,
        timeoutPerCandidate: 2500
      });

      if (!(await locator.isEnabled().catch(() => false))) {
        await page.keyboard.press('Escape').catch(() => {});
        await waitForAppToSettle(page, 250);
        continue;
      }

      await locator.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
      return;
    } catch (error) {
      await page.keyboard.press('Escape').catch(() => {});
      await waitForAppToSettle(page, 250);
    }
  }

  throw new Error('Unable to find an enabled row action for the requested Statement Search menu item.');
}

async function clickReturnToTop(page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await waitForAppToSettle(page, 500);
  const clickResult = await clickIfFound(page, statementSearchSelectors.returnToTop, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });

  if (!clickResult.clicked) {
    throw clickResult.error;
  }

  await waitForAppToSettle(page, 1000);
  await expect.poll(async () => page.evaluate(() => Math.round(window.scrollY))).toBeLessThanOrEqual(10);
}

async function runTs01(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Verify the Statement Search grid is visible', async () => {
    await safeExpectVisible(page, statementSearchSelectors.searchAllEntries, 'Search all entries input');
    await expect(page.locator('table').first()).toBeVisible({ timeout: 15000 });
  });
}

async function runTs02(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Open the last page from pagination controls', async () => {
    await clickNavigationButton(page, statementSearchSelectors.goToLastPage, 'Go to last page');
  });
}

async function runTs03(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Navigate forward and then back using the previous page control', async () => {
    await clickNavigationButton(page, statementSearchSelectors.goToNextPage, 'Go to next page');
    await clickNavigationButton(page, statementSearchSelectors.goToNextPage, 'Go to next page');
    await clickNavigationButton(page, statementSearchSelectors.goToPreviousPage, 'Go to previous page');
  });
}

async function runTs04(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Navigate away from the first page and return using the first page control', async () => {
    await clickNavigationButton(page, statementSearchSelectors.goToLastPage, 'Go to last page');
    await clickNavigationButton(page, statementSearchSelectors.goToFirstPage, 'Go to first page');
  });
}

async function runTs05(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Use the next page control on the results grid', async () => {
    await clickNavigationButton(page, statementSearchSelectors.goToNextPage, 'Go to next page');
  });
}

async function runTs06(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Open Column Order and toggle a column visibility setting', async () => {
    await toggleFirstColumnVisibility(page);
  });
}

async function runTs07(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Return to the top of the page using the utility button', async () => {
    await clickReturnToTop(page);
  });
}

async function runTs08(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Apply ascending sort from several column menus', async () => {
    const appliedCount = await applyHeaderAction(page, /ascending|asc/i);
    expect(appliedCount).toBeGreaterThan(0);
  });
}

async function runTs09(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Apply descending sort from several column menus', async () => {
    const appliedCount = await applyHeaderAction(page, /descending|desc/i);
    expect(appliedCount).toBeGreaterThan(0);
  });
}

async function runTs10(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Hide a column from the header action menu', async () => {
    const beforeCount = await (await getHeaderButtons(page)).count();
    const appliedCount = await applyHeaderAction(page, /hide column|hide/i, 1);
    expect(appliedCount).toBe(1);
    await expect.poll(async () => (await getHeaderButtons(page)).count()).toBeLessThan(beforeCount);
  });
}

async function runTs11(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Verify pagination size options and switch between them', async () => {
    await expectPaginationOptions(page, ['5', '10', '25', '50', '100']);
    await selectPaginationSize(page, '50');
    await selectPaginationSize(page, '100');
    await selectPaginationSize(page, '5');
    await selectPaginationSize(page, '10');
  });
}

async function runTs12(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Search within all entries using a known value', async () => {
    await searchAllEntries(page, '9904');
    await expectTableContains(page, '9904');
  });
}

async function runTs13(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Switch to a Statement Search results tab with actionable rows', async () => {
    await openActionableResultsTab(page);
  });
  await reportStep('Open the row action menu and choose View Mapping Details', async () => {
    await clickRowAction(page, statementSearchSelectors.viewMappingDetails);
  });
}

async function runTs14(page, data) {
  await reportStep('Open Statement Search workspace', async () => {
    await openSearchWorkspace(page, data);
  });
  await reportStep('Switch to a Statement Search results tab with actionable rows', async () => {
    await openActionableResultsTab(page);
  });
  await reportStep('Open the row action menu and choose View Statement Details', async () => {
    await clickRowAction(page, statementSearchSelectors.viewStatementDetails);
  });
}

const scenarioMap = {
  TS_01: runTs01,
  TS_02: runTs02,
  TS_03: runTs03,
  TS_04: runTs04,
  TS_05: runTs05,
  TS_06: runTs06,
  TS_07: runTs07,
  TS_08: runTs08,
  TS_09: runTs09,
  TS_10: runTs10,
  TS_11: runTs11,
  TS_12: runTs12,
  TS_13: runTs13,
  TS_14: runTs14
};

async function runScenario(page, data, testTitle) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => testTitle.includes(key));
  if (!scenarioKey) {
    throw new Error(`Unsupported scenario for Statement Search: ${testTitle}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

const helperMap = {
  openModule,
  selectCustomer,
  openSearchTab,
  openSearchWorkspace,
  searchAllEntries
};

module.exports = {
  statementSearchHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario,
    selectors: statementSearchSelectors
  }
};
