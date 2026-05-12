const { expect, test } = require('@playwright/test');
const { clickWithFallback, clickIfFound, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { imremitDashboardFailedPaymentsOnImImErrorSelectors } = require('../../selectors/iteration-matrix/imremitDashboardFailedPaymentsOnImImError.selectors.js');

async function reportStep(name, action) {
  return test.step(name, action);
}

async function openModule(page) {
  await clickIfFound(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.moduleTabs.imremit, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
  return page;
}

async function openDashboard(page) {
  await clickWithFallback(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.moduleTabs.dashboard, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectOverviewVisible(page) {
  const heading = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.headings.overview, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function selectCustomer(page, data) {
  const preferredCustomer = 'Verizon Customer';
  const fallbackCustomer = data.CustomerName || data.Customer || data.Customer_Name || '';
  const comboboxTextCandidates = [
    /select customer/i,
    /select customers/i,
    /^select all$/i
  ];

  let trigger;
  try {
    trigger = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.customerPicker.trigger, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  } catch (error) {
    return null;
  }

  const triggerText = ((await trigger.locator.textContent()) || '').trim();
  const matchesPreferredCustomer = preferredCustomer && new RegExp(preferredCustomer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(triggerText);
  const alreadySelected = triggerText && !comboboxTextCandidates.some((pattern) => pattern.test(triggerText)) && (!preferredCustomer || matchesPreferredCustomer);
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

  await trigger.locator.click();
  await waitForAppToSettle(page, 500);

  const directSearchInput = page.getByPlaceholder(/search customers? \(min\. 3 characters\)\.\.\./i).first();
  if (await directSearchInput.isVisible().catch(() => false)) {
    await directSearchInput.fill(preferredCustomer);
    await waitForAppToSettle(page, 1000);

    const directPreferredOption = page.getByText(new RegExp(`^${preferredCustomer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')).first();
    if (await directPreferredOption.isVisible().catch(() => false)) {
      await directPreferredOption.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
      return preferredCustomer;
    }
  }

  if (preferredCustomer) {
    const searchInput = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.customerPicker.searchInput, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);

    if (searchInput) {
      await fillWithFallback(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.customerPicker.searchInput, preferredCustomer, {
        mustBeVisible: true,
        timeoutPerCandidate: 2500
      });
      await waitForAppToSettle(page, 750);
      const preferredOption = page.getByRole('option', { name: new RegExp(preferredCustomer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first();
      if (await preferredOption.isVisible().catch(() => false)) {
        await preferredOption.click({ timeout: 5000 });
        await waitForAppToSettle(page, 1000);
        return preferredCustomer;
      }

      if (fallbackCustomer) {
        await fillWithFallback(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.customerPicker.searchInput, fallbackCustomer, {
          mustBeVisible: true,
          timeoutPerCandidate: 2500
        });
        await waitForAppToSettle(page, 750);
        const fallbackOption = page.getByRole('option', { name: new RegExp(fallbackCustomer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first();
        if (await fallbackOption.isVisible().catch(() => false)) {
          await fallbackOption.click({ timeout: 5000 });
          await waitForAppToSettle(page, 1000);
          return fallbackCustomer;
        }
      }
    }
  }

  const option = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.customerPicker.options, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (option) {
    await option.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 1000);
  }

  return preferredCustomer || fallbackCustomer || triggerText || null;
}

async function openDashboardWorkspace(page, data) {
  await openModule(page);
  await openDashboard(page);
  await selectCustomer(page, data);
  await expectOverviewVisible(page);
}

async function openCustomerDetails(page) {
  await clickWithFallback(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.dashboard.viewCustomerDetails, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);

  const detailButton = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.dashboard.viewCustomerDetails, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (detailButton) {
    const expanded = await detailButton.locator.getAttribute('aria-expanded').catch(() => null);
    if (expanded === 'true') {
      return;
    }
  }

  const heading = page.getByRole('heading', { name: /customer information/i }).first();
  if (await heading.isVisible().catch(() => false)) {
    await expect(heading).toBeVisible({ timeout: 10000 });
  }
}

async function closeCustomerDetails(page) {
  const closeControl = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.dashboard.customerDetailsClose, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (closeControl) {
    await closeControl.locator.click({ timeout: 5000 });
  } else {
    await clickWithFallback(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.dashboard.viewCustomerDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  }

  await waitForAppToSettle(page, 1000);
  await expectOverviewVisible(page);
}

async function openFailedPaymentsList(page, data) {
  await openDashboardWorkspace(page, data);
  const openPaymentManagement = async () => {
    const reviewAction = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.dashboard.review, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);

    if (reviewAction) {
      await reviewAction.locator.click({ timeout: 5000 });
    } else {
      await page.getByRole('link', { name: /^Payment Management$/i }).first().click({ timeout: 5000 });
    }

    await waitForAppToSettle(page, 1000);
  };

  await openPaymentManagement();

  const recoverPaymentManagementList = async () => {
    await openDashboardWorkspace(page, data);
    await openPaymentManagement();
  };

  const heading = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.headings.paymentManagement, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });

  const noResults = page.getByText(/no results found/i).first();

  if (await noResults.isVisible().catch(() => false)) {
    const customerFilterClear = page.getByRole('combobox').first().locator('button').first();
    if (await customerFilterClear.isVisible().catch(() => false)) {
      await customerFilterClear.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1500);
    }
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const visiblePaymentRowAction = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.list.actionsMenu, {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    }).catch(() => null);

    if (visiblePaymentRowAction) {
      return;
    }

    await recoverPaymentManagementList();
  }
}

async function clickPagination(page, candidates) {
  const result = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  await result.locator.scrollIntoViewIfNeeded().catch(() => null);

  try {
    await result.locator.click({ timeout: 5000 });
  } catch (error) {
    if (!/outside of the viewport/i.test(error.message)) {
      throw error;
    }

    await result.locator.evaluate((element) => element.click());
  }

  await waitForAppToSettle(page, 1000);
}

async function ensurePreviousPaymentEnabled(page) {
  const previous = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.previousPayment, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (!previous) {
    return;
  }

  const isDisabled = await previous.locator.isDisabled().catch(() => false);
  if (isDisabled) {
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.nextPayment);
  }
}

async function addComment(page, commentText) {
  await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.comments);
  await fillWithFallback(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.commentInput, commentText, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.addComment);
  const toast = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.commentSuccessToast, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (toast) {
    await expect(toast.locator).toBeVisible({ timeout: 10000 });
  }

  return commentText;
}

async function openCommentRowActions(page, commentText) {
  const visibleCommentRow = await resolveFirst(
    page,
    imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.commentRow(commentText),
    {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    }
  ).catch(() => null);

  if (!visibleCommentRow) {
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.comments);
  }

  const commentRow = visibleCommentRow || await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.commentRow(commentText), {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });

  const rowActionButton = commentRow.locator.locator('button').last();
  await rowActionButton.click({ timeout: 5000 });
  await waitForAppToSettle(page, 750);
}

async function openActionsMenu(page) {
  await clickWithFallback(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.list.actionsMenu, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);
}

async function openPaymentDetails(page, data) {
  await openFailedPaymentsList(page, data);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const paymentListButtonBeforeOpen = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.paymentList, {
      mustBeVisible: true,
      timeoutPerCandidate: 1000
    }).catch(() => null);

    if (paymentListButtonBeforeOpen || /\/payment-management\/PD_/i.test(page.url())) {
      break;
    }

    await openActionsMenu(page);

    const detailsMenuItem = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.list.viewPaymentDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    }).catch(() => null);

    if (detailsMenuItem) {
      await detailsMenuItem.locator.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
      break;
    }

    await page.keyboard.press('Escape').catch(() => null);
    await waitForAppToSettle(page, 500);
  }

  const paymentListButton = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.paymentList, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (paymentListButton) {
    await expect(paymentListButton.locator).toBeVisible({ timeout: 10000 });
  }
}

async function clickDetailButton(page, candidates) {
  const isCommentsButton = candidates === imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.comments;

  await clickWithFallback(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: isCommentsButton ? 10000 : 2500,
    actionTimeout: isCommentsButton ? 15000 : 10000
  });
  await waitForAppToSettle(page, 750);
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
  const initialHeader = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.table.header(label), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await clickResolvedLocator(initialHeader.locator);
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

  const header = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.table.header(label), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  const headerText = ((await header.locator.textContent()) || '').trim();
  const ariaLabel = ((await header.locator.getAttribute('aria-label')) || '').trim();
  const combinedStateText = `${headerText} ${ariaLabel}`;

  if (/current sort:\s*(ascending|descending)/i.test(combinedStateText)) {
    await waitForAppToSettle(page, 750);
    return;
  }

  await clickResolvedLocator(header.locator);
  await waitForAppToSettle(page, 750);
}

async function runTs01(page, data) {
  await reportStep('Open imREmit dashboard for the selected customer', async () => {
    await openDashboardWorkspace(page, data);
  });
}

async function runTs02(page, data) {
  await reportStep('Open imREmit dashboard for the selected customer', async () => {
    await openDashboardWorkspace(page, data);
  });

  await reportStep('Open and close customer details from the dashboard card', async () => {
    await openCustomerDetails(page);
    await closeCustomerDetails(page);
  });
}

async function runTs03(page, data) {
  await reportStep('Open the failed payments review list', async () => {
    await openFailedPaymentsList(page, data);
  });
}

async function runTs04(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Move to the next payment-management page', async () => {
    await clickPagination(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.next);
  });
}

async function runTs05(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Move to the last payment-management page', async () => {
    await clickPagination(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.last);
  });
}

async function runTs06(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Move forward and then return to the previous page', async () => {
    await clickPagination(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.next);
    await clickPagination(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.previous);
  });
}

async function runTs07(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Move to the last page and return to the first page', async () => {
    await clickPagination(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.last);
    await clickPagination(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.first);
  });
}

async function runTs08(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Verify pagination controls are visible', async () => {
    for (const candidates of [
      imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.first,
      imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.previous,
      imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.next,
      imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.last
    ]) {
      const result = await resolveFirst(page, candidates, {
        mustBeVisible: true,
        timeoutPerCandidate: 2500
      });
      await expect(result.locator).toBeVisible({ timeout: 10000 });
    }
  });
}

async function runTs09(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Export payment data from the list', async () => {
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    await clickWithFallback(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.list.export, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await downloadPromise;
  });
}

async function runTs10(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Open the column view control', async () => {
    await clickWithFallback(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.list.columnView, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  });
}

async function runTs11(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Open the actions menu for a payment row', async () => {
    await openActionsMenu(page);
    const item = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.list.viewPaymentDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(item.locator).toBeVisible({ timeout: 10000 });
  });
}

async function runTs12(page, data) {
  await reportStep('Open payment details from the failed payments list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the next payment from the details view', async () => {
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.nextPayment);
  });
}

async function runTs13(page, data) {
  await reportStep('Open payment details from the failed payments list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Return to the previous payment from the details view', async () => {
    await ensurePreviousPaymentEnabled(page);
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.previousPayment);
  });
}

async function runTs14(page, data) {
  await reportStep('Open payment details from the failed payments list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Return from payment details to the payment list', async () => {
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.paymentList);
    const heading = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.headings.paymentManagement, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    await expect(heading.locator).toBeVisible({ timeout: 10000 });
  });
}

async function runTs15(page, data) {
  await reportStep('Open payment details from the failed payments list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Comments view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.comments);
  });
}

async function runTs16(page, data) {
  const commentText = 'Comment';

  await reportStep('Open payment details comments', async () => {
    await openPaymentDetails(page, data);
    await addComment(page, commentText);
  });

  await reportStep('Open the edit comment action', async () => {
    if (process.env.PWDEBUG) {
      await page.pause();
    }
    await openCommentRowActions(page, commentText);
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.editComment);
    await fillWithFallback(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.commentInput, 'Comment_Edit', {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.saveComment);
  });
}

async function runTs17(page, data) {
  const commentText = 'Comments';

  await reportStep('Open payment details comments', async () => {
    await openPaymentDetails(page, data);
    await addComment(page, commentText);
  });

  await reportStep('Open the delete comment action', async () => {
    await openCommentRowActions(page, commentText);
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.deleteComment);
    const toast = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.deleteCommentSuccessToast, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    }).catch(() => null);
    if (toast) {
      await expect(toast.locator).toBeVisible({ timeout: 10000 });
    }
  });
}

async function runTs18(page, data) {
  await reportStep('Open payment details from the failed payments list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Invoices view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.invoices);
  });
}

async function runTs19(page, data) {
  await reportStep('Open payment details from the failed payments list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the General Information view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.generalInformation);
  });
}

async function runTs20(page, data) {
  await reportStep('Open payment details from the failed payments list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Transactions view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.transactions);
  });
}

async function runTs21(page, data) {
  await reportStep('Open payment details from the failed payments list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Authorization and Decline view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.authorizationAndDecline);
  });
}

async function runTs22(page, data) {
  await reportStep('Open payment details from the failed payments list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the History view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.history);
  });
}

async function runTs23(page, data) {
  await reportStep('Open payment details from the failed payments list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Block Payment action in payment details', async () => {
    await clickDetailButton(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.detail.blockPayment);
  });
}

async function runTs24(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });
}

async function runTs25(page, data) {
  await reportStep('Open the failed payments list from the dashboard review card', async () => {
    await openFailedPaymentsList(page, data);
    const heading = await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.headings.paymentManagement, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    await expect(heading.locator).toBeVisible({ timeout: 10000 });
  });
}

async function runTs26(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Apply ascending order from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Org Id', 'Facility Name', 'Payment Number']) {
      await clickHeaderAndChoose(page, label, imremitDashboardFailedPaymentsOnImImErrorSelectors.menus.ascending);
    }
  });
}

async function runTs27(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Apply descending order from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Org Id', 'Facility Name', 'Payment Number']) {
      await clickHeaderAndChoose(page, label, imremitDashboardFailedPaymentsOnImImErrorSelectors.menus.descending);
    }
  });
}

async function runTs28(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Apply hide-column from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Org Id']) {
      await clickHeaderAndChoose(page, label, imremitDashboardFailedPaymentsOnImImErrorSelectors.menus.hideColumn);
    }
  });
}

async function runTs29(page, data) {
  await reportStep('Open the failed payments list', async () => {
    await openFailedPaymentsList(page, data);
  });

  await reportStep('Scroll down and return to the top of the payment list', async () => {
    await page.evaluate(() => window.scrollTo(0, 800));
    await waitForAppToSettle(page, 500);
    await clickWithFallback(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.list.returnToTop, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect((await resolveFirst(page, imremitDashboardFailedPaymentsOnImImErrorSelectors.headings.paymentManagement, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    })).locator).toBeVisible({ timeout: 10000 });
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
  TS_29: runTs29
};

async function runScenario(page, data, scenarioName) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => scenarioName.startsWith(key));
  if (!scenarioKey) {
    throw new Error(`imREmit Dashboard Failed Payments on IM/IM Error scenario not implemented: ${scenarioName}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

const helperMap = {
  openModule,
  openDashboard,
  selectCustomer,
  openDashboardWorkspace,
  openCustomerDetails,
  closeCustomerDetails,
  openFailedPaymentsList,
  openPaymentDetails,
  runScenario,
  selectors: imremitDashboardFailedPaymentsOnImImErrorSelectors
};

module.exports = {
  imremitDashboardFailedPaymentsOnImImErrorHelpers: {
    ...wrapHelperMapWithReadableSteps({
      openModule,
      openDashboard,
      selectCustomer,
      openDashboardWorkspace,
      openCustomerDetails,
      closeCustomerDetails,
      openFailedPaymentsList,
      openPaymentDetails,
      selectors: imremitDashboardFailedPaymentsOnImImErrorSelectors
    }, {
      openModule: 'Open imREmit module',
      openDashboard: 'Open imREmit dashboard',
      selectCustomer: 'Select dashboard customer',
      openDashboardWorkspace: 'Open dashboard workspace',
      openCustomerDetails: 'Open customer details',
      closeCustomerDetails: 'Close customer details',
      openFailedPaymentsList: 'Open failed payments list',
      openPaymentDetails: 'Open payment details'
    }),
    runScenario,
    selectors: imremitDashboardFailedPaymentsOnImImErrorSelectors
  }
};
