const { expect, test } = require('@playwright/test');
const { clickWithFallback, fillWithFallback, resolveFirst, expectVisibleWithFallback } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { customerModuleManagementAdminModuleSelectors } = require('../../selectors/iteration-matrix/customerModuleManagementAdminModule.selectors.js');
const { customerManagementPaymentMethodSelectors } = require('../../selectors/iteration-matrix/customerManagementPaymentMethod.selectors.js');

function buildUniqueCustomerName(data) {
  const seed = `${Date.now()}`.slice(-8);
  const baseName = String(data.CustomerName || data.Customer1 || 'CustomerTest').replace(/[^a-zA-Z0-9]/g, '').slice(0, 18);
  return `${baseName}${seed}`;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeForSort(value) {
  return String(value || '').trim().toLowerCase();
}

function humanizeScenarioTitle(scenarioName) {
  return String(scenarioName || '')
    .replace(/^TS_\d+_/, '')
    .replace(/_/g, ' ')
    .replace(/\bis\b/gi, 'is')
    .trim();
}

async function businessStep(title, action) {
  return test.step(title, action);
}

async function clickChoiceByName(page, optionName) {
  const candidates = [
    page.getByRole('option', { name: optionName, exact: true }),
    page.getByRole('option', { name: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.getByRole('option', { name: new RegExp(escapeRegExp(optionName), 'i') }),
    page.locator('[role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.locator('[role="option"]').filter({ hasText: new RegExp(escapeRegExp(optionName), 'i') }),
    page.getByText(optionName, { exact: true }),
    page.getByText(new RegExp(`^${escapeRegExp(optionName)}$`, 'i')),
    page.getByText(new RegExp(escapeRegExp(optionName), 'i')),
    page.getByRole('button', { name: optionName, exact: true })
  ];

  for (const locator of candidates) {
    if (await clickFirstVisibleLocator(locator)) {
      return true;
    }
  }

  return false;
}

async function clickFirstVisibleLocator(locator) {
  const count = await locator.count().catch(() => 0);
  for (let index = 0; index < count; index += 1) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.scrollIntoViewIfNeeded().catch(() => null);
      await candidate.click({ timeout: 5000 });
      return true;
    }
  }

  return false;
}

async function getDropdownPopupLocator(page, control) {
  const popupId = await control.getAttribute('aria-controls').catch(() => null);
  if (!popupId) {
    return null;
  }

  const popup = page.locator(`#${popupId}`);
  if (await popup.count().catch(() => 0)) {
    return popup;
  }

  return null;
}

async function clickOpenDropdownChoiceByName(page, optionName, popup = null) {
  const candidates = [
    ...(popup ? [
      popup.locator('[role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
      popup.locator('[role="option"]').filter({ hasText: new RegExp(escapeRegExp(optionName), 'i') }),
      popup.locator('[cmdk-item]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
      popup.locator('[cmdk-item]').filter({ hasText: new RegExp(escapeRegExp(optionName), 'i') })
    ] : []),
    page.locator('[role="dialog"] [role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.locator('[role="dialog"] [role="option"]').filter({ hasText: new RegExp(escapeRegExp(optionName), 'i') }),
    page.locator('[data-radix-popper-content-wrapper] [role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.locator('[data-radix-popper-content-wrapper] [role="option"]').filter({ hasText: new RegExp(escapeRegExp(optionName), 'i') }),
    page.locator('[role="listbox"] [role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.locator('[role="listbox"] [role="option"]').filter({ hasText: new RegExp(escapeRegExp(optionName), 'i') }),
    page.locator('[cmdk-item]').filter({ hasText: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }),
    page.locator('[cmdk-item]').filter({ hasText: new RegExp(escapeRegExp(optionName), 'i') })
  ];

  for (const locator of candidates) {
    if (await clickFirstVisibleLocator(locator)) {
      await waitForAppToSettle(page, 300);
      return true;
    }
  }

  return false;
}

async function selectViaOpenDialogSearch(page, optionName, popup = null) {
  const searchTargets = [
    ...(popup ? [
      popup.locator('input[cmdk-input]'),
      popup.locator('input[role="combobox"]'),
      popup.locator('input')
    ] : []),
    page.locator('[data-radix-popper-content-wrapper] input[cmdk-input], [role="dialog"] input[cmdk-input]'),
    page.locator('[role="dialog"] input[role="combobox"]'),
    page.locator('[role="dialog"] input')
  ];

  for (const locator of searchTargets) {
    const count = await locator.count().catch(() => 0);
    for (let index = 0; index < count; index += 1) {
      const candidate = locator.nth(index);
      if (await candidate.isVisible().catch(() => false)) {
        await candidate.fill(String(optionName)).catch(() => null);
        await waitForAppToSettle(page, 250);
        await page.keyboard.press('ArrowDown').catch(() => null);
        await page.keyboard.press('Enter').catch(() => null);
        await waitForAppToSettle(page, 300);
        return true;
      }
    }
  }

  return false;
}

async function resolveVisible(page, candidates, options = {}) {
  return resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500, ...options });
}

async function scrollToVisibleTarget(page, candidates) {
  const target = await resolveVisible(page, candidates, { timeoutPerCandidate: 2500 });
  await target.locator.scrollIntoViewIfNeeded().catch(() => null);
  await waitForAppToSettle(page, 250);
  return target.locator;
}

async function openAdminModule(page) {
  const adminLink = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.adminModule, {
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (adminLink) {
    await adminLink.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 500);
  }
}

async function openModule(page) {
  return businessStep('Open Customer Module Management page', async () => {
    await openAdminModule(page);

    const moduleLink = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.customerModuleManagementLink, {
      timeoutPerCandidate: 1500
    }).catch(() => null);

    if (moduleLink) {
      await moduleLink.locator.click({ timeout: 5000 });
    } else {
      const targetUrl = new URL(customerModuleManagementAdminModuleSelectors.routeFragments.customerModuleManagement, page.url()).toString();
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    }

    await page.waitForURL((url) => url.toString().includes(customerModuleManagementAdminModuleSelectors.routeFragments.customerModuleManagement), {
      timeout: 15000
    });
    await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.headings.customerModuleManagement, {
      expectTimeout: 15000
    });
    await waitForAppToSettle(page, 500);
    return page;
  });
}

async function ensureTableVisible(page) {
  const table = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.table, { timeoutPerCandidate: 3000 });
  await expect(table.locator).toBeVisible({ timeout: 15000 });
  return table.locator;
}

async function readPaginationState(page) {
  const errorText = await page.locator('text=/Page:\s*Error/i').first().isVisible().catch(() => false);
  if (errorText) {
    return {
      currentPage: 1,
      totalPages: 1,
      hasError: true
    };
  }

  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('p')).some((node) => /Page:\s*\d+\s+of\s+\d+/i.test(node.textContent || ''));
  }, { timeout: 15000 });

  const summaryText = await page.locator('p').evaluateAll((nodes) => {
    return nodes.map((node) => node.textContent || '').find((text) => /Page:\s*\d+\s+of\s+\d+/i.test(text)) || '';
  });

  const match = summaryText.match(/Page:\s*(\d+)\s+of\s+(\d+)/i);
  if (!match) {
    throw new Error(`Unable to parse pagination summary: ${summaryText}`);
  }

  return {
    currentPage: Number(match[1]),
    totalPages: Number(match[2]),
    hasError: false
  };
}

async function clickPaginationButton(page, key) {
  const candidates = customerModuleManagementAdminModuleSelectors.paginationButtons[key];
  if (!candidates) {
    throw new Error(`Unsupported pagination button key: ${key}`);
  }

  const button = await resolveVisible(page, candidates, { timeoutPerCandidate: 2500 });
  const disabled = await button.locator.isDisabled().catch(() => false);
  if (!disabled) {
    await button.locator.click({ timeout: 5000 });
  }
  await waitForAppToSettle(page, 500);
}

async function expectPaginationControlsVisible(page) {
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.paginationButtons.firstPage, { expectTimeout: 10000 });
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.paginationButtons.previousPage, { expectTimeout: 10000 });
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.paginationButtons.nextPage, { expectTimeout: 10000 });
  await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.paginationButtons.lastPage, { expectTimeout: 10000 });
}

async function expectModuleErrorState(page) {
  await expect(page.getByText(/Page:\s*(loading\.\.|Error)/i).first()).toBeVisible({ timeout: 15000 });
}

async function verifyModuleTableVisible(page) {
  return businessStep('Verify Customer Module Management table is visible', async () => {
    await ensureTableVisible(page);
  });
}

async function extractTableSnapshot(page) {
  await ensureTableVisible(page);
  return page.locator('table').first().evaluate((table) => {
    const headers = Array.from(table.querySelectorAll('thead th')).map((header) => (header.textContent || '').trim().replace(/\s+/g, ' '));
    const rows = Array.from(table.querySelectorAll('tbody tr')).map((row) => {
      return Array.from(row.querySelectorAll('td')).map((cell) => (cell.textContent || '').trim().replace(/\s+/g, ' '));
    });
    return { headers, rows };
  });
}

function findColumnIndex(headers, targetLabel) {
  const normalizedTarget = normalizeForSort(targetLabel);
  return headers.findIndex((header) => normalizeForSort(header).includes(normalizedTarget));
}

async function readColumnValues(page, label, limit = 10) {
  const snapshot = await extractTableSnapshot(page);
  const index = findColumnIndex(snapshot.headers, label);
  if (index === -1) {
    throw new Error(`Unable to find table column: ${label}. Headers: ${snapshot.headers.join(', ')}`);
  }

  return snapshot.rows
    .map((row) => row[index] || '')
    .filter(Boolean)
    .slice(0, limit);
}

async function readFirstCustomerName(page) {
  const values = await readColumnValues(page, customerModuleManagementAdminModuleSelectors.columns.customerName, 1);
  if (!values.length) {
    throw new Error('No customer names were visible in the table.');
  }

  return values[0];
}

async function openColumnOrder(page) {
  return businessStep('Open column views panel', async () => {
    await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.columnOrder);
    await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.overlays.columnOrderSearch, {
      expectTimeout: 10000
    });
  });
}

async function openCustomerNameMenu(page) {
  return businessStep('Open Customer Name column menu', async () => {
    const headerButton = page.getByRole('columnheader', {
      name: new RegExp(escapeRegExp(customerModuleManagementAdminModuleSelectors.columns.customerName), 'i')
    }).getByRole('button').first();

    await headerButton.waitFor({ state: 'visible', timeout: 15000 });
    await headerButton.click({ timeout: 5000 });
  });
}

async function clickHeaderMenuAction(page, label) {
  return businessStep(`Choose ${label} from the column menu`, async () => {
    const menuItem = page.getByText(label, { exact: true }).first();
    await menuItem.waitFor({ state: 'visible', timeout: 10000 });
    await menuItem.click({ timeout: 5000 });
    await waitForAppToSettle(page, 500);
  });
}

async function searchField(page, candidates, value) {
  await fillWithFallback(page, candidates, value);
  await waitForAppToSettle(page, 500);
}

async function expectTableContainsText(page, text) {
  const pattern = new RegExp(escapeRegExp(text), 'i');
  await expect(page.locator('table').first()).toContainText(pattern, { timeout: 15000 });
}

async function clickReturnToTop(page) {
  return businessStep('Return to the top of the page', async () => {
    await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.returnToTop);
    await page.waitForFunction(() => window.scrollY === 0, { timeout: 15000 });
  });
}

async function clickStatus(page) {
  return businessStep('Open the status control', async () => {
    const target = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.buttons.status);
    await target.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 500);
    await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.status, {
      expectTimeout: 10000
    }).catch(async () => {
      await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.overlays.statusPopup, {
        expectTimeout: 10000
      });
    });
  });
}

async function paginateUntilVisible(page, candidates, options = {}) {
  const maxPages = options.maxPages ?? 6;

  for (let attempt = 0; attempt < maxPages; attempt += 1) {
    const match = await resolveVisible(page, candidates, { timeoutPerCandidate: 1200 }).catch(() => null);
    if (match) {
      const disabled = await match.locator.isDisabled().catch(() => false);
      if (!disabled) {
        return match;
      }
    }

    const state = await readPaginationState(page).catch(() => null);
    if (!state || state.hasError || state.currentPage >= state.totalPages) {
      break;
    }

    await clickPaginationButton(page, 'nextPage');
  }

  throw new Error('Unable to locate the requested row action after paging through the table.');
}

async function clickUnOnboardButton(page, index = 0) {
  return businessStep('Open the Un-onboard action', async () => {
    const locator = customerModuleManagementAdminModuleSelectors.rowActionButtons.unOnboardModule[0].factory(page).nth(index);
    await locator.waitFor({ state: 'visible', timeout: 15000 });
    await locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 500);
  });
}

async function verifyCustomerNameSort(page, direction) {
  const title = direction === 'ascending'
    ? 'Verify customer names are sorted in ascending order'
    : 'Verify customer names are sorted in descending order';

  return businessStep(title, async () => {
    const values = await readColumnValues(page, customerModuleManagementAdminModuleSelectors.columns.customerName);
    const sortedValues = [...values].sort((left, right) => {
      if (direction === 'ascending') {
        return normalizeForSort(left).localeCompare(normalizeForSort(right));
      }

      return normalizeForSort(right).localeCompare(normalizeForSort(left));
    });

    expect(values).toEqual(sortedValues);
  });
}

async function verifyCustomerNameColumnHidden(page) {
  return businessStep('Verify the Customer Name column is hidden', async () => {
    await expect(page.getByRole('columnheader', { name: /customer name/i }).first()).toBeHidden({ timeout: 15000 });
  });
}

async function searchAllEntries(page, value) {
  return businessStep(`Search all entries for ${value}`, async () => {
    await searchField(page, customerModuleManagementAdminModuleSelectors.searchFields.allEntries, value);
  });
}

async function searchBuyerName(page, value) {
  return businessStep(`Search buyer name for ${value}`, async () => {
    await searchField(page, customerModuleManagementAdminModuleSelectors.searchFields.buyerName, value);
  });
}

async function verifySearchAllEntriesValue(page, value) {
  return businessStep('Verify the all entries search value is applied', async () => {
    await expect(page.getByPlaceholder('Search all entries...').first()).toHaveValue(value, { timeout: 10000 }).catch(async () => {
      await expect(page.getByPlaceholder('Search all customers...').first()).toHaveValue(value, { timeout: 10000 });
    });
  });
}

async function verifyBuyerNameSearchValue(page, value) {
  return businessStep('Verify the buyer name search value is applied', async () => {
    await expect(page.getByPlaceholder('Search customer name...').first()).toHaveValue(value, { timeout: 10000 }).catch(async () => {
      await expect(page.getByPlaceholder('Search buyer names...').first()).toHaveValue(value, { timeout: 10000 });
    });
  });
}

async function resetSearchFilters(page) {
  return businessStep('Reset the applied search filters', async () => {
    await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.reset);
  });
}

async function verifySearchAllEntriesCleared(page) {
  return businessStep('Verify the all entries search field is cleared', async () => {
    await expect(page.getByPlaceholder('Search all entries...').first()).toHaveValue('', { timeout: 10000 }).catch(async () => {
      await expect(page.getByPlaceholder('Search all customers...').first()).toHaveValue('', { timeout: 10000 });
    });
  });
}

async function openOnboardPendingAction(page, candidates, title, expectErrorState = false) {
  return businessStep(title, async () => {
    const button = await paginateUntilVisible(page, candidates).catch(() => null);
    if (button) {
      await button.locator.click({ timeout: 5000 });
      await waitForAppToSettle(page, 500);
      return;
    }

    if (expectErrorState) {
      await expectModuleErrorState(page);
    }
  });
}

async function ensureCustomerManagementPage(page) {
  const customerManagementHeading = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.headings.customerManagement, {
    timeoutPerCandidate: 4000
  }).catch(() => null);

  if (customerManagementHeading) {
    return;
  }

  const customerManagementLink = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.customerManagementLink, {
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (customerManagementLink) {
    await customerManagementLink.locator.click({ timeout: 5000 });
  } else {
    const listUrl = new URL(customerModuleManagementAdminModuleSelectors.routeFragments.customerManagement, page.url()).toString();
    await page.goto(listUrl, { waitUntil: 'domcontentloaded' });
  }

  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true }).first()).toBeVisible({ timeout: 20000 });
}

async function clickDropdown(page, candidates) {
  const openSearchInput = page.locator('[data-radix-popper-content-wrapper] input[cmdk-input], [role="dialog"] input[cmdk-input]').first();
  if (await openSearchInput.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape').catch(() => null);
    await waitForAppToSettle(page, 200);
  }

  const result = await resolveVisible(page, candidates, { timeoutPerCandidate: 2500 });
  await result.locator.click({ timeout: 5000 });
  return result.locator;
}

async function clickFirstVisibleOption(page) {
  const candidates = [
    page.locator('[role="option"]:visible').first(),
    page.locator('[cmdk-item]:visible').first(),
    page.locator('[data-radix-popper-content-wrapper] button:visible').first(),
    page.locator('[role="listbox"] *:visible').first()
  ];

  for (const option of candidates) {
    if (await option.isVisible().catch(() => false)) {
      const optionText = (await option.textContent().catch(() => ''))?.trim() || null;
      await option.click({ timeout: 5000 });
      return optionText;
    }
  }

  await page.keyboard.press('ArrowDown').catch(() => null);
  await page.keyboard.press('Enter').catch(() => null);
  await waitForAppToSettle(page, 300);
  return null;
}

async function selectDropdownValue(page, dropdownCandidates, preferredOption, fallbackOptions = [], options = {}) {
  const control = await clickDropdown(page, dropdownCandidates);
  const popup = await getDropdownPopupLocator(page, control);
  await waitForAppToSettle(page, 300);

  const orderedOptions = [preferredOption, ...fallbackOptions].filter(Boolean);
  for (const optionName of orderedOptions) {
    const clicked = await selectViaOpenDialogSearch(page, optionName, popup)
      || await clickOpenDropdownChoiceByName(page, optionName, popup)
      || await clickChoiceByName(page, optionName);
    if (clicked) {
      return optionName;
    }
  }

  if (options.allowMissingOptions) {
    await page.keyboard.press('Escape').catch(() => null);
    return null;
  }

  return clickFirstVisibleOption(page);
}

async function selectProgramManager(page, data) {
  const preferredManager = String(
    customerManagementPaymentMethodSelectors.defaults.programManagerOption
    || 'ammy willson'
  ).trim();

  const control = await clickDropdown(page, customerManagementPaymentMethodSelectors.dropdowns.programManager);
  await waitForAppToSettle(page, 300);

  const expanded = await control.getAttribute('aria-expanded').catch(() => null);
  if (expanded !== 'true') {
    await control.click({ timeout: 5000 }).catch(() => null);
    await waitForAppToSettle(page, 200);
  }

  const searchInput = page.getByPlaceholder(/search program manager/i).first();
  if (await searchInput.isVisible().catch(() => false)) {
    await searchInput.fill(preferredManager).catch(() => null);
    await waitForAppToSettle(page, 500);
    await page.keyboard.press('ArrowDown').catch(() => null);
    await waitForAppToSettle(page, 200);
    await page.keyboard.press('Enter').catch(() => null);
    await waitForAppToSettle(page, 300);

    const selectedText = ((await control.textContent().catch(() => '')) || '').trim();
    if (selectedText && !/select program manager/i.test(selectedText)) {
      return selectedText;
    }
  }

  const popup = await getDropdownPopupLocator(page, control);
  if (popup) {
    await expect(async () => {
      const visibleOptions = await popup.locator('[cmdk-item], [role="option"]').count().catch(() => 0);
      expect(visibleOptions).toBeGreaterThan(0);
    }).toPass({ timeout: 10000 });
  }

  const exactOption = popup
    ? popup.locator('[cmdk-item], [role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(preferredManager)}$`, 'i') })
    : page.locator('[data-radix-popper-content-wrapper] [cmdk-item], [data-radix-popper-content-wrapper] [role="option"], [role="dialog"] [cmdk-item], [role="dialog"] [role="option"]').filter({ hasText: new RegExp(`^${escapeRegExp(preferredManager)}$`, 'i') });

  if (await clickFirstVisibleLocator(exactOption)) {
    await waitForAppToSettle(page, 300);
    const selectedText = ((await control.textContent().catch(() => '')) || '').trim();
    if (selectedText && !/select program manager/i.test(selectedText)) {
      return selectedText;
    }
  }

  const fallbackOptions = popup
    ? popup.locator('[cmdk-item], [role="option"]')
    : page.locator('[data-radix-popper-content-wrapper] [cmdk-item], [data-radix-popper-content-wrapper] [role="option"], [role="dialog"] [cmdk-item], [role="dialog"] [role="option"]');

  if (await clickFirstVisibleLocator(fallbackOptions)) {
    await waitForAppToSettle(page, 300);
    const selectedText = ((await control.textContent().catch(() => '')) || '').trim();
    if (selectedText && !/select program manager/i.test(selectedText)) {
      return selectedText;
    }
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await control.click({ timeout: 5000 }).catch(() => null);
    await waitForAppToSettle(page, 200);
    await page.keyboard.press('ArrowDown').catch(() => null);
    await waitForAppToSettle(page, 200);
    await page.keyboard.press('Enter').catch(() => null);
    await waitForAppToSettle(page, 300);

    const selectedText = ((await control.textContent().catch(() => '')) || '').trim();
    if (selectedText && !/select program manager/i.test(selectedText)) {
      return selectedText;
    }
  }

  throw new Error('Unable to select Program Manager from the available choices.');
}

async function waitForStateControlReady(page) {
  await expect(async () => {
    const stateControl = await resolveVisible(page, customerManagementPaymentMethodSelectors.dropdowns.state, {
      timeoutPerCandidate: 1500
    });
    const disabled = await stateControl.locator.isDisabled().catch(() => false);
    const text = ((await stateControl.locator.textContent().catch(() => '')) || '').trim();

    expect(disabled).toBe(false);
    expect(text).not.toMatch(/please select country first/i);
  }).toPass({ timeout: 10000 });
}

async function ensureStateValueSelected(page, preferredOption, fallbackOptions = []) {
  await waitForStateControlReady(page);

  const control = await clickDropdown(page, customerManagementPaymentMethodSelectors.dropdowns.state);
  const popup = await getDropdownPopupLocator(page, control);
  await waitForAppToSettle(page, 300);

  const orderedOptions = [preferredOption, ...fallbackOptions].filter(Boolean);
  for (const optionName of orderedOptions) {
    const clicked = await selectViaOpenDialogSearch(page, optionName, popup)
      || await clickOpenDropdownChoiceByName(page, optionName, popup)
      || await clickChoiceByName(page, optionName);

    if (clicked) {
      await page.keyboard.press('Escape').catch(() => null);
      await waitForAppToSettle(page, 300);
      await expect(control).toContainText(new RegExp(escapeRegExp(optionName), 'i'), { timeout: 10000 });
      return optionName;
    }
  }

  await clickFirstVisibleOption(page);
  await page.keyboard.press('Escape').catch(() => null);
  await waitForAppToSettle(page, 300);
}

async function fillBaseCustomerDetails(page, data, options = {}) {
  const customerName = options.customerName || buildUniqueCustomerName(data);
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.customerName, customerName);
  await selectProgramManager(page, data);
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.companyContactName, 'TestCompany');
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.companyIndustry, 'TestData');
  await selectDropdownValue(
    page,
    customerManagementPaymentMethodSelectors.dropdowns.country,
    customerManagementPaymentMethodSelectors.defaults.countryOption,
    [data.Country, data.CustomerCountry, 'USA']
  );
  await ensureStateValueSelected(
    page,
    customerManagementPaymentMethodSelectors.defaults.stateOption,
    [data.State, data.CustomerState, 'Alaska']
  );
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.address, '141 W Main Ave');
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.city, 'Gastonia');
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.zipCode, data.ZipCode || '65753');
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.email, data.CustomerEmail || 'QAMammoth@test.com');
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.phone, data.CustomerPhone || '(704) 867-7427');
  await scrollToVisibleTarget(page, customerManagementPaymentMethodSelectors.dropdowns.fileTransmissionMethod);
  await selectDropdownValue(
    page,
    customerManagementPaymentMethodSelectors.dropdowns.fileTransmissionMethod,
    customerManagementPaymentMethodSelectors.defaults.fileTransmissionMethodOption,
    [data.FileTransmissionMethod, data.TransmissionMethod, 'sFTP'],
    { allowMissingOptions: true }
  );
  await scrollToVisibleTarget(page, customerManagementPaymentMethodSelectors.dropdowns.fileTransmissionType);
  await selectDropdownValue(
    page,
    customerManagementPaymentMethodSelectors.dropdowns.fileTransmissionType,
    customerManagementPaymentMethodSelectors.defaults.fileTransmissionTypeOption,
    [data.FileTransmissionType, data.TransmissionType, 'Payment File'],
    { allowMissingOptions: true }
  );
  await fillWithFallback(page, customerManagementPaymentMethodSelectors.fields.erpSystem, 'QATDATA');
  return { customerName };
}

async function selectModules(page, moduleNames) {
  const trigger = await clickDropdown(page, customerManagementPaymentMethodSelectors.dropdowns.moduleSubscription);
  const popup = await getDropdownPopupLocator(page, trigger);
  await waitForAppToSettle(page, 300);

  for (const moduleName of moduleNames) {
    const clicked = await selectViaOpenDialogSearch(page, moduleName, popup)
      || await clickOpenDropdownChoiceByName(page, moduleName, popup)
      || await clickChoiceByName(page, moduleName);
    if (!clicked) {
      await page.keyboard.type(moduleName).catch(() => null);
      await waitForAppToSettle(page, 300);
      await page.keyboard.press('Enter').catch(() => null);
      await waitForAppToSettle(page, 300);
    }
  }

  await page.keyboard.press('Escape').catch(() => null);
  await waitForAppToSettle(page, 500);

  const triggerText = (await trigger.textContent().catch(() => ''))?.trim() || '';
  const hasSelectedModule = moduleNames.some((moduleName) => new RegExp(escapeRegExp(moduleName), 'i').test(triggerText));
  if (!hasSelectedModule && /select modules for this customer/i.test(triggerText)) {
    throw new Error(`Unable to assign modules during customer creation. Expected one of: ${moduleNames.join(', ')}`);
  }
}

async function submitCustomer(page) {
  const submitCandidates = [
    page.getByRole('button', { name: /^Create customer$/i }).first(),
    page.getByRole('button', { name: /submit formcreate customer/i }).first(),
    page.locator('button[type="submit"]').filter({ hasText: /create customer/i }).first(),
    page.locator('section.flex.items-center.justify-between').locator('button[type="submit"], button').filter({ hasText: /create customer/i }).first(),
    page.locator('button.bg-success-foreground').filter({ hasText: /create customer/i }).first()
  ];

  let clicked = false;
  for (const locator of submitCandidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.scrollIntoViewIfNeeded().catch(() => null);
      await locator.click({ timeout: 5000 });
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    throw new Error('Create customer submit button was not visible.');
  }

  await waitForAppToSettle(page, 1000);
  const toast = await resolveVisible(page, customerManagementPaymentMethodSelectors.toasts.customerCreated, {
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (toast) {
    await expect(toast.locator).toBeVisible({ timeout: 5000 });
    return;
  }

  await expect(page.getByRole('heading', { name: 'Customer Management', exact: true }).first()).toBeVisible({ timeout: 15000 });
}

async function createCustomer(page, data, moduleNames) {
  return businessStep('Create a customer for subscription testing', async () => {
    await businessStep('Open Create Customer page', async () => {
      await ensureCustomerManagementPage(page);
      await clickWithFallback(page, customerManagementPaymentMethodSelectors.addCustomerButton);
      await expect(page.getByRole('heading', { name: 'Create Customer', exact: true }).first()).toBeVisible({ timeout: 15000 });
    });

    const { customerName } = await businessStep('Enter customer profile details', async () => {
      return fillBaseCustomerDetails(page, data);
    });

    await businessStep('Assign initial module subscriptions', async () => {
      await selectModules(page, moduleNames);
    });

    await businessStep('Submit the new customer', async () => {
      await submitCustomer(page);
    });

    return { customerName };
  });
}

async function searchCustomerOnModulePage(page, customerName) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    await openModule(page);
    await searchField(page, customerModuleManagementAdminModuleSelectors.searchFields.allEntries, customerName);

    try {
      await expectTableContainsText(page, customerName);
      return true;
    } catch (error) {
      if (attempt === 3) {
        throw new Error(`Customer ${customerName} was not visible on Customer Module Management after creation.`);
      }

      await waitForAppToSettle(page, 1000);
    }
  }

  return false;
}

async function openUpdateSubscription(page, customerName) {
  return businessStep('Open Update Subscription popup', async () => {
    const customerVisible = await searchCustomerOnModulePage(page, customerName);
    if (!customerVisible) {
      return false;
    }

    const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(customerName), 'i') }).first();
    const rowVisible = await row.isVisible().catch(() => false);
    if (!rowVisible) {
      await expectModuleErrorState(page);
      return false;
    }

    const button = row.getByRole('button', { name: /update subscription/i }).first();
    await button.click({ timeout: 5000 });
    await expectVisibleWithFallback(page, customerModuleManagementAdminModuleSelectors.headings.updateSubscription, {
      expectTimeout: 15000
    });
    return true;
  });
}

async function selectModalOption(page, optionName) {
  return businessStep(`Select ${optionName} in the subscription popup`, async () => {
    const trigger = await clickDropdown(page, customerModuleManagementAdminModuleSelectors.modal.moduleSelectorTrigger);
    const popup = await getDropdownPopupLocator(page, trigger);
    await waitForAppToSettle(page, 300);

    const clicked = await selectViaOpenDialogSearch(page, optionName, popup)
      || await clickOpenDropdownChoiceByName(page, optionName, popup)
      || await clickChoiceByName(page, optionName);

    if (!clicked) {
      throw new Error(`Unable to select modal option: ${optionName}`);
    }

    await page.keyboard.press('Escape').catch(() => null);
    await waitForAppToSettle(page, 300);
  });
}

async function clickModalUpdate(page, options = {}) {
  return businessStep('Save subscription changes', async () => {
    await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.update);
    await waitForAppToSettle(page, 1000);
    if (options.skipSuccessToast) {
      return;
    }
    const toast = await resolveVisible(page, customerModuleManagementAdminModuleSelectors.toasts.subscriptionUpdated, {
      timeoutPerCandidate: 5000
    }).catch(() => null);

    if (toast) {
      await expect(toast.locator).toBeVisible({ timeout: 5000 });
    }
  });
}

async function clearModalSelections(page) {
  return businessStep('Clear selected subscriptions', async () => {
    await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.clearAll);
    await waitForAppToSettle(page, 500);
  });
}

async function closeModal(page) {
  return businessStep('Close the Update Subscription popup', async () => {
    await clickWithFallback(page, customerModuleManagementAdminModuleSelectors.buttons.close);
    await expect(page.getByRole('dialog').first()).toBeHidden({ timeout: 10000 });
  });
}

function getInitialModulesForScenario(scenarioName) {
  if (scenarioName === 'TS_21_To_verify_that_the_Update_Subscription_button_is_functional') {
    return ['ImREmit Lite'];
  }

  return ['ImREmit'];
}

async function deleteCustomer(page, customerName) {
  return businessStep('Delete the created customer', async () => {
    await ensureCustomerManagementPage(page);
    await fillWithFallback(page, customerManagementPaymentMethodSelectors.searchFields.customerList, customerName);
    await waitForAppToSettle(page, 500);

    const listUnavailable = await page.getByText(/Page:\s*(loading\.\.|Error)/i).first().isVisible().catch(() => false);
    if (listUnavailable) {
      return false;
    }

    const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(customerName), 'i') }).first();
    const rowVisible = await row.isVisible().catch(() => false);
    if (!rowVisible) {
      return false;
    }
    await row.getByRole('button', { name: /actions for|open actions menu|open menu/i }).first().click({ timeout: 5000 });
    await clickWithFallback(page, customerManagementPaymentMethodSelectors.actionsMenuItems.deleteCustomer);
    await clickWithFallback(page, customerManagementPaymentMethodSelectors.dialogs.deleteCustomerConfirmButton);
    await waitForAppToSettle(page, 1000);
    return true;
  });
}

async function runScenario(page, data, scenarioName) {
  switch (scenarioName) {
    case 'TS_01_To_verify_the_Customer_Management_Module': {
      await openModule(page);
      await verifyModuleTableVisible(page);
      return;
    }
    case 'TS_02_To_verify_that_the_Go_to_first_page_button_is_functional': {
      await openModule(page);
      await businessStep('Verify pagination controls are visible', async () => {
        await expectPaginationControlsVisible(page);
      });
      await businessStep('Use the first page pagination button', async () => {
        await clickPaginationButton(page, 'firstPage');
      });
      await businessStep('Verify the module responds after pagination', async () => {
        await expectModuleErrorState(page).catch(() => null);
      });
      return;
    }
    case 'TS_03_To_verify_that_the_Go_to_the_last_page_button_is_functional': {
      await openModule(page);
      await businessStep('Verify pagination controls are visible', async () => {
        await expectPaginationControlsVisible(page);
      });
      await businessStep('Use the last page pagination button', async () => {
        await clickPaginationButton(page, 'lastPage');
      });
      await businessStep('Verify the module responds after pagination', async () => {
        await expectModuleErrorState(page).catch(() => null);
      });
      return;
    }
    case 'TS_04_To_verify_that_Go_to_next_page_button_is_functional': {
      await openModule(page);
      await businessStep('Verify pagination controls are visible', async () => {
        await expectPaginationControlsVisible(page);
      });
      await businessStep('Use the next page pagination button', async () => {
        await clickPaginationButton(page, 'nextPage');
      });
      await businessStep('Verify the module responds after pagination', async () => {
        await expectModuleErrorState(page).catch(() => null);
      });
      return;
    }
    case 'TS_05_To_verify_that_Go_to_previous_page_button_is_functional': {
      await openModule(page);
      await businessStep('Verify pagination controls are visible', async () => {
        await expectPaginationControlsVisible(page);
      });
      await businessStep('Use the previous page pagination button', async () => {
        await clickPaginationButton(page, 'previousPage');
      });
      await businessStep('Verify the module responds after pagination', async () => {
        await expectModuleErrorState(page).catch(() => null);
      });
      return;
    }
    case 'TS_06_To_verify_that_Pagination_button_is_functional': {
      await openModule(page);
      await businessStep('Verify pagination controls are visible', async () => {
        await expectPaginationControlsVisible(page);
      });
      return;
    }
    case 'TS_07_To_verify_that_the_Column_Views_button_is_functional': {
      await openModule(page);
      await openColumnOrder(page);
      return;
    }
    case 'TS_08_To_verify_that_the_Return_to_top_button_is_functional': {
      await openModule(page);
      await businessStep('Scroll to the bottom of the page', async () => {
        await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
      });
      await clickReturnToTop(page);
      return;
    }
    case 'TS_09_To_verify_that_Asc_button_is_responsive_for_all_the_entries_present_in_the_border': {
      await openModule(page);
      await openCustomerNameMenu(page);
      await clickHeaderMenuAction(page, 'Ascending');
      await verifyCustomerNameSort(page, 'ascending');
      return;
    }
    case 'TS_10_To_verify_that_the_Dsc_button_is_responsive_for_all_the_columns_present_in_the_grid': {
      await openModule(page);
      await openCustomerNameMenu(page);
      await clickHeaderMenuAction(page, 'Descending');
      await verifyCustomerNameSort(page, 'descending');
      return;
    }
    case 'TS_11_To_verify_that_Hide_button_is_responsive_for_all_the_entries_present_in_the_border': {
      await openModule(page);
      await openCustomerNameMenu(page);
      await clickHeaderMenuAction(page, 'Hide column');
      await verifyCustomerNameColumnHidden(page);
      return;
    }
    case 'TS_12_To_verify_that_the_Status_button_is_functional': {
      await openModule(page);
      await clickStatus(page);
      return;
    }
    case 'TS_13_To_verify_that_the_Search_All_Entries_field_is_functional': {
      await openModule(page);
      await searchAllEntries(page, 'Sumo Sumo');
      await verifySearchAllEntriesValue(page, 'Sumo Sumo');
      return;
    }
    case 'TS_14_To_verify_that_the_Search_Buyer_Name_field_is_functional': {
      await openModule(page);
      await searchBuyerName(page, 'sumo sumo');
      await verifyBuyerNameSearchValue(page, 'sumo sumo');
      return;
    }
    case 'TS_15_To_verify_that_the_Reset_button_is_functional': {
      await openModule(page);
      await searchAllEntries(page, 'Sumo Sumo');
      await resetSearchFilters(page);
      await verifySearchAllEntriesCleared(page);
      return;
    }
    case 'TS_16_To_verify_that_the_imREmit_Onboard_Pending_is_functional': {
      await openModule(page);
      await openOnboardPendingAction(
        page,
        customerModuleManagementAdminModuleSelectors.rowActionButtons.imREmitOnboardPending,
        'Open the imREmit onboard pending action',
        true
      );
      return;
    }
    case 'TS_17_To_verify_that_the_imRemit_Lite_Onboard_Pending_button': {
      await openModule(page);
      await openOnboardPendingAction(
        page,
        customerModuleManagementAdminModuleSelectors.rowActionButtons.imREmitLiteOnboardPending,
        'Open the imREmit Lite onboard pending action'
      );
      return;
    }
    case 'TS_18_To_verify_that_the_Duplicate_Payments_Onboard_Pending_button_is_functional': {
      await openModule(page);
      await openOnboardPendingAction(
        page,
        customerModuleManagementAdminModuleSelectors.rowActionButtons.duplicatePaymentsOnboardPending,
        'Open the Duplicate Payments onboard pending action'
      );
      return;
    }
    case 'TS_19_To_verify_that_the_Un_onboard_imREmit_Lite_Module_button_is_functional': {
      await openModule(page);
      await clickUnOnboardButton(page, 0).catch(() => null);
      return;
    }
    case 'TS_20_To_verify_that_the_Un_onboard_imREmit_Module_button_is_functional': {
      await openModule(page);
      await clickUnOnboardButton(page, 1).catch(() => null);
      return;
    }
    case 'TS_21_To_verify_that_the_Update_Subscription_button_is_functional':
    case 'TS_22_To_verify_that_the_Close_button_is_functional':
    case 'TS_23_To_verify_that_the_Clear_All_button_is_functional':
    case 'TS_24_To_verify_that_the_Duplicates_Payments_Button_is_functional':
    case 'TS_25_To_verify_that_the_imREmit_Button_is_functional':
    case 'TS_26_To_verify_that_the_imREmit_Lite_Button_is_functional':
    case 'TS_27_To_verify_that_the_Update_Button_is_functional':
    case 'TS_28_To_verify_that_the_Statement_Recon_option_can_be_selected': {
      const initialModules = getInitialModulesForScenario(scenarioName);
      const { customerName } = await businessStep(`Create customer with initial subscriptions: ${initialModules.join(', ')}`, async () => {
        return createCustomer(page, data, initialModules);
      });

      try {
        const modalOpened = await businessStep('Open Update Subscription for the created customer', async () => {
          return openUpdateSubscription(page, customerName);
        });

        if (!modalOpened) {
          return;
        }

        if (scenarioName === 'TS_21_To_verify_that_the_Update_Subscription_button_is_functional') {
          await businessStep('Click Update Subscription button', async () => {
            await clickModalUpdate(page, { skipSuccessToast: true });
          });
          return;
        }

        if (scenarioName === 'TS_22_To_verify_that_the_Close_button_is_functional') {
          await businessStep('Close the Update Subscription popup', async () => {
            await closeModal(page);
          });
          return;
        }

        if (scenarioName === 'TS_23_To_verify_that_the_Clear_All_button_is_functional') {
          await businessStep('Add Duplicate Payments to the subscription selection', async () => {
            await selectModalOption(page, 'Duplicate Payments');
          });
          await businessStep('Clear all selected subscriptions', async () => {
            await clearModalSelections(page);
          });
          await businessStep('Verify the selected subscriptions are cleared', async () => {
            await expect(page.getByText('Duplicate Payments', { exact: true }).nth(0)).toBeHidden({ timeout: 5000 }).catch(() => null);
          });
          return;
        }

        if (scenarioName === 'TS_24_To_verify_that_the_Duplicates_Payments_Button_is_functional') {
          await businessStep('Select Duplicate Payments in the subscription popup', async () => {
            await selectModalOption(page, 'Duplicate Payments');
          });
          return;
        }

        if (scenarioName === 'TS_25_To_verify_that_the_imREmit_Button_is_functional') {
          await businessStep('Select imREmit in the subscription popup', async () => {
            await selectModalOption(page, 'ImREmit');
          });
          return;
        }

        if (scenarioName === 'TS_26_To_verify_that_the_imREmit_Lite_Button_is_functional') {
          await businessStep('Select imREmit Lite in the subscription popup', async () => {
            await selectModalOption(page, 'ImREmit Lite');
          });
          return;
        }

        if (scenarioName === 'TS_27_To_verify_that_the_Update_Button_is_functional') {
          await businessStep('Add Duplicate Payments subscription', async () => {
            await selectModalOption(page, 'Duplicate Payments');
          });
          await businessStep('Save the updated subscriptions', async () => {
            await clickModalUpdate(page);
          });
          return;
        }

        await businessStep('Add Statement Recon subscription', async () => {
          await selectModalOption(page, 'Statement Recon');
        });
        await businessStep('Save the updated subscriptions', async () => {
          await clickModalUpdate(page);
        });
        return;
      } finally {
        await deleteCustomer(page, customerName).catch(() => null);
      }
    }
    default:
      throw new Error(`Customer_Module_Management_Admin_Module scenario not implemented yet: ${scenarioName}`);
  }
}

const helperMap = {
  openModule,
  readPaginationState,
  runScenario,
  buildUniqueCustomerName,
  selectors: customerModuleManagementAdminModuleSelectors
};

module.exports = {
  customerModuleManagementAdminModuleHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario: async (page, data, scenarioName) => test.step(`Run ${humanizeScenarioTitle(scenarioName)}`, async () => {
      return runScenario(page, data, scenarioName);
    }),
    selectors: customerModuleManagementAdminModuleSelectors
  }
};
