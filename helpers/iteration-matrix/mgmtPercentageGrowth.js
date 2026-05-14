const path = require('path');
const { expect } = require('@playwright/test');
const { mgmtPercentageGrowthSelectors } = require('../../selectors/iteration-matrix/mgmtPercentageGrowth.selectors.js');

async function waitForFirstVisible(page, selectors, timeout = 15000) {
  const startedAt = Date.now();

  while ((Date.now() - startedAt) < timeout) {
    for (const selector of selectors) {
      const locator = page.locator(selector).first();
      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error(`None of the selectors became visible within ${timeout}ms: ${selectors.join(', ')}`);
}

async function maybeVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      return locator;
    }
  }

  return null;
}

async function clickFirstVisible(page, selectors, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  await locator.click({ timeout: 5000 });
  return locator;
}

async function fillFirstVisible(page, selectors, value, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  await locator.fill('');
  await locator.fill(String(value));
  return locator;
}

async function hoverFirstVisible(page, selectors, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  await locator.hover({ timeout: 5000 });
  return locator;
}

async function expectVisible(page, selectors, timeout = 15000) {
  await waitForFirstVisible(page, selectors, timeout);
}

async function expectTextVisible(page, text, timeout = 15000) {
  await expect(page.getByText(text, { exact: true }).first()).toBeVisible({ timeout });
}

async function openAdmin(page) {
  const adminHeading = await maybeVisible(page, mgmtPercentageGrowthSelectors.admin.heading);
  if (adminHeading) {
    return;
  }

  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.admin.moduleEntry);
  await expectVisible(page, mgmtPercentageGrowthSelectors.admin.heading);
}

async function openMIS(page) {
  const misHeading = await maybeVisible(page, mgmtPercentageGrowthSelectors.mis.landingHeading);
  if (misHeading) {
    return;
  }

  await openAdmin(page);
  await expectVisible(page, mgmtPercentageGrowthSelectors.admin.misLink);
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.admin.misLink);
  await expectVisible(page, mgmtPercentageGrowthSelectors.mis.landingHeading);
}

async function openModule(page) {
  const moduleHeading = await maybeVisible(page, mgmtPercentageGrowthSelectors.mis.percentageGrowthHeading);
  if (moduleHeading) {
    return page;
  }

  await openMIS(page);
  await expectVisible(page, mgmtPercentageGrowthSelectors.mis.percentageGrowthTab);
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.percentageGrowthTab);
  await expectVisible(page, mgmtPercentageGrowthSelectors.mis.percentageGrowthHeading);
  await expectVisible(page, mgmtPercentageGrowthSelectors.mis.graphHeading);
  return page;
}

async function openFilters(page) {
  await openModule(page);
  const filtersHeading = await maybeVisible(page, mgmtPercentageGrowthSelectors.filters.heading);
  if (!filtersHeading) {
    await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.adjustFiltersButton);
  }
  await expectVisible(page, mgmtPercentageGrowthSelectors.filters.heading);
  await expectVisible(page, mgmtPercentageGrowthSelectors.filters.customersLabel);
}

async function openCustomerDropdown(page) {
  await openFilters(page);
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.filters.customerTrigger);
  await expectVisible(page, mgmtPercentageGrowthSelectors.filters.customerSearchInput);
}

async function ensureTableVisible(page) {
  await openModule(page);
  if (await maybeVisible(page, mgmtPercentageGrowthSelectors.mis.tableHeading)) {
    return;
  }

  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.showTableButton);
  await expectVisible(page, mgmtPercentageGrowthSelectors.mis.tableHeading);
}

async function ensureChartVisible(page) {
  await openModule(page);
  if (await maybeVisible(page, mgmtPercentageGrowthSelectors.mis.graphHeading)) {
    return;
  }

  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.showChartButton);
  await expectVisible(page, mgmtPercentageGrowthSelectors.mis.graphHeading);
}

async function clickPaginationButton(page, direction) {
  await ensureTableVisible(page);
  const selectorSet = mgmtPercentageGrowthSelectors.mis.paginationButton[direction];
  if (!selectorSet) {
    throw new Error(`Unsupported pagination button: ${direction}`);
  }

  const button = await waitForFirstVisible(page, selectorSet);
  const disabled = await button.isDisabled().catch(() => false);
  if (disabled) {
    await expectVisible(page, mgmtPercentageGrowthSelectors.mis.pageSummary);
    return;
  }

  const summary = await maybeVisible(page, mgmtPercentageGrowthSelectors.mis.pageSummary);
  const before = summary ? await summary.textContent().catch(() => '') : '';
  await button.click({ timeout: 5000 });

  if (summary && before) {
    await expect(summary).not.toHaveText(before, { timeout: 10000 });
  }
}

async function searchAllEntries(page, value = '2024') {
  await ensureTableVisible(page);
  const input = await fillFirstVisible(page, mgmtPercentageGrowthSelectors.mis.searchAllEntriesInput, value);
  await expect(input).toHaveValue(String(value));
}

async function changePageSize(page, size) {
  await ensureTableVisible(page);
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.paginationTrigger);
  await expectVisible(page, mgmtPercentageGrowthSelectors.mis.pageSizeOption(size));
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.pageSizeOption(size));
}

async function openColumnView(page) {
  await ensureTableVisible(page);
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.columnViewTrigger);
}

async function openHeaderMenu(page, headerName) {
  await ensureTableVisible(page);
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.tableHeader(headerName));
}

async function applyHeaderAction(page, headerName, actionName) {
  await openHeaderMenu(page, headerName);
  await expectVisible(page, mgmtPercentageGrowthSelectors.mis.sortOption(actionName));
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.sortOption(actionName));
}

async function openDownloadMenu(page) {
  await ensureChartVisible(page);
  await hoverFirstVisible(page, mgmtPercentageGrowthSelectors.mis.downloadReportButton);
  const menuOption = await maybeVisible(page, mgmtPercentageGrowthSelectors.mis.downloadGraphButton)
    || await maybeVisible(page, mgmtPercentageGrowthSelectors.mis.downloadImageButton)
    || await maybeVisible(page, mgmtPercentageGrowthSelectors.mis.downloadBothButton);

  if (!menuOption) {
    await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.downloadReportButton);
  }
}

async function clickDownloadOption(page, selectors) {
  await openDownloadMenu(page);
  await expectVisible(page, selectors);
  const option = await waitForFirstVisible(page, selectors);
  await option.click({ timeout: 5000 });
}

async function toggleCheckbox(page, selectors) {
  const locator = await waitForFirstVisible(page, selectors);
  const tagName = await locator.evaluate((node) => node.tagName.toLowerCase()).catch(() => '');
  const target = tagName === 'label'
    ? page.locator(`#${await locator.getAttribute('for')}`).first()
    : locator;
  const before = await target.isChecked().catch(() => null);
  await locator.click({ timeout: 5000 });
  if (before !== null) {
    await expect(target).not.toHaveJSProperty('checked', before);
  }
}

async function chooseCustomer(page, customerName = 'Infios Supply') {
  await openCustomerDropdown(page);
  await fillFirstVisible(page, mgmtPercentageGrowthSelectors.filters.customerSearchInput, customerName);
  await page.waitForTimeout(750);
  await expectVisible(page, mgmtPercentageGrowthSelectors.filters.customerOption(customerName));
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.filters.customerOption(customerName));
}

async function expectCustomerOptionsAlphabetical(page) {
  await openCustomerDropdown(page);
  const options = await page.locator(mgmtPercentageGrowthSelectors.filters.customerOptions.join(', ')).allTextContents();
  const normalized = options
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry) => !/^select all$/i.test(entry));

  if (normalized.length < 2) {
    throw new Error('Not enough customer options were available to validate alphabetical ordering.');
  }

  const sorted = [...normalized].sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }));
  expect(normalized).toEqual(sorted);
}

async function expectDefaultAllCustomers(page) {
  await openFilters(page);
  const trigger = await waitForFirstVisible(page, mgmtPercentageGrowthSelectors.filters.customerTrigger);
  await expect(trigger).toContainText(/All customers selected/i);
}

async function resetFilters(page) {
  await chooseCustomer(page);
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.filters.resetButton);
  await expectDefaultAllCustomers(page);
}

async function useReturnToTop(page) {
  await ensureTableVisible(page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.returnToTopButton);
}

async function hideAndShowChart(page) {
  await ensureChartVisible(page);
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.hideChartButton);
  await expectVisible(page, mgmtPercentageGrowthSelectors.mis.showChartButton);
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.showChartButton);
  await expectVisible(page, mgmtPercentageGrowthSelectors.mis.graphHeading);
}

async function hideTable(page) {
  await ensureTableVisible(page);
  await clickFirstVisible(page, mgmtPercentageGrowthSelectors.mis.hideTableButton);
  await expectVisible(page, mgmtPercentageGrowthSelectors.mis.showTableButton);
}

async function runScenario(page, sourceFile) {
  const caseId = path.basename(sourceFile, '.spec.js').match(/^(TS_\d+)/i)?.[1];

  switch (caseId) {
    case 'TS_01':
      await openModule(page);
      break;
    case 'TS_02':
      await openCustomerDropdown(page);
      break;
    case 'TS_03':
      await useReturnToTop(page);
      break;
    case 'TS_04':
      await clickPaginationButton(page, 'next');
      break;
    case 'TS_05':
      await clickPaginationButton(page, 'previous');
      break;
    case 'TS_06':
      await clickPaginationButton(page, 'first');
      break;
    case 'TS_07':
      await clickPaginationButton(page, 'last');
      break;
    case 'TS_08':
      await searchAllEntries(page);
      break;
    case 'TS_09':
      await changePageSize(page, '5');
      await changePageSize(page, '25');
      break;
    case 'TS_10':
      await openColumnView(page);
      break;
    case 'TS_11':
      await applyHeaderAction(page, 'Year', 'Asc');
      await applyHeaderAction(page, 'Payments Received', 'Asc');
      await applyHeaderAction(page, 'Diff Received Value', 'Asc');
      break;
    case 'TS_12':
      await applyHeaderAction(page, 'Year', 'desc');
      await applyHeaderAction(page, 'Payments Received', 'desc');
      await applyHeaderAction(page, 'Diff Received Value', 'desc');
      break;
    case 'TS_13':
      await applyHeaderAction(page, 'Year', 'hide');
      await applyHeaderAction(page, 'Payments Received', 'hide');
      await applyHeaderAction(page, 'Diff Received Value', 'hide');
      break;
    case 'TS_14':
      await clickDownloadOption(page, mgmtPercentageGrowthSelectors.mis.downloadGraphButton);
      break;
    case 'TS_15':
      await openDownloadMenu(page);
      await expectVisible(page, mgmtPercentageGrowthSelectors.mis.downloadImageButton);
      break;
    case 'TS_16':
      await openModule(page);
      await expectVisible(page, mgmtPercentageGrowthSelectors.mis.showTrendlinesCheckbox);
      await expectVisible(page, mgmtPercentageGrowthSelectors.mis.showDifferencesCheckbox);
      await toggleCheckbox(page, mgmtPercentageGrowthSelectors.mis.showDifferencesCheckbox);
      break;
    case 'TS_17':
      await chooseCustomer(page);
      break;
    case 'TS_18':
      await clickDownloadOption(page, mgmtPercentageGrowthSelectors.mis.downloadBothButton);
      break;
    case 'TS_19':
      await resetFilters(page);
      break;
    case 'TS_20':
    case 'TS_21':
      await expectCustomerOptionsAlphabetical(page);
      break;
    case 'TS_22':
    case 'TS_26':
      await resetFilters(page);
      break;
    case 'TS_23':
      await expectDefaultAllCustomers(page);
      break;
    case 'TS_24':
      await hideAndShowChart(page);
      break;
    case 'TS_25':
      await hideTable(page);
      break;
    default:
      throw new Error(`Unsupported MGMT Percentage Growth scenario for ${sourceFile}`);
  }
}

module.exports = {
  mgmtPercentageGrowthHelpers: {
    openModule,
    openFilters,
    ensureTableVisible,
    ensureChartVisible,
    runScenario,
    selectors: mgmtPercentageGrowthSelectors,
    expectVisible,
    expectTextVisible
  }
};
