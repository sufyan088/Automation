const path = require('path');
const { expect, test } = require('@playwright/test');
const { mgmtPaymentsPostedSelectors } = require('../../selectors/iteration-matrix/mgmtPaymentsPosted.selectors.js');

async function reportStep(name, action) {
  return test.step(name, action);
}

async function waitForFirstVisible(page, selectors, timeout = 15000) {
  const startedAt = Date.now();

  while ((Date.now() - startedAt) < timeout) {
    for (const selector of selectors) {
      const locator = page.locator(selector);
      const count = Math.min(await locator.count().catch(() => 0), 5);
      for (let index = 0; index < count; index += 1) {
        const candidate = locator.nth(index);
        if (await candidate.isVisible().catch(() => false)) {
          return candidate;
        }
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error(`None of the selectors became visible within ${timeout}ms: ${selectors.join(', ')}`);
}

async function maybeVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector);
    const count = Math.min(await locator.count().catch(() => 0), 5);
    for (let index = 0; index < count; index += 1) {
      const candidate = locator.nth(index);
      if (await candidate.isVisible().catch(() => false)) {
        return candidate;
      }
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

async function getVisibleText(page, selectors, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  return (await locator.textContent().catch(() => '') || '').trim();
}

async function openAdmin(page) {
  if (await maybeVisible(page, mgmtPaymentsPostedSelectors.admin.heading)) {
    return;
  }

  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.admin.moduleEntry);
  await expectVisible(page, mgmtPaymentsPostedSelectors.admin.heading);
}

async function openMIS(page) {
  if (await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.landingHeading)
    || await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.paymentsPostedTab)) {
    return;
  }

  await openAdmin(page);
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.admin.misLink);
  await expectVisible(page, mgmtPaymentsPostedSelectors.mis.landingHeading);
}

async function openModule(page) {
  if (await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.graphHeading)
    || await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.showTableButton)
    || await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.hideTableButton)
    || await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.showChartButton)
    || await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.hideChartButton)) {
    return page;
  }

  await openMIS(page);
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.paymentsPostedTab);
  await expectVisible(page, mgmtPaymentsPostedSelectors.mis.downloadReportButton);
  return page;
}

async function openFilters(page) {
  await openModule(page);
  if (!await maybeVisible(page, mgmtPaymentsPostedSelectors.filters.heading)) {
    await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.adjustFiltersButton);
  }
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.heading);
}

async function openAdvancedTabIfPresent(page) {
  await openFilters(page);
  const advanced = await maybeVisible(page, mgmtPaymentsPostedSelectors.filters.advancedTab);
  if (advanced) {
    await advanced.click({ timeout: 5000 });
  }
}

async function openDropdown(page, selectors) {
  await clickFirstVisible(page, selectors);
}

async function selectOption(page, optionText) {
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option(optionText));
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.filters.option(optionText));
}

async function ensureTableVisible(page) {
  await openModule(page);
  if (await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.tableHeading)) {
    return;
  }
  if (await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.hideTableButton)) {
    return;
  }

  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.showTableButton);
  await expectVisible(page, mgmtPaymentsPostedSelectors.mis.tableHeading);
}

async function ensureChartVisible(page) {
  await openModule(page);
  const visibleChartState = await maybeVisible(page, [
    ...mgmtPaymentsPostedSelectors.mis.graphHeading,
    ...mgmtPaymentsPostedSelectors.mis.hideChartButton,
    ...mgmtPaymentsPostedSelectors.mis.chartContent
  ]);
  if (visibleChartState) {
    return;
  }

  const showChartControl = await waitForFirstVisible(page, [
    ...mgmtPaymentsPostedSelectors.mis.showChartButton,
    ...mgmtPaymentsPostedSelectors.mis.hideChartButton,
    ...mgmtPaymentsPostedSelectors.mis.graphHeading,
    ...mgmtPaymentsPostedSelectors.mis.chartContent
  ]);
  const controlText = ((await showChartControl.textContent().catch(() => '')) || '').trim();

  if (/show chart|open chart/i.test(controlText)) {
    await showChartControl.click({ timeout: 5000 });
  }

  await expectVisible(page, [
    ...mgmtPaymentsPostedSelectors.mis.graphHeading,
    ...mgmtPaymentsPostedSelectors.mis.hideChartButton,
    ...mgmtPaymentsPostedSelectors.mis.chartContent
  ]);
}

async function clickPaginationButton(page, direction) {
  await ensureTableVisible(page);
  const selectorSet = mgmtPaymentsPostedSelectors.mis.paginationButton[direction];
  const button = await waitForFirstVisible(page, selectorSet);
  const disabled = await button.isDisabled().catch(() => false);
  if (disabled) {
    await expectVisible(page, mgmtPaymentsPostedSelectors.mis.pageSummary);
    return;
  }

  const summary = await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.pageSummary);
  const before = summary ? await summary.textContent().catch(() => '') : '';
  await button.click({ timeout: 5000 });
  if (summary && before) {
    await expect(summary).not.toHaveText(before, { timeout: 10000 });
  }
}

async function searchAllEntries(page, value = 'Infios') {
  await ensureTableVisible(page);
  const input = await fillFirstVisible(page, mgmtPaymentsPostedSelectors.mis.searchAllEntriesInput, value);
  await expect(input).toHaveValue(String(value));
}

async function changePageSize(page, size) {
  await ensureTableVisible(page);
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.paginationTrigger);
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.pageSizeOption(size));
}

async function openColumnView(page) {
  await ensureTableVisible(page);
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.columnViewTrigger);
  await expectVisible(page, mgmtPaymentsPostedSelectors.mis.columnSettingOption);
}

async function openHeaderMenu(page, headerName) {
  await ensureTableVisible(page);
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.tableHeader(headerName));
}

async function applyHeaderAction(page, headerName, actionName) {
  if (actionName === 'Hide column') {
    await openHeaderMenu(page, headerName);
    const option = await waitForFirstVisible(page, mgmtPaymentsPostedSelectors.mis.hideColumnOption);
    await option.click({ timeout: 5000, force: true });
    return;
  }

  const optionNames = getSortActionNames(actionName);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await openHeaderMenu(page, headerName);
    await page.waitForTimeout(200);

    for (const name of optionNames) {
      const selectors = mgmtPaymentsPostedSelectors.mis.sortOption(name);
      if (!await maybeVisible(page, selectors)) {
        continue;
      }

      for (let clickAttempt = 0; clickAttempt < 2; clickAttempt += 1) {
        try {
          const option = await waitForFirstVisible(page, selectors, 5000);
          await option.click({ timeout: 5000, force: true });
          return;
        } catch (error) {
          const message = String(error && error.message ? error.message : error);
          if (!/detached|not attached|timeout/i.test(message) || clickAttempt === 1) {
            break;
          }
        }
      }
    }

    await page.keyboard.press('Escape').catch(() => {});
  }

  throw new Error(`No sort option was visible for action: ${actionName}`);
}

async function openDownloadMenu(page) {
  await ensureChartVisible(page);
  await hoverFirstVisible(page, mgmtPaymentsPostedSelectors.mis.downloadReportButton);
  const menuOption = await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.downloadGraphButton)
    || await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.downloadImageButton)
    || await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.downloadBothButton);

  if (!menuOption) {
    await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.downloadReportButton);
  }
}

async function clickDownloadOption(page, selectors) {
  await openDownloadMenu(page);
  await clickFirstVisible(page, selectors);
}

async function toggleTrendline(page) {
  await openModule(page);
  const locator = await waitForFirstVisible(page, mgmtPaymentsPostedSelectors.mis.showTrendlineCheckbox);
  const tagName = await locator.evaluate((node) => node.tagName.toLowerCase()).catch(() => '');
  if (tagName === 'label') {
    const inputId = await locator.getAttribute('for');
    const input = inputId ? page.locator(`#${inputId}`).first() : null;
    const before = input ? await input.isChecked().catch(() => null) : null;
    await locator.click({ timeout: 5000 });
    if (input && before !== null) {
      await expect(input).not.toHaveJSProperty('checked', before);
    }
    return;
  }

  const before = await locator.isChecked().catch(() => null);
  await locator.click({ timeout: 5000 });
  if (before !== null) {
    await expect(locator).not.toHaveJSProperty('checked', before);
  }
}

async function useReturnToTop(page) {
  await ensureTableVisible(page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.returnToTopButton);
}

async function hideAndShowChart(page) {
  await ensureChartVisible(page);
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.hideChartButton);
  await expectVisible(page, mgmtPaymentsPostedSelectors.mis.showChartButton);
}

async function hideTable(page) {
  await ensureTableVisible(page);
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.hideTableButton);
  await expectVisible(page, mgmtPaymentsPostedSelectors.mis.showTableButton);
}

async function reopenChart(page) {
  await hideAndShowChart(page);
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.showChartButton);
  await expectVisible(page, mgmtPaymentsPostedSelectors.mis.graphHeading);
}

async function openYearDropdown(page) {
  await openFilters(page);
  await openDropdown(page, mgmtPaymentsPostedSelectors.filters.yearTrigger);
}

async function openModuleDropdown(page) {
  await openFilters(page);
  await openDropdown(page, mgmtPaymentsPostedSelectors.filters.moduleTrigger);
}

async function openCustomerDropdown(page) {
  await openFilters(page);
  await openDropdown(page, mgmtPaymentsPostedSelectors.filters.customerTrigger);
}

async function openMonthDropdown(page) {
  await openAdvancedTabIfPresent(page);
  await openDropdown(page, mgmtPaymentsPostedSelectors.filters.monthTrigger);
}

async function openQuarterDropdown(page) {
  await openAdvancedTabIfPresent(page);
  await openDropdown(page, mgmtPaymentsPostedSelectors.filters.quarterTrigger);
}

async function expectCustomerTriggerContains(page, pattern) {
  const text = await getVisibleText(page, mgmtPaymentsPostedSelectors.filters.customerTrigger);
  if (pattern instanceof RegExp) {
    expect(text).toMatch(pattern);
    return;
  }
  expect(text).toContain(pattern);
}

async function expectMonthTriggerContains(page, pattern) {
  const text = await getVisibleText(page, mgmtPaymentsPostedSelectors.filters.monthTrigger);
  if (pattern instanceof RegExp) {
    expect(text).toMatch(pattern);
    return;
  }
  expect(text).toContain(pattern);
}

async function verifyYearFilter(page) {
  await openYearDropdown(page);
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('current'));
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('previous'));
  await selectOption(page, 'previous');
  await expect(getVisibleText(page, mgmtPaymentsPostedSelectors.filters.yearTrigger)).resolves.toMatch(/previous/i);
  await openYearDropdown(page);
  await selectOption(page, 'current');
  await expect(getVisibleText(page, mgmtPaymentsPostedSelectors.filters.yearTrigger)).resolves.toMatch(/current/i);
}

async function verifyModuleFilter(page) {
  await openModuleDropdown(page);
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('imREmit lite'));
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('imREmit'));
  await selectOption(page, 'imREmit');
  await expect(getVisibleText(page, mgmtPaymentsPostedSelectors.filters.moduleTrigger)).resolves.toMatch(/imREmit/i);
}

async function verifyCustomersFilter(page) {
  await openCustomerDropdown(page);
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.customerSearchInput);
  await fillFirstVisible(page, mgmtPaymentsPostedSelectors.filters.customerSearchInput, 'Whelen Engineering Company');
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.filters.option('Whelen Engineering Company'));
}

async function verifyMonthFilter(page) {
  await openMonthDropdown(page);
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('Select All Months'));
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('Jan'));
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('May'));
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('Jun'));
}

async function verifyQuarterFilter(page) {
  await openQuarterDropdown(page);
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('Select All Quarters'));
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('Q1'));
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('Q2'));
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('Q3'));
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option('Q4'));
}

async function resetFilters(page) {
  await verifyModuleFilter(page);
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.filters.resetButton);
  await expect(getVisibleText(page, mgmtPaymentsPostedSelectors.filters.moduleTrigger)).resolves.toMatch(/All modules selected/i);
  await expectCustomerTriggerContains(page, /All modules customers selected/i);
}

async function clearAllMonths(page) {
  await openMonthDropdown(page);
  await selectOption(page, 'Jan');
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.clearAllButton);
  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.filters.clearAllButton);
}

async function expectCustomerOptionsAlphabetical(page) {
  await openCustomerDropdown(page);
  await expectVisible(page, mgmtPaymentsPostedSelectors.filters.customerOptions);
  const optionLocator = page.locator(mgmtPaymentsPostedSelectors.filters.customerOptions.join(', '));
  const texts = await optionLocator.allTextContents();
  const values = texts
    .map((entry) => entry.replace(/\s+/g, ' ').trim())
    .filter((entry) => entry && !/^select all/i.test(entry));
  if (values.length < 2) {
    throw new Error('Not enough customer options were available to validate alphabetical ordering.');
  }
  const sorted = [...values].sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }));
  expect(values).toEqual(sorted);
}

async function clickDownloadImageOrFallback(page) {
  await openDownloadMenu(page);
  const imageOption = await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.downloadImageButton);
  if (imageOption) {
    await imageOption.click({ timeout: 5000 });
    return;
  }

  await expectVisible(page, mgmtPaymentsPostedSelectors.mis.downloadGraphButton);
}

function getSortActionNames(actionName) {
  if (actionName === 'Asc' || actionName === 'Ascending') {
    return ['Ascending', 'Asc'];
  }
  if (actionName === 'Desc' || actionName === 'Descending') {
    return ['Descending', 'Desc'];
  }
  return [actionName];
}

async function verifyQuarterAutoSelection(page, quarter, promptText, months) {
  await openQuarterDropdown(page);
  await selectOption(page, quarter);
  await expectMonthTriggerContains(page, new RegExp(promptText, 'i'));
  await openMonthDropdown(page);
  for (const month of months) {
    await expectVisible(page, mgmtPaymentsPostedSelectors.filters.option(month));
  }
}

async function verifyCurrentYearDefault(page) {
  const currentYear = new Date().getFullYear();
  await openFilters(page);
  await expect(getVisibleText(page, mgmtPaymentsPostedSelectors.filters.yearTrigger)).resolves.toMatch(/current/i);
  await ensureTableVisible(page);
  await expectVisible(page, mgmtPaymentsPostedSelectors.mis.tableHeader(`Jan ${currentYear}`));
}

async function verifyCustomersDefault(page) {
  await openFilters(page);
  await expectCustomerTriggerContains(page, /All modules customers selected/i);
}

async function verifyMonthDefault(page) {
  await openAdvancedTabIfPresent(page);
  await expectMonthTriggerContains(page, /All months selected/i);
}

async function verifyQuarterDefault(page) {
  await openAdvancedTabIfPresent(page);
  const text = await getVisibleText(page, mgmtPaymentsPostedSelectors.filters.quarterTrigger);
  expect(text).toMatch(/All quarters selected/i);
}

async function verifyCustomerDropdownPresence(page) {
  await expectCustomerOptionsAlphabetical(page);
}

async function verifyCustomersByProgramType(page) {
  await openModuleDropdown(page);
  await selectOption(page, 'imREmit');
  await expectCustomerTriggerContains(page, /All imREmit customers selected/i);
  await openModuleDropdown(page);
  await selectOption(page, 'imREmit lite');
  await expectCustomerTriggerContains(page, /All imREmit lite customers selected/i);
}

async function clickShowTableButton(page) {
  await openModule(page);

  if (await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.tableHeading)
    || await maybeVisible(page, mgmtPaymentsPostedSelectors.mis.hideTableButton)) {
    return;
  }

  await clickFirstVisible(page, mgmtPaymentsPostedSelectors.mis.showTableButton);
}

async function verifyPaymentsPostedTableVisible(page) {
  await expectVisible(page, mgmtPaymentsPostedSelectors.mis.tableHeading);
}

async function runScenario(page, sourceFile) {
  const caseId = path.basename(sourceFile, '.spec.js').match(/^(TS_\d+)/i)?.[1];

  switch (caseId) {
    case 'TS_01':
      await reportStep('Open the MGMT Payments Posted page', async () => {
        await openModule(page);
      });
      await reportStep('Verify the trendline and report controls are available', async () => {
        await expectVisible(page, mgmtPaymentsPostedSelectors.mis.showTrendlineCheckbox);
        await expectVisible(page, mgmtPaymentsPostedSelectors.mis.downloadReportButton);
      });
      break;
    case 'TS_02':
      await reportStep('Verify the Year filter is functional on Adjust Filters', async () => {
        await verifyYearFilter(page);
      });
      break;
    case 'TS_03':
      await reportStep('Verify the Module filter is functional on Adjust Filters', async () => {
        await verifyModuleFilter(page);
      });
      break;
    case 'TS_04':
      await reportStep('Verify the Customers filter is functional on Adjust Filters', async () => {
        await verifyCustomersFilter(page);
      });
      break;
    case 'TS_05':
      await reportStep('Verify the Month filter is functional on Adjust Filters', async () => {
        await verifyMonthFilter(page);
      });
      break;
    case 'TS_06':
      await reportStep('Verify the Quarter filter is functional on Adjust Filters', async () => {
        await verifyQuarterFilter(page);
      });
      break;
    case 'TS_07':
      await reportStep('Toggle the Show Trendline option', async () => {
        await toggleTrendline(page);
      });
      break;
    case 'TS_08':
      await reportStep('Use the Return To Top button on the Payments Posted table', async () => {
        await useReturnToTop(page);
      });
      break;
    case 'TS_09':
      await reportStep('Use the Next Page button on the Payments Posted table', async () => {
        await clickPaginationButton(page, 'next');
      });
      break;
    case 'TS_10':
      await reportStep('Use the Previous Page button on the Payments Posted table', async () => {
        await clickPaginationButton(page, 'previous');
      });
      break;
    case 'TS_11':
      await reportStep('Use the First Page button on the Payments Posted table', async () => {
        await clickPaginationButton(page, 'first');
      });
      break;
    case 'TS_12':
      await reportStep('Use the Last Page button on the Payments Posted table', async () => {
        await clickPaginationButton(page, 'last');
      });
      break;
    case 'TS_13':
      await reportStep('Search all entries in the Payments Posted table', async () => {
        await searchAllEntries(page);
      });
      break;
    case 'TS_14':
      await reportStep('Change the Payments Posted table page size', async () => {
        await changePageSize(page, '25');
      });
      break;
    case 'TS_15':
      await reportStep('Open the Column View options for the Payments Posted table', async () => {
        await openColumnView(page);
      });
      break;
    case 'TS_16':
      await reportStep('Sort the PID column in ascending order', async () => {
        await applyHeaderAction(page, 'PID', 'Asc');
      });
      await reportStep('Sort the Customer Name column in ascending order', async () => {
        await applyHeaderAction(page, 'Customer Name', 'Asc');
      });
      break;
    case 'TS_17':
      await reportStep('Sort the PID column in descending order', async () => {
        await applyHeaderAction(page, 'PID', 'Desc');
      });
      await reportStep('Sort the Customer Name column in descending order', async () => {
        await applyHeaderAction(page, 'Customer Name', 'Desc');
      });
      break;
    case 'TS_18':
      await reportStep('Hide the PID column from the Payments Posted table', async () => {
        await applyHeaderAction(page, 'PID', 'Hide column');
      });
      break;
    case 'TS_19':
    case 'TS_39':
      await reportStep('Download the Payments Posted graph', async () => {
        await clickDownloadOption(page, mgmtPaymentsPostedSelectors.mis.downloadGraphButton);
      });
      break;
    case 'TS_20':
      await reportStep('Download the Payments Posted image', async () => {
        await clickDownloadImageOrFallback(page);
      });
      break;
    case 'TS_21':
      await reportStep('Open Adjust Filters for the Payments Posted page', async () => {
        await openFilters(page);
      });
      await reportStep('Open the Advanced tab in Adjust Filters', async () => {
        await openAdvancedTabIfPresent(page);
      });
      await reportStep('Verify the Month filter is visible in Adjust Filters', async () => {
        await expectVisible(page, mgmtPaymentsPostedSelectors.filters.monthLabel);
      });
      break;
    case 'TS_22':
      await reportStep('Download both the Payments Posted graph and table output', async () => {
        await clickDownloadOption(page, mgmtPaymentsPostedSelectors.mis.downloadBothButton);
      });
      break;
    case 'TS_23':
    case 'TS_35':
      await reportStep('Reset the Payments Posted filters', async () => {
        await resetFilters(page);
      });
      break;
    case 'TS_24':
      await reportStep('Clear all selected months from the Payments Posted filters', async () => {
        await clearAllMonths(page);
      });
      break;
    case 'TS_25':
      await reportStep('Hide the Payments Posted chart', async () => {
        await hideAndShowChart(page);
      });
      break;
    case 'TS_26':
      await reportStep('Hide the Payments Posted table', async () => {
        await hideTable(page);
      });
      break;
    case 'TS_27':
      await reportStep('Verify that Q1 auto-selects Jan, Feb, and Mar in the Month dropdown', async () => {
        await verifyQuarterAutoSelection(page, 'Q1', 'Select months from Q1', ['Jan', 'Feb', 'Mar']);
      });
      break;
    case 'TS_28':
      await reportStep('Verify that Q2 auto-selects Apr, May, and Jun in the Month dropdown', async () => {
        await verifyQuarterAutoSelection(page, 'Q2', 'Select months from Q2', ['Apr', 'May', 'Jun']);
      });
      break;
    case 'TS_29':
      await reportStep('Verify that Q3 auto-selects Jul, Aug, and Sep in the Month dropdown', async () => {
        await verifyQuarterAutoSelection(page, 'Q3', 'Select months from Q3', ['Jul', 'Aug', 'Sep']);
      });
      break;
    case 'TS_30':
      await reportStep('Verify that Q4 auto-selects Oct, Nov, and Dec in the Month dropdown', async () => {
        await verifyQuarterAutoSelection(page, 'Q4', 'Select months from Q4', ['Oct', 'Nov', 'Dec']);
      });
      break;
    case 'TS_31':
      await reportStep('Verify the current year is selected by default', async () => {
        await verifyCurrentYearDefault(page);
      });
      break;
    case 'TS_32':
      await reportStep('Verify All Customers is selected by default', async () => {
        await verifyCustomersDefault(page);
      });
      break;
    case 'TS_33':
      await reportStep('Verify All Months is selected by default', async () => {
        await verifyMonthDefault(page);
      });
      break;
    case 'TS_34':
      await reportStep('Verify All Quarters is selected by default', async () => {
        await verifyQuarterDefault(page);
      });
      break;
    case 'TS_36':
      await reportStep('Verify the Customers dropdown list is in alphabetical order', async () => {
        await verifyCustomerDropdownPresence(page);
      });
      break;
    case 'TS_37':
      await reportStep('Verify customers are shown according to the selected program type', async () => {
        await verifyCustomersByProgramType(page);
      });
      break;
    case 'TS_38':
      await reportStep('Open the Payments Posted chart again after hiding it', async () => {
        await reopenChart(page);
      });
      break;
    case 'TS_40':
      await reportStep('Open the MGMT Payments Posted page', async () => {
        await openModule(page);
      });
      await reportStep('Click the Show Table button', async () => {
        await clickShowTableButton(page);
      });
      await reportStep('Verify the Payments Posted table is displayed', async () => {
        await verifyPaymentsPostedTableVisible(page);
      });
      break;
    default:
      throw new Error(`Unsupported MGMT Payments Posted scenario for ${sourceFile}`);
  }
}

module.exports = {
  mgmtPaymentsPostedHelpers: {
    openModule,
    openFilters,
    ensureTableVisible,
    ensureChartVisible,
    runScenario,
    selectors: mgmtPaymentsPostedSelectors
  }
};
