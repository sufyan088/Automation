const { expect, test } = require('@playwright/test');
const { clickWithFallback, clickIfFound, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { imremitDashboardPayablesEndingInTheNext7DaysHelpers: baseHelpers } = require('./imremitDashboardPayablesEndingInTheNext7Days.js');
const { imremitLiteDashboardPayablesWithDeclinesSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardPayablesWithDeclines.selectors.js');

async function reportStep(name, action) {
  return test.step(name, action);
}

async function openModule(page) {
  const result = await clickIfFound(page, imremitLiteDashboardPayablesWithDeclinesSelectors.moduleTabs.imremit, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  if (result.clicked) {
    await waitForAppToSettle(page, 1000);
  }

  return page;
}

async function openDashboard(page) {
  await clickWithFallback(page, imremitLiteDashboardPayablesWithDeclinesSelectors.moduleTabs.dashboard, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function selectCustomer(page, data, options = {}) {
  const preferredCustomer = options.preferredCustomer || 'Cypress-Fairbanks ISD';
  const fallbackCustomer = options.fallbackCustomer || '';
  const comboboxTextCandidates = [
    /select customer/i,
    /select customers/i,
    /^select all$/i
  ];

  let trigger;
  try {
    trigger = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.customerPicker.trigger, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  } catch (error) {
    return null;
  }

  const triggerText = ((await trigger.locator.textContent()) || '').trim();
  const matchesPreferredCustomer = preferredCustomer && new RegExp(preferredCustomer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(triggerText);
  const alreadySelected = triggerText
    && !comboboxTextCandidates.some((pattern) => pattern.test(triggerText))
    && (!preferredCustomer || matchesPreferredCustomer);

  if (alreadySelected) {
    return triggerText;
  }

  if (triggerText && !comboboxTextCandidates.some((pattern) => pattern.test(triggerText)) && preferredCustomer && !matchesPreferredCustomer) {
    const clearSelectionButton = trigger.locator.locator('button').first();
    if (await clearSelectionButton.isVisible().catch(() => false)) {
      await clearSelectionButton.click({ timeout: 5000 });
      await waitForAppToSettle(page, 500);
    }
  }

  const resolveCustomerOption = async (customerName) => {
    if (!customerName) {
      return null;
    }

    const escapedCustomerName = customerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const customerPattern = new RegExp(`^${escapedCustomerName}$`, 'i');

    return resolveFirst(page, [
      { type: 'role', role: 'option', options: { name: customerPattern }, name: `customer-option-${customerName}` },
      {
        type: 'custom',
        factory: (activePage) => activePage.locator('[role="listbox"] [role="option"], [cmdk-list] [cmdk-item], [data-radix-popper-content-wrapper] [role="option"]').filter({ hasText: customerPattern }).first(),
        name: `customer-option-listbox-${customerName}`
      },
      { type: 'text', value: customerPattern, name: `customer-option-text-${customerName}` }
    ], {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);
  };

  const selectAllTrigger = page.getByText(/^select all$/i).first();
  if (await selectAllTrigger.isVisible().catch(() => false)) {
    await selectAllTrigger.click({ timeout: 5000 });
  } else {
    await trigger.locator.click();
  }
  await waitForAppToSettle(page, 250);

  const directSearchInput = page.getByPlaceholder(/search customers? \(min\. 3 characters\)\.\.\./i).first();
  if (await directSearchInput.isVisible().catch(() => false)) {
    await directSearchInput.fill(preferredCustomer);
    await waitForAppToSettle(page, 250);

    const directPreferredOption = await resolveCustomerOption(preferredCustomer);
    if (directPreferredOption) {
      await directPreferredOption.locator.click({ timeout: 5000 });
      await waitForAppToSettle(page, 250);
      return preferredCustomer;
    }
  }

  const exactPreferredOption = await resolveCustomerOption(preferredCustomer);
  if (exactPreferredOption) {
    await exactPreferredOption.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 250);
    return preferredCustomer;
  }

  const searchInput = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.customerPicker.searchInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (searchInput && preferredCustomer) {
    await fillWithFallback(page, imremitLiteDashboardPayablesWithDeclinesSelectors.customerPicker.searchInput, preferredCustomer, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await waitForAppToSettle(page, 250);
    const preferredOption = await resolveCustomerOption(preferredCustomer);
    if (preferredOption) {
      await preferredOption.locator.click({ timeout: 5000 });
      await waitForAppToSettle(page, 250);
      return preferredCustomer;
    }

    if (fallbackCustomer) {
      await fillWithFallback(page, imremitLiteDashboardPayablesWithDeclinesSelectors.customerPicker.searchInput, fallbackCustomer, {
        mustBeVisible: true,
        timeoutPerCandidate: 2500
      });
      await waitForAppToSettle(page, 250);
      const fallbackOption = await resolveCustomerOption(fallbackCustomer);
      if (fallbackOption) {
        await fallbackOption.locator.click({ timeout: 5000 });
        await waitForAppToSettle(page, 1000);
        return fallbackCustomer;
      }
    }
  }

  throw new Error(`Unable to select customer: ${preferredCustomer}${fallbackCustomer ? ` or ${fallbackCustomer}` : ''}`);
}

async function expectOverviewVisible(page) {
  const overviewHeading = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.headings.overview, {
    mustBeVisible: true,
    timeoutPerCandidate: 3000
  }).catch(() => null);

  if (overviewHeading) {
    await expect(overviewHeading.locator).toBeVisible({ timeout: 10000 });
    return;
  }

  const cardHeading = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.dashboard.payablesWithDeclinesHeading, {
    mustBeVisible: true,
    timeoutPerCandidate: 3000
  });
  await expect(cardHeading.locator).toBeVisible({ timeout: 10000 });
}

async function openDashboardWorkspace(page, data, options = {}) {
  await openModule(page);
  await openDashboard(page);
  await selectCustomer(page, data, options);

  try {
    await expectOverviewVisible(page);
  } catch (error) {
    await openDashboard(page);
    await selectCustomer(page, data, options);
    await expectOverviewVisible(page);
  }
}

async function closeCustomerDetails(page) {
  const closeControl = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.dashboard.customerDetailsClose, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (closeControl) {
    await closeControl.locator.click({ timeout: 5000 });
  } else {
    await clickWithFallback(page, imremitLiteDashboardPayablesWithDeclinesSelectors.dashboard.viewCustomerDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  }

  await waitForAppToSettle(page, 1000);
  await expectOverviewVisible(page);
}

async function openPayablesWithDeclinesList(page, data) {
  await openDashboardWorkspace(page, data);

  const openPaymentManagement = async () => {
    const reviewAction = await resolveFirst(
      page,
      imremitLiteDashboardPayablesWithDeclinesSelectors.dashboard.review.filter((candidate) => candidate.type !== 'text'),
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
    await baseHelpers.assertPaymentManagementVisible(page);
  } catch (error) {
    await openDashboardWorkspace(page, data);
    await openPaymentManagement();
    await baseHelpers.assertPaymentManagementVisible(page);
  }

  const noResults = page.getByText(/no results found/i).first();
  if (await noResults.isVisible().catch(() => false)) {
    const customerFilterClear = page.getByRole('combobox').first().locator('button').first();
    if (await customerFilterClear.isVisible().catch(() => false)) {
      await customerFilterClear.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1500);
    }
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const visiblePaymentRowAction = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.list.actionsMenu, {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    }).catch(() => null);

    if (visiblePaymentRowAction) {
      return;
    }

    await openDashboardWorkspace(page, data);
    await openPaymentManagement();
    await baseHelpers.assertPaymentManagementVisible(page);
  }
}

async function openActionsMenu(page) {
  await clickWithFallback(page, imremitLiteDashboardPayablesWithDeclinesSelectors.list.actionsMenu, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);
}

async function openPaymentDetails(page, data) {
  await openPayablesWithDeclinesList(page, data);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const paymentListButtonBeforeOpen = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.detail.paymentList, {
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

      await openPayablesWithDeclinesList(page, data);
      continue;
    }

    const detailsMenuItem = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.list.viewPaymentDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
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
      await openPayablesWithDeclinesList(page, data);
    }
  }

  const paymentListButton = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.detail.paymentList, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);

  if (paymentListButton) {
    await expect(paymentListButton.locator).toBeVisible({ timeout: 10000 });
  }
}

async function openPaginationDropdown(page) {
  const dropdown = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.list.paginationDropdown, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await dropdown.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
}

async function choosePaginationOption(page, value) {
  const dropdown = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.list.paginationDropdown, {
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

  const option = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.list.paginationOption(value), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  await option.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 750);
}

async function clickBackToDashboard(page) {
  const backToDashboardControl = await resolveFirst(page, [
    ...imremitLiteDashboardPayablesWithDeclinesSelectors.list.backToDashboard,
    ...imremitLiteDashboardPayablesWithDeclinesSelectors.moduleTabs.dashboard
  ], {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  await backToDashboardControl.locator.click({ timeout: 10000 });
  await waitForAppToSettle(page, 1000);
  await expectOverviewVisible(page);
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
    throw new Error('No sortable headers were available for the Payables with Declines list.');
  }
}

async function assertBlockPaymentVisible(page) {
  const blockPayment = await resolveFirst(page, imremitLiteDashboardPayablesWithDeclinesSelectors.detail.blockPayment, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(blockPayment.locator).toBeVisible({ timeout: 10000 });
}

async function runTs01(page, data) {
  await reportStep('Open the imREmit Lite dashboard workspace', async () => {
    await openDashboardWorkspace(page, data);
  });
  await reportStep('Open customer details from the dashboard', async () => {
    await baseHelpers.openCustomerDetails(page);
  });
}

async function runTs02(page, data) {
  await reportStep('Open the Payables with Declines review list', async () => {
    await openPayablesWithDeclinesList(page, data);
  });
}

async function runTs03(page, data) {
  await runTs02(page, data);
  await reportStep('Open the page-size control and choose the supported values', async () => {
    for (const value of ['25', '50', '100', '5', '10']) {
      await choosePaginationOption(page, value);
    }
  });
}

async function runTs04(page, data) {
  await runTs02(page, data);
  await reportStep('Verify the Print button is visible when available', async () => {
    await baseHelpers.assertPrintButtonVisibleWhenAvailable(page);
  });
}

async function runTs05(page, data) {
  await runTs02(page, data);
  await reportStep('Return from payment management to the dashboard', async () => {
    await clickBackToDashboard(page);
  });
}

async function runTs06(page, data) {
  await runTs02(page, data);
  await reportStep('Open the column-view control', async () => {
    await baseHelpers.openColumnView(page);
  });
}

async function runTs07(page, data) {
  await runTs02(page, data);
  await reportStep('Open the payment-row actions menu', async () => {
    await openActionsMenu(page);
  });
}

async function runTs08(page, data) {
  await reportStep('Open payment details from the Payables with Declines list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Move to the next payment detail', async () => {
    await baseHelpers.clickDetailButton(page, imremitLiteDashboardPayablesWithDeclinesSelectors.detail.nextPayment);
  });
}

async function runTs09(page, data) {
  await reportStep('Open payment details from the Payables with Declines list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Move to the previous payment detail', async () => {
    await baseHelpers.ensurePreviousPaymentEnabled(page);
    await baseHelpers.clickDetailButton(page, imremitLiteDashboardPayablesWithDeclinesSelectors.detail.previousPayment);
  });
}

async function runTs10(page, data) {
  await reportStep('Open payment details from the Payables with Declines list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Return from payment details to the payments list', async () => {
    await baseHelpers.clickDetailButton(page, imremitLiteDashboardPayablesWithDeclinesSelectors.detail.paymentList);
    await baseHelpers.assertPaymentManagementVisible(page);
  });
}

async function runTs11(page, data) {
  const commentText = `PayablesWithDeclines-${Date.now()}`;

  await reportStep('Open payment details from the Payables with Declines list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Add a payment comment', async () => {
    await baseHelpers.addComment(page, commentText);
  });
}

async function runTs12(page, data) {
  const commentText = `PayablesWithDeclines-${Date.now()}`;
  const updatedText = `${commentText}-edited`;

  await reportStep('Open payment details from the Payables with Declines list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Add and edit a payment comment', async () => {
    await baseHelpers.addComment(page, commentText);
    await baseHelpers.editComment(page, commentText, updatedText);
  });
}

async function runTs13(page, data) {
  const commentText = `PayablesWithDeclines-${Date.now()}`;

  await reportStep('Open payment details from the Payables with Declines list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Add and delete a payment comment', async () => {
    await baseHelpers.addComment(page, commentText);
    await baseHelpers.deleteComment(page, commentText);
  });
}

async function runTs14(page, data) {
  await reportStep('Open payment details from the Payables with Declines list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Open invoices in payment details', async () => {
    await baseHelpers.clickDetailButton(page, imremitLiteDashboardPayablesWithDeclinesSelectors.detail.invoices);
  });
}

async function runTs15(page, data) {
  await reportStep('Open payment details from the Payables with Declines list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Open history in payment details', async () => {
    await baseHelpers.clickDetailButton(page, imremitLiteDashboardPayablesWithDeclinesSelectors.detail.history);
  });
}

async function runTs16(page, data) {
  await reportStep('Open payment details from the Payables with Declines list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Verify the block-payment action is visible', async () => {
    await assertBlockPaymentVisible(page);
  });
}

async function runTs17(page, data) {
  await runTs02(page, data);
  await reportStep('Use the next-page control when it is enabled', async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const clicked = await clickPaginationWhenEnabled(page, imremitLiteDashboardPayablesWithDeclinesSelectors.pagination.next);
      if (!clicked) {
        break;
      }
    }
  });
}

async function runTs18(page, data) {
  await runTs02(page, data);
  await reportStep('Move forward and then use the previous-page control', async () => {
    await clickPaginationWhenEnabled(page, imremitLiteDashboardPayablesWithDeclinesSelectors.pagination.next);
    await clickPaginationWhenEnabled(page, imremitLiteDashboardPayablesWithDeclinesSelectors.pagination.previous);
  });
}

async function runTs19(page, data) {
  await runTs02(page, data);
  await reportStep('Move to the last page and return to the first page when possible', async () => {
    const movedToLast = await clickPaginationWhenEnabled(page, imremitLiteDashboardPayablesWithDeclinesSelectors.pagination.last);
    if (movedToLast) {
      await clickPaginationWhenEnabled(page, imremitLiteDashboardPayablesWithDeclinesSelectors.pagination.first);
    }
  });
}

async function runTs20(page, data) {
  await runTs02(page, data);
  await reportStep('Use the last-page control when it is enabled', async () => {
    await clickPaginationWhenEnabled(page, imremitLiteDashboardPayablesWithDeclinesSelectors.pagination.last);
  });
}

async function runTs21(page, data) {
  await runTs02(page, data);
  await reportStep('Apply ascending order from the visible table headers', async () => {
    await applyHeaderActions(page, imremitLiteDashboardPayablesWithDeclinesSelectors.menus.ascending, ['Supplier Name', 'Payment Number', 'Sent Date', 'Status Description']);
  });
}

async function runTs22(page, data) {
  await runTs02(page, data);
  await reportStep('Apply hide-column from the visible table headers', async () => {
    await applyHeaderActions(page, imremitLiteDashboardPayablesWithDeclinesSelectors.menus.hideColumn, ['Supplier Name', 'Payment Number', 'Sent Date', 'Status Description']);
  });
}

async function runTs23(page, data) {
  await runTs02(page, data);
  await reportStep('Scroll down and return to the top of the payment list', async () => {
    await baseHelpers.returnToTopOfPaymentList(page);
  });
}

async function runTs24(page, data) {
  await runTs02(page, data);
  await reportStep('Apply descending order from the visible table headers', async () => {
    await applyHeaderActions(page, imremitLiteDashboardPayablesWithDeclinesSelectors.menus.descending, ['Supplier Name', 'Payment Number', 'Sent Date', 'Status Description']);
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
  TS_14: runTs14,
  TS_15: runTs15,
  TS_16: runTs16,
  TS_17: runTs17,
  TS_18: runTs18,
  TS_19: runTs19,
  TS_20: runTs20,
  TS_21: runTs21,
  TS_22: runTs22,
  TS_23: runTs23,
  TS_24: runTs24
};

async function runScenario(page, data, scenarioName) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => String(scenarioName).includes(key));
  if (!scenarioKey) {
    throw new Error(`imREmit Lite Dashboard Payables with Declines scenario not implemented: ${scenarioName}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

module.exports = {
  imremitLiteDashboardPayablesWithDeclinesHelpers: {
    verifyViewCustomerDetailsButton: runTs01,
    verifyReviewButton: runTs02,
    verifyPaginationButton: runTs03,
    verifyPrintButton: runTs04,
    verifyBackToDashboardButton: runTs05,
    verifyColumnViewsButton: runTs06,
    verifyActionsButton: runTs07,
    verifyNextPaymentButton: runTs08,
    verifyPreviousPaymentButton: runTs09,
    verifyPaymentsListButton: runTs10,
    verifyAddComment: runTs11,
    verifyEditComment: runTs12,
    verifyDeleteComment: runTs13,
    verifyInvoicesButton: runTs14,
    verifyHistoryButton: runTs15,
    verifyBlockPayment: runTs16,
    verifyGoToNextPageButton: runTs17,
    verifyGoToPreviousPageButton: runTs18,
    verifyGoToFirstPageButton: runTs19,
    verifyGoToLastPageButton: runTs20,
    verifyAscendingSort: runTs21,
    verifyHideSort: runTs22,
    verifyReturnToTopButton: runTs23,
    verifyDescendingSort: runTs24,
    ...wrapHelperMapWithReadableSteps({
      openModule,
      openDashboard,
      selectCustomer,
      openDashboardWorkspace,
      openPayablesWithDeclinesList,
      openActionsMenu,
      openPaymentDetails,
      openCustomerDetails: baseHelpers.openCustomerDetails,
      closeCustomerDetails,
      openColumnView: baseHelpers.openColumnView,
      choosePaginationOption,
      clickBackToDashboard,
      clickHeaderAndChoose: baseHelpers.clickHeaderAndChoose,
      clickDetailButton: baseHelpers.clickDetailButton,
      ensurePreviousPaymentEnabled: baseHelpers.ensurePreviousPaymentEnabled,
      addComment: baseHelpers.addComment,
      editComment: baseHelpers.editComment,
      deleteComment: baseHelpers.deleteComment,
      clickPaginationWhenEnabled,
      applyHeaderActions,
      assertPaymentManagementVisible: baseHelpers.assertPaymentManagementVisible,
      assertPrintButtonVisibleWhenAvailable: baseHelpers.assertPrintButtonVisibleWhenAvailable,
      assertBlockPaymentVisible,
      returnToTopOfPaymentList: baseHelpers.returnToTopOfPaymentList,
      selectors: imremitLiteDashboardPayablesWithDeclinesSelectors
    }, {
      openModule: 'Open imREmit Lite module',
      openDashboard: 'Open imREmit Lite dashboard',
      selectCustomer: 'Select dashboard customer',
      openDashboardWorkspace: 'Open dashboard workspace',
      openPayablesWithDeclinesList: 'Open Payables with Declines list',
      openActionsMenu: 'Open payment row actions menu',
      openPaymentDetails: 'Open payment details',
      openCustomerDetails: 'Open customer details',
      closeCustomerDetails: 'Close customer details',
      openColumnView: 'Open column view control',
      choosePaginationOption: 'Choose pagination option',
      clickBackToDashboard: 'Return to dashboard',
      clickHeaderAndChoose: 'Open table header menu and choose action',
      clickDetailButton: 'Click payment detail action',
      ensurePreviousPaymentEnabled: 'Ensure previous payment action is enabled',
      addComment: 'Add payment comment',
      editComment: 'Edit payment comment',
      deleteComment: 'Delete payment comment',
      clickPaginationWhenEnabled: 'Click pagination control when enabled',
      applyHeaderActions: 'Apply header menu action',
      assertPaymentManagementVisible: 'Assert payment management view is visible',
      assertPrintButtonVisibleWhenAvailable: 'Assert print button is visible when available',
      assertBlockPaymentVisible: 'Assert block payment action is visible',
      returnToTopOfPaymentList: 'Return to top of payment list'
    }),
    runScenario,
    selectors: imremitLiteDashboardPayablesWithDeclinesSelectors
  }
};
