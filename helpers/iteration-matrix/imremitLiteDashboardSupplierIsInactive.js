const { expect, test } = require('@playwright/test');
const { clickWithFallback, clickIfFound, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { imremitDashboardPayablesEndingInTheNext7DaysHelpers: baseHelpers } = require('./imremitDashboardPayablesEndingInTheNext7Days.js');
const { imremitLiteDashboardSupplierIsInactiveSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardSupplierIsInactive.selectors.js');

async function reportStep(name, action) {
  return test.step(name, action);
}

async function openModule(page) {
  const result = await clickIfFound(page, imremitLiteDashboardSupplierIsInactiveSelectors.moduleTabs.imremit, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  if (result.clicked) {
    await waitForAppToSettle(page, 1000);
  }

  return page;
}

async function openDashboard(page) {
  await clickWithFallback(page, imremitLiteDashboardSupplierIsInactiveSelectors.moduleTabs.dashboard, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function selectCustomer(page, data) {
  return baseHelpers.selectCustomer(page, data);
}

async function expectOverviewVisible(page) {
  const overviewHeading = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.headings.overview, {
    mustBeVisible: true,
    timeoutPerCandidate: 3000
  }).catch(() => null);

  if (overviewHeading) {
    await expect(overviewHeading.locator).toBeVisible({ timeout: 10000 });
    return;
  }

  const cardHeading = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.dashboard.supplierIsInactiveHeading, {
    mustBeVisible: true,
    timeoutPerCandidate: 3000
  });
  await expect(cardHeading.locator).toBeVisible({ timeout: 10000 });
}

async function openDashboardWorkspace(page, data) {
  await openModule(page);
  await openDashboard(page);
  await selectCustomer(page, data);

  try {
    await expectOverviewVisible(page);
  } catch (error) {
    await openDashboard(page);
    await selectCustomer(page, data);
    await expectOverviewVisible(page);
  }
}

async function assertPaymentManagementVisible(page) {
  const heading = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.headings.paymentManagement, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function clearSelectedCustomerFilter(page) {
  const trigger = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.customerPicker.trigger, {
    mustBeVisible: true,
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (!trigger) {
    return false;
  }

  const triggerText = ((await trigger.locator.textContent().catch(() => '')) || '').trim();
  if (!triggerText || /select customer|select customers|select all/i.test(triggerText)) {
    return false;
  }

  const clearButton = trigger.locator.locator('button').first();
  if (!await clearButton.isVisible().catch(() => false)) {
    return false;
  }

  await clearButton.click({ timeout: 5000 });
  await waitForAppToSettle(page, 1500);
  return true;
}

async function openSupplierIsInactiveList(page, data) {
  await openDashboardWorkspace(page, data);

  const openPaymentManagement = async () => {
    const reviewAction = await resolveFirst(
      page,
      imremitLiteDashboardSupplierIsInactiveSelectors.dashboard.review.filter((candidate) => candidate.type !== 'text'),
      {
        mustBeVisible: true,
        timeoutPerCandidate: 2500
      }
    ).catch(() => null);

    if (reviewAction) {
      await reviewAction.locator.click({ timeout: 5000 });
    } else {
      await page.getByRole('link', { name: /^Payment Management$/i }).first().click({ timeout: 5000 });
    }

    await waitForAppToSettle(page, 1000);
  };

  await openPaymentManagement();

  try {
    await assertPaymentManagementVisible(page);
  } catch (error) {
    await openDashboardWorkspace(page, data);
    await openPaymentManagement();
    await assertPaymentManagementVisible(page);
  }

  const noResults = page.getByText(/no results found/i).first();
  if (await noResults.isVisible().catch(() => false)) {
    await clearSelectedCustomerFilter(page);
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const visiblePaymentRowAction = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.actionsMenu, {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    }).catch(() => null);

    if (visiblePaymentRowAction) {
      return;
    }

    await openDashboardWorkspace(page, data);
    await openPaymentManagement();
    await assertPaymentManagementVisible(page);
  }
}

async function openActionsMenu(page) {
  await clickWithFallback(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.actionsMenu, {
    mustBeVisible: true,
    timeoutPerCandidate: 3500
  });
  await waitForAppToSettle(page, 500);
}

async function openPaymentDetails(page, data) {
  await openSupplierIsInactiveList(page, data);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const paymentListButtonBeforeOpen = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.paymentList, {
      mustBeVisible: true,
      timeoutPerCandidate: 1000
    }).catch(() => null);

    if (paymentListButtonBeforeOpen || /\/payment-management\/PD_/i.test(page.url())) {
      break;
    }

    try {
      await openActionsMenu(page);
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }

      await openSupplierIsInactiveList(page, data);
      continue;
    }

    const detailsMenuItem = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.viewPaymentDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);

    if (detailsMenuItem) {
      try {
        await detailsMenuItem.locator.click({ timeout: 5000 });
        await waitForAppToSettle(page, 1000);
        break;
      } catch (error) {
        if (!/detached|not visible|intercepts pointer events/i.test(error.message)) {
          throw error;
        }
      }
    }

    await page.keyboard.press('Escape').catch(() => null);
    await waitForAppToSettle(page, 500);

    if (attempt < 2) {
      await openSupplierIsInactiveList(page, data);
    }
  }

  const paymentListButton = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.paymentList, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);

  if (paymentListButton) {
    await expect(paymentListButton.locator).toBeVisible({ timeout: 10000 });
  }
}

async function openPaginationDropdown(page) {
  const dropdown = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.paginationDropdown, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await dropdown.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
}

async function choosePaginationOption(page, value) {
  const dropdown = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.paginationDropdown, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  const currentValue = (((await dropdown?.locator.textContent().catch(() => '')) || '').match(/\d+/) || [])[0] || null;
  if (currentValue === value) {
    return;
  }

  const selectIndex = await page.locator('select').evaluateAll((elements, targetValue) => {
    return elements.findIndex((element) => {
      return Array.from(element.options).some((option) => {
        const optionValue = (option.value || option.textContent || '').trim();
        return optionValue === targetValue;
      });
    });
  }, value).catch(() => -1);

  if (selectIndex >= 0) {
    const nativeSelect = page.locator('select').nth(selectIndex);

    try {
      await nativeSelect.selectOption(value, { timeout: 5000 });
    } catch (error) {
      await nativeSelect.evaluate((element, nextValue) => {
        element.value = nextValue;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }, value);
    }

    await waitForAppToSettle(page, 750);
    return;
  }

  await openPaginationDropdown(page);

  const option = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.paginationOption(value), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  await option.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 750);
}

async function clickPaginationWhenEnabled(page, candidates) {
  const control = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (!control) {
    return false;
  }

  const isDisabled = await control.locator.isDisabled().catch(() => false);
  if (isDisabled) {
    return false;
  }

  await baseHelpers.clickPagination(page, candidates);
  return true;
}

async function openAdvancedSearch(page) {
  await clickWithFallback(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.advancedSearch, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);

  const heading = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.headings.advancedSearch, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function openDateRangePicker(page) {
  await clickWithFallback(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.startDateAndEndDate, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);
}

async function clickVisibleCalendarDay(page, dayText, options = {}) {
  const dayButtons = page
    .locator('button[name="day"], [role="dialog"] button[name="day"], [data-radix-popper-content-wrapper] button[name="day"], [role="dialog"] button, [data-radix-popper-content-wrapper] button')
    .filter({ hasText: new RegExp(`^${dayText}$`) });

  const totalMatches = await dayButtons.count();
  if (!totalMatches) {
    throw new Error(`No calendar day button found for ${dayText}.`);
  }

  const indexes = options.preferLast
    ? Array.from({ length: totalMatches }, (_, index) => totalMatches - 1 - index)
    : Array.from({ length: totalMatches }, (_, index) => index);

  for (const index of indexes) {
    const candidate = dayButtons.nth(index);
    const isVisible = await candidate.isVisible().catch(() => false);
    const isEnabled = await candidate.isEnabled().catch(() => false);

    if (!isVisible || !isEnabled) {
      continue;
    }

    await candidate.click({ timeout: 5000 });
    return;
  }

  throw new Error(`No visible enabled calendar day button found for ${dayText}.`);
}

async function chooseDateRange(page) {
  await openDateRangePicker(page);
  await clickVisibleCalendarDay(page, '1');
  await waitForAppToSettle(page, 200);
  await clickVisibleCalendarDay(page, '6', { preferLast: true });
  await waitForAppToSettle(page, 500);
}

async function chooseDashboardFilterOptions(page) {
  await openAdvancedSearch(page);

  const label = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.dashboardFilterLabel, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(label.locator).toBeVisible({ timeout: 10000 });

  const trigger = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.dashboardFilterTrigger, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  for (let index = 0; index < 3; index += 1) {
    await trigger.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 300);
    await page.keyboard.press('ArrowDown');
    await waitForAppToSettle(page, 100);
    await page.keyboard.press('Enter');
    await waitForAppToSettle(page, 300);
  }
}

async function assertSearchInputVisible(page, candidates) {
  const input = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(input.locator).toBeVisible({ timeout: 10000 });
  return input;
}

async function fillSearchInput(page, candidates, value) {
  await fillWithFallback(page, candidates, value, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);
}

async function addComment(page, commentText) {
  await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.comments);
  await fillWithFallback(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.commentInput, commentText, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.addComment);
  const toast = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.commentSuccessToast, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (toast) {
    await expect(toast.locator).toBeVisible({ timeout: 10000 });
  }
}

async function openCommentsSection(page) {
  await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.comments);
  const input = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.commentInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(input.locator).toBeVisible({ timeout: 10000 });
}

async function openInvoicesSection(page) {
  await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.invoices);
}

async function openHistorySection(page) {
  await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.history);
}

async function openNextPayment(page) {
  await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.nextPayment);
}

async function openPreviousPayment(page) {
  await baseHelpers.ensurePreviousPaymentEnabled(page);
  await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.previousPayment);
}

async function returnToPaymentList(page) {
  await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.paymentList);
  await assertPaymentManagementVisible(page);
}

async function returnToTopOnPaymentDetails(page) {
  await page.evaluate(() => window.scrollTo(0, 800));
  await waitForAppToSettle(page, 500);
  await clickWithFallback(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.returnToTop, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  const paymentListButton = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.paymentList, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(paymentListButton.locator).toBeVisible({ timeout: 10000 });
}

async function searchByAccountNumber(page, value) {
  await assertSearchInputVisible(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.accountNumberInput);
  await fillSearchInput(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.accountNumberInput, value);
}

async function searchByPaymentNumber(page, value) {
  await assertSearchInputVisible(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.paymentNumberInput);
  await fillSearchInput(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.paymentNumberInput, value);
}

async function revealCardDetails(page) {
  await clickWithFallback(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.revealCardDetails, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);

  const cardNumber = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.revealedCardNumber, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(cardNumber.locator).toBeVisible({ timeout: 10000 });
}

async function openMapPayment(page) {
  await clickWithFallback(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.mapPayment, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);

  const label = await resolveFirst(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.mapPaymentDialogCustomerLabel, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(label.locator).toBeVisible({ timeout: 10000 });
}

async function applyHeaderActions(page, actionCandidates, labels) {
  let applied = 0;

  for (const label of labels) {
    try {
      await baseHelpers.clickHeaderAndChoose(page, label, actionCandidates);
      applied += 1;
    } catch (error) {
      if (!/No locator matched/i.test(error.message)) {
        throw error;
      }
    }
  }

  if (!applied) {
    throw new Error('No sortable headers were available for the Supplier Is Inactive list.');
  }
}

async function runTs01(page, data) {
  await reportStep('Open the Supplier is inactive review list', async () => {
    await openSupplierIsInactiveList(page, data);
  });
}

async function runTs02(page, data) {
  await runTs01(page, data);
  await reportStep('Use the last-page control when it is enabled', async () => {
    await clickPaginationWhenEnabled(page, imremitLiteDashboardSupplierIsInactiveSelectors.pagination.last);
  });
}

async function runTs03(page, data) {
  await runTs01(page, data);
  await reportStep('Move forward and then use the previous-page control', async () => {
    await clickPaginationWhenEnabled(page, imremitLiteDashboardSupplierIsInactiveSelectors.pagination.next);
    await clickPaginationWhenEnabled(page, imremitLiteDashboardSupplierIsInactiveSelectors.pagination.previous);
  });
}

async function runTs04(page, data) {
  await runTs01(page, data);
  await reportStep('Move to the last page and return to the first page when possible', async () => {
    const movedToLast = await clickPaginationWhenEnabled(page, imremitLiteDashboardSupplierIsInactiveSelectors.pagination.last);
    if (movedToLast) {
      await clickPaginationWhenEnabled(page, imremitLiteDashboardSupplierIsInactiveSelectors.pagination.first);
    }
  });
}

async function runTs05(page, data) {
  await runTs01(page, data);
  await reportStep('Open the page-size control and choose the supported values', async () => {
    for (const value of ['25', '50', '100']) {
      await choosePaginationOption(page, value);
    }
  });
}

async function runTs06(page, data) {
  await runTs01(page, data);
  await reportStep('Open the start date and end date picker and choose a range', async () => {
    await chooseDateRange(page);
  });
}

async function runTs07(page, data) {
  await runTs01(page, data);
  await reportStep('Open the column-view control', async () => {
    await baseHelpers.openColumnView(page);
  });
}

async function runTs08(page, data) {
  await runTs01(page, data);
  await reportStep('Open the payment-row actions menu', async () => {
    await openActionsMenu(page);
  });
}

async function runTs09(page, data) {
  await reportStep('Open payment details from the Supplier is inactive list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Move to the next payment detail', async () => {
    await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.nextPayment);
  });
}

async function runTs10(page, data) {
  await reportStep('Open payment details from the Supplier is inactive list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Move to the previous payment detail', async () => {
    await baseHelpers.ensurePreviousPaymentEnabled(page);
    await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.previousPayment);
  });
}

async function runTs11(page, data) {
  await reportStep('Open payment details from the Supplier is inactive list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Return from payment details to the payments list', async () => {
    await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.paymentList);
    await assertPaymentManagementVisible(page);
  });
}

async function runTs12AddComment(page, data) {
  const commentText = `SupplierInactive-${Date.now()}`;

  await reportStep('Open payment details from the Supplier is inactive list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Add a payment comment', async () => {
    await addComment(page, commentText);
  });
}

async function runTs12DashboardFilter(page, data) {
  await reportStep('Open the Supplier is inactive review list', async () => {
    await openSupplierIsInactiveList(page, data);
  });
  await reportStep('Open advanced search and use the dashboard filter dropdown', async () => {
    await chooseDashboardFilterOptions(page);
  });
}

async function runTs13(page, data) {
  await reportStep('Open payment details from the Supplier is inactive list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Open the comments section in payment details', async () => {
    await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.comments);
    await assertSearchInputVisible(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.commentInput);
  });
}

async function runTs14(page, data) {
  await reportStep('Open payment details from the Supplier is inactive list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Open invoices in payment details', async () => {
    await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.invoices);
  });
}

async function runTs15(page, data) {
  await reportStep('Open payment details from the Supplier is inactive list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Reveal the card details in payment details', async () => {
    await revealCardDetails(page);
  });
}

async function runTs16(page, data) {
  await reportStep('Open payment details from the Supplier is inactive list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Open the map payment dialog', async () => {
    await openMapPayment(page);
  });
}

async function runTs17(page, data) {
  await reportStep('Open payment details from the Supplier is inactive list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Scroll down and return to the top of the current view', async () => {
    await baseHelpers.returnToTopOfPaymentList(page);
  });
}

async function runTs18(page, data) {
  await reportStep('Open payment details from the Supplier is inactive list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Open history in payment details', async () => {
    await baseHelpers.clickDetailButton(page, imremitLiteDashboardSupplierIsInactiveSelectors.detail.history);
  });
}

async function runTs19(page, data) {
  await runTs01(page, data);
  await reportStep('Verify the account number field is visible and accepts text', async () => {
    await assertSearchInputVisible(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.accountNumberInput);
    await fillSearchInput(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.accountNumberInput, '123456789');
  });
}

async function runTs20(page, data) {
  await runTs01(page, data);
  await reportStep('Verify the payment number field is visible and accepts text', async () => {
    await assertSearchInputVisible(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.paymentNumberInput);
    await fillSearchInput(page, imremitLiteDashboardSupplierIsInactiveSelectors.list.paymentNumberInput, 'JUN34234E052025');
  });
}

async function runScenario(page, data, scenarioName) {
  const name = String(scenarioName);

  if (name.includes('TS_12') && /Dashboard_Filter_dropdown/i.test(name)) {
    return runTs12DashboardFilter(page, data);
  }

  if (name.includes('TS_12') && /Add_Comment_button/i.test(name)) {
    return runTs12AddComment(page, data);
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
    TS_13: runTs13,
    TS_14: runTs14,
    TS_15: runTs15,
    TS_16: runTs16,
    TS_17: runTs17,
    TS_18: runTs18,
    TS_19: runTs19,
    TS_20: runTs20
  };

  const scenarioKey = Object.keys(scenarioMap).find((key) => name.includes(key));
  if (!scenarioKey) {
    throw new Error(`imREmit Lite Dashboard Supplier is inactive scenario not implemented: ${scenarioName}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

module.exports = {
  imremitLiteDashboardSupplierIsInactiveHelpers: {
    openModule,
    openDashboard,
    selectCustomer,
    openDashboardWorkspace,
    openSupplierIsInactiveList,
    openActionsMenu,
    openPaymentDetails,
    choosePaginationOption,
    clickPaginationWhenEnabled,
    openAdvancedSearch,
    chooseDateRange,
    chooseDashboardFilterOptions,
    openCommentsSection,
    addComment,
    openInvoicesSection,
    openHistorySection,
    openNextPayment,
    openPreviousPayment,
    returnToPaymentList,
    returnToTopOnPaymentDetails,
    revealCardDetails,
    openMapPayment,
    searchByAccountNumber,
    searchByPaymentNumber,
    assertPaymentManagementVisible,
    runScenario,
    selectors: imremitLiteDashboardSupplierIsInactiveSelectors,
    ...wrapHelperMapWithReadableSteps({
      openModule,
      openDashboard,
      selectCustomer,
      openDashboardWorkspace,
      openSupplierIsInactiveList,
      openActionsMenu,
      openPaymentDetails,
      openColumnView: baseHelpers.openColumnView,
      choosePaginationOption,
      clickPaginationWhenEnabled,
      openAdvancedSearch,
      chooseDateRange,
      chooseDashboardFilterOptions,
      openCommentsSection,
      clickDetailButton: baseHelpers.clickDetailButton,
      ensurePreviousPaymentEnabled: baseHelpers.ensurePreviousPaymentEnabled,
      addComment,
      openInvoicesSection,
      openHistorySection,
      openNextPayment,
      openPreviousPayment,
      returnToPaymentList,
      returnToTopOnPaymentDetails,
      revealCardDetails,
      openMapPayment,
      searchByAccountNumber,
      searchByPaymentNumber,
      returnToTopOfPaymentList: baseHelpers.returnToTopOfPaymentList,
      applyHeaderActions,
      assertPaymentManagementVisible,
      selectors: imremitLiteDashboardSupplierIsInactiveSelectors
    }, {
      openModule: 'Open imREmit Lite module',
      openDashboard: 'Open imREmit Lite dashboard',
      selectCustomer: 'Select dashboard customer',
      openDashboardWorkspace: 'Open dashboard workspace',
      openSupplierIsInactiveList: 'Open Supplier is inactive list',
      openActionsMenu: 'Open payment row actions menu',
      openPaymentDetails: 'Open payment details',
      openColumnView: 'Open column view control',
      choosePaginationOption: 'Choose pagination option',
      clickPaginationWhenEnabled: 'Click pagination control when enabled',
      openAdvancedSearch: 'Open advanced search panel',
      chooseDateRange: 'Choose date range',
      chooseDashboardFilterOptions: 'Choose dashboard filter options',
      openCommentsSection: 'Open comments section',
      clickDetailButton: 'Click payment detail action',
      ensurePreviousPaymentEnabled: 'Ensure previous payment action is enabled',
      addComment: 'Add payment comment',
      openInvoicesSection: 'Open invoices section',
      openHistorySection: 'Open history section',
      openNextPayment: 'Open next payment',
      openPreviousPayment: 'Open previous payment',
      returnToPaymentList: 'Return to payment list',
      returnToTopOnPaymentDetails: 'Return to top on payment details',
      revealCardDetails: 'Reveal card details',
      openMapPayment: 'Open map payment dialog',
      searchByAccountNumber: 'Search by account number',
      searchByPaymentNumber: 'Search by payment number',
      returnToTopOfPaymentList: 'Return to top of payment list',
      applyHeaderActions: 'Apply header menu action',
      assertPaymentManagementVisible: 'Assert payment management view is visible'
    })
  }
};
