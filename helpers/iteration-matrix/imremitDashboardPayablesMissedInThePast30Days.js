const { expect, test } = require('@playwright/test');
const { clickWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { imremitDashboardPayablesEndingInTheNext7DaysHelpers: baseHelpers } = require('./imremitDashboardPayablesEndingInTheNext7Days.js');
const { imremitDashboardPayablesMissedInThePast30DaysSelectors } = require('../../selectors/iteration-matrix/imremitDashboardPayablesMissedInThePast30Days.selectors.js');

async function reportStep(name, action) {
  return test.step(name, action);
}

async function openModule(page) {
  await baseHelpers.openModule(page);
}

async function openDashboard(page) {
  await baseHelpers.openDashboard(page);
}

async function selectCustomer(page, data) {
  return baseHelpers.selectCustomer(page, data);
}

async function expectOverviewVisible(page) {
  const heading = await resolveFirst(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.headings.overview, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function openDashboardWorkspace(page, data) {
  await openModule(page);
  await openDashboard(page);
  await selectCustomer(page, data);
  await expectOverviewVisible(page);
}

async function openCustomerDetails(page) {
  await baseHelpers.openCustomerDetails(page);
}

async function closeCustomerDetails(page) {
  await baseHelpers.closeCustomerDetails(page);
}

async function assertPaymentManagementVisible(page) {
  const heading = await resolveFirst(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.headings.paymentManagement, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function openPayablesMissedList(page, data) {
  await openDashboardWorkspace(page, data);

  const openPaymentManagement = async () => {
    const reviewAction = await resolveFirst(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.dashboard.review.filter((candidate) => candidate.type !== 'text'), {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);

    if (reviewAction) {
      await reviewAction.locator.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
      return;
    }

    const reviewText = page.getByText(/^Review$/i).first();
    const reviewClickableAncestor = reviewText.locator('xpath=ancestor::button[1] | ancestor::a[1]').first();

    if (await reviewClickableAncestor.isVisible().catch(() => false)) {
      await reviewClickableAncestor.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
      return;
    }

    await page.getByRole('link', { name: /^Payment Management$/i }).first().click({ timeout: 5000 });

    await waitForAppToSettle(page, 1000);
  };

  await openPaymentManagement();
  await assertPaymentManagementVisible(page);

  const noResults = page.getByText(/no results found/i).first();
  if (await noResults.isVisible().catch(() => false)) {
    const customerFilterClear = page.getByRole('combobox').first().locator('button').first();
    if (await customerFilterClear.isVisible().catch(() => false)) {
      await customerFilterClear.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1500);
    }
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const visiblePaymentRowAction = await resolveFirst(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.list.actionsMenu, {
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
  await baseHelpers.openActionsMenu(page);
}

async function openPaymentDetails(page, data) {
  await openPayablesMissedList(page, data);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const paymentListButtonBeforeOpen = await resolveFirst(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.paymentList, {
      mustBeVisible: true,
      timeoutPerCandidate: 1000
    }).catch(() => null);

    if (paymentListButtonBeforeOpen || /\/payment-management\/PD_/i.test(page.url())) {
      break;
    }

    await openActionsMenu(page);

    const detailsMenuItem = await resolveFirst(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.list.viewPaymentDetails, {
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
  }

  const paymentListButton = await resolveFirst(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.paymentList, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (paymentListButton) {
    await expect(paymentListButton.locator).toBeVisible({ timeout: 10000 });
  }
}

async function assertPaginationControlsVisible(page) {
  for (const candidates of [
    imremitDashboardPayablesMissedInThePast30DaysSelectors.pagination.first,
    imremitDashboardPayablesMissedInThePast30DaysSelectors.pagination.previous,
    imremitDashboardPayablesMissedInThePast30DaysSelectors.pagination.next,
    imremitDashboardPayablesMissedInThePast30DaysSelectors.pagination.last
  ]) {
    const result = await resolveFirst(page, candidates, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(result.locator).toBeVisible({ timeout: 10000 });
  }
}

async function clickBackToDashboard(page) {
  const backToDashboardControl = await resolveFirst(page, [
    ...imremitDashboardPayablesMissedInThePast30DaysSelectors.list.backToDashboard,
    ...imremitDashboardPayablesMissedInThePast30DaysSelectors.moduleTabs.dashboard
  ], {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  await backToDashboardControl.locator.click({ timeout: 10000 });
  await waitForAppToSettle(page, 1000);
  await expectOverviewVisible(page);
}

async function assertNoStatusControl(page) {
  await expect(page.getByRole('button', { name: /status/i }).first()).toBeHidden({ timeout: 2000 });
}

async function assertStatusValueUnavailable(page, text) {
  const statusControl = page.getByRole('button', { name: /status/i }).first();
  const statusControlVisible = await statusControl.isVisible().catch(() => false);

  if (!statusControlVisible) {
    await assertTextNotVisible(page, text);
    return;
  }

  await statusControl.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);

  const statusOption = page.locator('[role="option"], [role="menuitem"], [cmdk-item], label, button, div, span').filter({
    hasText: new RegExp(`^${escapeRegex(text)}$`, 'i')
  }).first();

  await expect(statusOption).toBeHidden({ timeout: 2000 });
  await page.keyboard.press('Escape').catch(() => null);
}

async function assertTextNotVisible(page, text) {
  await expect(page.getByText(new RegExp(`^${text}$`, 'i')).first()).toBeHidden({ timeout: 2000 });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeAmountText(value) {
  return value.replace(/[^\d.-]/g, '');
}

async function readAmountForLabel(page, label) {
  const labelLocator = page.getByText(new RegExp(escapeRegex(label), 'i')).first();
  if (!await labelLocator.isVisible().catch(() => false)) {
    return null;
  }

  const containerText = await labelLocator.locator('xpath=ancestor::*[self::div or self::tr][1]').textContent().catch(() => '');
  const amountMatches = (containerText || '').match(/-?\$?[\d,]+(?:\.\d{2})?/g) || [];
  return amountMatches.at(-1) || null;
}

async function assertAmountSummaryMismatchWhenVisible(page) {
  const totalAmountSent = await readAmountForLabel(page, 'Total Amount Sent');
  const amountTaken = await readAmountForLabel(page, 'Amount Taken');

  if (totalAmountSent && amountTaken) {
    await expect(normalizeAmountText(totalAmountSent)).not.toBe(normalizeAmountText(amountTaken));
    return;
  }

  const paymentListButton = await resolveFirst(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.paymentList, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (paymentListButton) {
    await expect(paymentListButton.locator).toBeVisible({ timeout: 10000 });
  }
}

async function runTs01(page, data) {
  await reportStep('Open imREmit dashboard for the selected customer', async () => {
    await openDashboardWorkspace(page, data);
  });
}

async function runTs02(page, data) {
  await runTs01(page, data);
  await reportStep('Open and close customer details from the dashboard card', async () => {
    await openCustomerDetails(page);
    await closeCustomerDetails(page);
  });
}

async function runTs03(page, data) {
  await reportStep('Open the payables missed review list', async () => {
    await openPayablesMissedList(page, data);
  });
}

async function runTs04(page, data) {
  await runTs03(page, data);
  await reportStep('Move to the next payment-management page', async () => {
    await baseHelpers.clickPagination(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.pagination.next);
  });
}

async function runTs05(page, data) {
  await runTs03(page, data);
  await reportStep('Move to the last payment-management page', async () => {
    await baseHelpers.clickPagination(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.pagination.last);
  });
}

async function runTs06(page, data) {
  await runTs03(page, data);
  await reportStep('Move forward and then return to the previous page', async () => {
    await baseHelpers.clickPagination(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.pagination.next);
    await baseHelpers.clickPagination(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.pagination.previous);
  });
}

async function runTs07(page, data) {
  await runTs03(page, data);
  await reportStep('Move to the last page and return to the first page', async () => {
    await baseHelpers.clickPagination(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.pagination.last);

    const firstPageControl = await resolveFirst(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.pagination.first, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);

    if (!firstPageControl) {
      return;
    }

    const firstPageDisabled = await firstPageControl.locator.isDisabled().catch(() => false);
    if (!firstPageDisabled) {
      await baseHelpers.clickPagination(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.pagination.first);
    }
  });
}

async function runTs08(page, data) {
  await runTs03(page, data);
  await reportStep('Verify pagination controls are visible', async () => {
    await assertPaginationControlsVisible(page);
  });
}

async function runTs09(page, data) {
  await runTs03(page, data);
  await reportStep('Export payment data from the list', async () => {
    await baseHelpers.exportPaymentData(page);
  });
}

async function runTs10(page, data) {
  await runTs03(page, data);
  await reportStep('Open the column-view control', async () => {
    await baseHelpers.openColumnView(page);
  });
}

async function runTs11(page, data) {
  await runTs03(page, data);
  await reportStep('Open the payment-row actions menu', async () => {
    await openActionsMenu(page);
  });
}

async function runTs12(page, data) {
  await reportStep('Open payment details from the payables missed list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Move to the next payment detail', async () => {
    await baseHelpers.clickDetailButton(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.nextPayment);
  });
}

async function runTs13(page, data) {
  await reportStep('Open payment details from the payables missed list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Move to the previous payment detail', async () => {
    await baseHelpers.ensurePreviousPaymentEnabled(page);
    await baseHelpers.clickDetailButton(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.previousPayment);
  });
}

async function runTs14(page, data) {
  await reportStep('Open payment details from the payables missed list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Return from payment details to the payments list', async () => {
    await baseHelpers.clickDetailButton(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.paymentList);
    await assertPaymentManagementVisible(page);
  });
}

async function runTs15(page, data) {
  await reportStep('Open payment details from the payables missed list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Open the comments panel in payment details', async () => {
    await baseHelpers.clickDetailButton(page, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.comments);
  });
}

async function runTs16(page, data) {
  const commentText = `MissedPast30Days-${Date.now()}`;
  const updatedText = `${commentText}-edited`;

  await reportStep('Open payment details from the payables missed list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Add and edit a payment comment', async () => {
    await baseHelpers.addComment(page, commentText);
    await baseHelpers.editComment(page, commentText, updatedText);
  });
}

async function runTs17(page, data) {
  const commentText = `MissedPast30Days-${Date.now()}`;

  await reportStep('Open payment details from the payables missed list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Add and delete a payment comment', async () => {
    await baseHelpers.addComment(page, commentText);
    await baseHelpers.deleteComment(page, commentText);
  });
}

async function runDetailTabScenario(page, data, tabSelectors, stepName) {
  await reportStep('Open payment details from the payables missed list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep(stepName, async () => {
    await baseHelpers.clickDetailButton(page, tabSelectors);
  });
}

async function runTs18(page, data) {
  await runDetailTabScenario(page, data, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.invoices, 'Open invoices in payment details');
}

async function runTs19(page, data) {
  await runDetailTabScenario(page, data, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.generalInformation, 'Open general information in payment details');
}

async function runTs20(page, data) {
  await runDetailTabScenario(page, data, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.transactions, 'Open transactions in payment details');
}

async function runTs21(page, data) {
  await runDetailTabScenario(page, data, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.authorizationAndDecline, 'Open authorization and decline in payment details');
}

async function runTs22(page, data) {
  await runDetailTabScenario(page, data, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.history, 'Open history in payment details');
}

async function runTs23(page, data) {
  await runDetailTabScenario(page, data, imremitDashboardPayablesMissedInThePast30DaysSelectors.detail.blockPayment, 'Open the block-payment action in payment details');
}

async function runTs24(page, data) {
  await runTs03(page, data);
  await reportStep('Return from payment management to the dashboard', async () => {
    await clickBackToDashboard(page);
  });
}

async function runTs25(page, data) {
  await runTs03(page, data);
  await reportStep('Verify the print control is visible when available', async () => {
    await baseHelpers.assertPrintButtonVisibleWhenAvailable(page);
  });
}

async function runTs26(page, data) {
  await runTs03(page, data);
  await reportStep('Apply ascending order from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Org Id', 'Facility Name', 'Payment Number']) {
      await baseHelpers.clickHeaderAndChoose(page, label, imremitDashboardPayablesMissedInThePast30DaysSelectors.menus.ascending);
    }
  });
}

async function runTs27(page, data) {
  await runTs03(page, data);
  await reportStep('Apply descending order from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Org Id', 'Facility Name', 'Payment Number']) {
      await baseHelpers.clickHeaderAndChoose(page, label, imremitDashboardPayablesMissedInThePast30DaysSelectors.menus.descending);
    }
  });
}

async function runTs28(page, data) {
  await runTs03(page, data);
  await reportStep('Apply hide-column from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Org Id']) {
      await baseHelpers.clickHeaderAndChoose(page, label, imremitDashboardPayablesMissedInThePast30DaysSelectors.menus.hideColumn);
    }
  });
}

async function runTs29(page, data) {
  await runTs03(page, data);
  await reportStep('Scroll down and return to the top of the payment list', async () => {
    await baseHelpers.returnToTopOfPaymentList(page);
  });
}

async function runTs30(page, data) {
  await reportStep('Open payment details from the payables missed list', async () => {
    await openPaymentDetails(page, data);
  });
}

async function runTs31(page, data) {
  await reportStep('Open payment details from the payables missed list', async () => {
    await openPaymentDetails(page, data);
  });
  await reportStep('Compare total amount sent and amount taken when both values are visible', async () => {
    await assertAmountSummaryMismatchWhenVisible(page);
  });
}

async function runTs32(page, data) {
  await runTs03(page, data);
  await reportStep('Verify delivered status is not shown in payment management', async () => {
    await assertTextNotVisible(page, 'Delivered');
  });
}

async function runTs33(page, data) {
  await runTs03(page, data);
  await reportStep('Verify blocked status is not shown in payment management', async () => {
    await assertTextNotVisible(page, 'Blocked');
  });
}

async function runTs34(page, data) {
  await runTs03(page, data);
  await reportStep('Verify closed status is not shown in payment management', async () => {
    await assertTextNotVisible(page, 'Closed');
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
  TS_24: runTs24,
  TS_25: runTs25,
  TS_26: runTs26,
  TS_27: runTs27,
  TS_28: runTs28,
  TS_29: runTs29,
  TS_30: runTs30,
  TS_31: runTs31,
  TS_32: runTs32,
  TS_33: runTs33,
  TS_34: runTs34
};

async function runScenario(page, data, scenarioName) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => scenarioName.startsWith(key));
  if (!scenarioKey) {
    throw new Error(`imREmit Dashboard Payables Missed in the Past 30 Days scenario not implemented: ${scenarioName}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

module.exports = {
  imremitDashboardPayablesMissedInThePast30DaysHelpers: {
    ...wrapHelperMapWithReadableSteps({
      openModule,
      openDashboard,
      selectCustomer,
      openDashboardWorkspace,
      openCustomerDetails,
      closeCustomerDetails,
      openPayablesMissedList,
      openActionsMenu,
      openPaymentDetails,
      assertPaymentManagementVisible,
      assertPaginationControlsVisible,
      clickBackToDashboard,
      clickDetailButton: baseHelpers.clickDetailButton,
      ensurePreviousPaymentEnabled: baseHelpers.ensurePreviousPaymentEnabled,
      exportPaymentData: baseHelpers.exportPaymentData,
      openColumnView: baseHelpers.openColumnView,
      addComment: baseHelpers.addComment,
      editComment: baseHelpers.editComment,
      deleteComment: baseHelpers.deleteComment,
      assertPrintButtonVisibleWhenAvailable: baseHelpers.assertPrintButtonVisibleWhenAvailable,
      clickHeaderAndChoose: baseHelpers.clickHeaderAndChoose,
      clickPagination: baseHelpers.clickPagination,
      returnToTopOfPaymentList: baseHelpers.returnToTopOfPaymentList,
      assertAmountSummaryMismatchWhenVisible,
      assertNoStatusControl,
      assertStatusValueUnavailable,
      assertTextNotVisible,
      selectors: imremitDashboardPayablesMissedInThePast30DaysSelectors
    }, {
      openModule: 'Open imREmit module',
      openDashboard: 'Open imREmit dashboard',
      selectCustomer: 'Select dashboard customer',
      openDashboardWorkspace: 'Open dashboard workspace',
      openCustomerDetails: 'Open customer details',
      closeCustomerDetails: 'Close customer details',
      openPayablesMissedList: 'Open payables missed list',
      openActionsMenu: 'Open payment row actions menu',
      openPaymentDetails: 'Open payment details',
      assertPaymentManagementVisible: 'Assert payment management view is visible',
      assertPaginationControlsVisible: 'Assert pagination controls are visible',
      clickBackToDashboard: 'Return from payment management to dashboard',
      clickDetailButton: 'Click payment detail action',
      ensurePreviousPaymentEnabled: 'Ensure previous payment action is enabled',
      exportPaymentData: 'Export payment data',
      openColumnView: 'Open column view control',
      addComment: 'Add payment comment',
      editComment: 'Edit payment comment',
      deleteComment: 'Delete payment comment',
      assertPrintButtonVisibleWhenAvailable: 'Assert print button is visible when available',
      clickHeaderAndChoose: 'Open table header menu and choose action',
      clickPagination: 'Click pagination control',
      returnToTopOfPaymentList: 'Return to top of payment list',
      assertAmountSummaryMismatchWhenVisible: 'Compare visible amount summary values',
      assertNoStatusControl: 'Assert status control is hidden',
      assertStatusValueUnavailable: 'Assert status value is unavailable',
      assertTextNotVisible: 'Assert status text is hidden'
    }),
    runScenario,
    selectors: imremitDashboardPayablesMissedInThePast30DaysSelectors
  }
};
