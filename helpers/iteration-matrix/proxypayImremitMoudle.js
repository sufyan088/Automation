const { expect, test } = require('@playwright/test');
const { clickIfFound, clickWithFallback, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { proxypayImremitMoudleSelectors } = require('../../selectors/iteration-matrix/proxypayImremitMoudle.selectors.js');

const DEFAULT_CUSTOMER = 'Verizon Customer';
const UPDATED_DATE_LABEL = 'Updated Date';
const DATE_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;

async function reportStep(name, action) {
  return test.step(name, action);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseDateValue(value) {
  const trimmed = String(value || '').trim();
  if (!DATE_PATTERN.test(trimmed)) {
    return Number.NaN;
  }

  const [month, day, year] = trimmed.split('/').map((part) => Number(part));
  return new Date(year, month - 1, day).getTime();
}

async function openModule(page) {
  await clickIfFound(page, proxypayImremitMoudleSelectors.moduleTabs.imremit, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
  return page;
}

async function openProxyPayDashboard(page) {
  await clickWithFallback(page, proxypayImremitMoudleSelectors.moduleTabs.proxyPayDashboard, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function selectCustomer(page, data) {
  const preferredCustomer = DEFAULT_CUSTOMER;
  const fallbackCustomer = data.CustomerName || data.Customer || data.Customer_Name || '';
  const desiredCustomer = preferredCustomer || fallbackCustomer;

  const trigger = await resolveFirst(page, proxypayImremitMoudleSelectors.customerPicker.trigger, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (!trigger || !desiredCustomer) {
    return null;
  }

  const triggerText = ((await trigger.locator.textContent()) || '').trim();
  if (new RegExp(escapeRegExp(desiredCustomer), 'i').test(triggerText)) {
    return desiredCustomer;
  }

  await trigger.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);

  const searchInput = await resolveFirst(page, proxypayImremitMoudleSelectors.customerPicker.searchInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (searchInput) {
    await fillWithFallback(page, proxypayImremitMoudleSelectors.customerPicker.searchInput, desiredCustomer, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await waitForAppToSettle(page, 750);
  }

  const option = page.getByRole('option', { name: new RegExp(escapeRegExp(desiredCustomer), 'i') }).first();
  if (await option.isVisible().catch(() => false)) {
    await option.click({ timeout: 5000 });
    await waitForAppToSettle(page, 1000);
    return desiredCustomer;
  }

  const textOption = page.getByText(new RegExp(`^${escapeRegExp(desiredCustomer)}$`, 'i')).first();
  await expect(textOption).toBeVisible({ timeout: 10000 });
  await textOption.click({ timeout: 5000 });
  await waitForAppToSettle(page, 1000);
  return desiredCustomer;
}

async function expectProxyPayWorkspaceVisible(page) {
  const updatedDateHeader = await resolveFirst(page, proxypayImremitMoudleSelectors.headings.updatedDate, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(updatedDateHeader.locator).toBeVisible({ timeout: 10000 });
}

async function openProxyPayWorkspace(page, data) {
  await openModule(page);
  await openProxyPayDashboard(page);
  await selectCustomer(page, data);
  await expectProxyPayWorkspaceVisible(page);
}

async function clickResolvedLocator(locator) {
  await locator.scrollIntoViewIfNeeded().catch(() => null);

  try {
    await locator.click({ timeout: 10000 });
  } catch (error) {
    if (!/intercepts pointer events|outside of the viewport/i.test(error.message)) {
      throw error;
    }

    await locator.evaluate((element) => element.click());
  }
}

async function clickHeaderAndChoose(page, label, actionCandidates) {
  const header = await resolveFirst(page, proxypayImremitMoudleSelectors.table.header(label), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await clickResolvedLocator(header.locator);
  await waitForAppToSettle(page, 500);

  const menuAction = await resolveFirst(page, actionCandidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (menuAction) {
    await menuAction.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 750);
    return;
  }

  const updatedHeader = await resolveFirst(page, proxypayImremitMoudleSelectors.table.header(label), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  const headerText = ((await updatedHeader.locator.textContent()) || '').trim();
  const ariaLabel = ((await updatedHeader.locator.getAttribute('aria-label')) || '').trim();

  if (/current sort:\s*(ascending|descending)/i.test(`${headerText} ${ariaLabel}`)) {
    return;
  }

  await clickResolvedLocator(updatedHeader.locator);
  await waitForAppToSettle(page, 750);
}

async function getUpdatedDateColumnIndex(page) {
  const headers = page.locator('table thead tr th');
  const total = await headers.count();

  for (let index = 0; index < total; index += 1) {
    const text = ((await headers.nth(index).textContent().catch(() => '')) || '').trim();
    if (/updated date/i.test(text)) {
      return index + 1;
    }
  }

  throw new Error('Updated Date header was not found in the Proxy Pay Dashboard table.');
}

async function getUpdatedDateTexts(page) {
  const columnIndex = await getUpdatedDateColumnIndex(page);
  const cells = page.locator(`table tbody tr td:nth-child(${columnIndex})`);
  const count = await cells.count();
  const values = [];

  for (let index = 0; index < count; index += 1) {
    const cell = cells.nth(index);
    if (!(await cell.isVisible().catch(() => false))) {
      continue;
    }

    const text = ((await cell.textContent().catch(() => '')) || '').trim();
    if (text) {
      values.push(text);
    }
  }

  return values;
}

async function expectUpdatedDateColumnVisible(page) {
  const header = await resolveFirst(page, proxypayImremitMoudleSelectors.headings.updatedDate, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(header.locator).toBeVisible({ timeout: 10000 });
}

async function expectUpdatedDateColumnHidden(page) {
  const headerButton = page.getByRole('button', { name: /updated date/i }).first();
  const headerText = page.getByText(/^updated date$/i).first();
  await expect(headerButton.or(headerText)).toBeHidden({ timeout: 10000 });
}

async function expectUpdatedDateFormat(page) {
  const values = await getUpdatedDateTexts(page);
  expect(values.length).toBeGreaterThan(0);
  for (const value of values) {
    expect(value).toMatch(DATE_PATTERN);
  }
}

async function expectUpdatedDateSorted(page, direction) {
  const values = await getUpdatedDateTexts(page);
  expect(values.length).toBeGreaterThan(1);
  const parsed = values.map(parseDateValue);
  for (const value of parsed) {
    expect(Number.isNaN(value)).toBeFalsy();
  }

  const sorted = [...parsed].sort((left, right) => direction === 'asc' ? left - right : right - left);
  expect(parsed).toEqual(sorted);
}

async function openColumnVisibilityMenu(page) {
  await clickWithFallback(page, proxypayImremitMoudleSelectors.list.toggleColumnVisibility, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);
}

async function expectColumnOptionVisible(page, label) {
  const option = await resolveFirst(page, proxypayImremitMoudleSelectors.table.columnOption(label), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(option.locator).toBeVisible({ timeout: 10000 });
  return option.locator;
}

async function expectColumnOptionChecked(page, label) {
  const option = await expectColumnOptionVisible(page, label);
  const rowCandidates = [
    option.locator('xpath=ancestor::*[self::label or self::button or self::div][1]').first(),
    option.locator('xpath=ancestor::*[self::label or self::button or self::div][2]').first(),
    page
      .locator('[data-radix-popper-content-wrapper], [role="menu"]')
      .locator('label, [role="menuitemcheckbox"], button, div')
      .filter({ hasText: new RegExp(`^${escapeRegExp(label)}$`, 'i') })
      .first()
  ];

  for (const row of rowCandidates) {
    if (!(await row.isVisible().catch(() => false))) {
      continue;
    }

    const checkboxLike = row.locator('input[type="checkbox"], [role="checkbox"], [role="menuitemcheckbox"], [data-state], button').first();
    if (await checkboxLike.count().catch(() => 0)) {
      const dataState = await checkboxLike.getAttribute('data-state').catch(() => null);
      const ariaChecked = await checkboxLike.getAttribute('aria-checked').catch(() => null);
      const checked = await checkboxLike.isChecked?.().catch(() => false);
      const markup = await row.evaluate((element) => element.outerHTML).catch(() => '');
      if (dataState === 'checked' || ariaChecked === 'true' || checked || /data-state="checked"|aria-checked="true"|lucide-check/i.test(markup)) {
        return;
      }
    }
  }

  const optionMarkup = await option.locator('xpath=ancestor::*[self::label or self::button or self::div][1]').first().evaluate((element) => element.outerHTML).catch(() => '');
  expect(/data-state="checked"|aria-checked="true"|lucide-check/i.test(optionMarkup)).toBeTruthy();
}

async function runTs62(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Verify Updated Date values use MM/DD/YYYY format for visible payment rows', async () => {
    await expectUpdatedDateFormat(page);
  });
}

async function runTs63(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Verify the Updated Date column is shown in the data table', async () => {
    await expectUpdatedDateColumnVisible(page);
  });
}

async function runTs64(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Apply ascending sort on the Updated Date column', async () => {
    await clickHeaderAndChoose(page, UPDATED_DATE_LABEL, proxypayImremitMoudleSelectors.menus.ascending);
  });
  await reportStep('Verify Updated Date values are sorted in ascending order', async () => {
    await expectUpdatedDateSorted(page, 'asc');
  });
}

async function runTs65(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Apply descending sort on the Updated Date column', async () => {
    await clickHeaderAndChoose(page, UPDATED_DATE_LABEL, proxypayImremitMoudleSelectors.menus.descending);
  });
  await reportStep('Verify Updated Date values are sorted in descending order', async () => {
    await expectUpdatedDateSorted(page, 'desc');
  });
}

async function runTs66(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Hide the Updated Date column from the column header menu', async () => {
    await clickHeaderAndChoose(page, UPDATED_DATE_LABEL, proxypayImremitMoudleSelectors.menus.hideColumn);
  });
  await reportStep('Verify the Updated Date column is hidden from the table', async () => {
    await expectUpdatedDateColumnHidden(page);
  });
}

async function runTs67(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Open the column visibility menu', async () => {
    await openColumnVisibilityMenu(page);
  });
  await reportStep('Verify Updated Date is listed as a column visibility option', async () => {
    await expectColumnOptionVisible(page, UPDATED_DATE_LABEL);
  });
}

async function runTs68(page, data) {
  await reportStep('Open Proxy Pay Dashboard for the selected customer', async () => {
    await openProxyPayWorkspace(page, data);
  });
  await reportStep('Open the column visibility menu', async () => {
    await openColumnVisibilityMenu(page);
  });
  await reportStep('Verify Updated Date is checked by default in the column visibility menu', async () => {
    await expectColumnOptionChecked(page, UPDATED_DATE_LABEL);
  });
}

const scenarioMap = {
  TS_62: runTs62,
  TS_63: runTs63,
  TS_64: runTs64,
  TS_65: runTs65,
  TS_66: runTs66,
  TS_67: runTs67,
  TS_68: runTs68
};

async function runScenario(page, data, testTitle) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => testTitle.includes(key));
  if (!scenarioKey) {
    throw new Error(`Unsupported scenario for ProxyPay imREmit module: ${testTitle}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

const helperMap = {
  openModule,
  openProxyPayDashboard,
  openProxyPayWorkspace,
  selectCustomer
};

module.exports = {
  proxypayImremitMoudleHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario,
    selectors: proxypayImremitMoudleSelectors
  }
};
