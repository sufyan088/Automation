const { expect, test } = require('@playwright/test');
const { clickWithFallback, clickIfFound, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { imremitDashboardPayablesEndingInTheNext7DaysSelectors } = require('../../selectors/iteration-matrix/imremitDashboardPayablesEndingInTheNext7Days.selectors.js');

async function reportStep(name, action) {
  return test.step(name, action);
}

async function openModule(page) {
  await clickIfFound(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.moduleTabs.imremit, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
  return page;
}

async function openDashboard(page) {
  await clickWithFallback(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.moduleTabs.dashboard, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectOverviewVisible(page) {
  const heading = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.headings.overview, {
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
    trigger = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.customerPicker.trigger, {
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
    const searchInput = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.customerPicker.searchInput, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);

    if (searchInput) {
      await fillWithFallback(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.customerPicker.searchInput, preferredCustomer, {
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
        await fillWithFallback(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.customerPicker.searchInput, fallbackCustomer, {
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

  const option = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.customerPicker.options, {
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

  try {
    await expectOverviewVisible(page);
  } catch (error) {
    await openDashboard(page);
    await selectCustomer(page, data);
    await expectOverviewVisible(page);
  }
}

async function openCustomerDetails(page) {
  await clickWithFallback(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.dashboard.viewCustomerDetails, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);

  const detailButton = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.dashboard.viewCustomerDetails, {
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
  const closeControl = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.dashboard.customerDetailsClose, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (closeControl) {
    await closeControl.locator.click({ timeout: 5000 });
  } else {
    await clickWithFallback(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.dashboard.viewCustomerDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  }

  await waitForAppToSettle(page, 1000);
  await expectOverviewVisible(page);
}

async function openPayablesEndingList(page, data) {
  await openDashboardWorkspace(page, data);

  const openPaymentManagement = async () => {
    const reviewAction = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.dashboard.review, {
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

  const heading = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.headings.paymentManagement, {
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
    const visiblePaymentRowAction = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.actionsMenu, {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    }).catch(() => null);

    if (visiblePaymentRowAction) {
      return;
    }

    await recoverPaymentManagementList();
  }
}

async function openActionsMenu(page) {
  await clickWithFallback(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.actionsMenu, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);
}

async function exportPaymentData(page) {
  const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
  await clickWithFallback(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.export, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await downloadPromise;
}

async function openColumnView(page) {
  await clickWithFallback(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.columnView, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
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

async function openPaginationDropdown(page) {
  const dropdown = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.paginationDropdown, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await dropdown.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
}

async function choosePaginationOption(page, value) {
  const dropdown = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.paginationDropdown, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  const currentValue = (((await dropdown.locator.textContent()) || '').match(/\d+/) || [])[0] || null;

  const selectIndex = await page.locator('select').evaluateAll((elements, metadata) => {
    return elements.findIndex((element) => {
      const optionValues = Array.from(element.options).map((option) => {
        const rawValue = option.value || option.textContent || '';
        return rawValue.trim();
      });
      const hasExpectedOptions = ['5', '10', '50', '100'].every((expected) => optionValues.includes(expected));
      if (!hasExpectedOptions || !optionValues.includes(metadata.targetValue)) {
        return false;
      }

      if (!metadata.currentValue) {
        return true;
      }

      return (element.value || '').trim() === metadata.currentValue;
    });
  }, {
    currentValue,
    targetValue: value
  }).catch(() => -1);

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

  try {
    await dropdown.locator.selectOption(value, { timeout: 5000 });
    await waitForAppToSettle(page, 750);
    return;
  } catch (error) {
    // Fall back to the visible popup options when the combobox is not a native select.
  }

  await openPaginationDropdown(page);
  const option = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.paginationOption(value), {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await option.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 750);
}

async function clickDetailButton(page, candidates) {
  const isCommentsButton = candidates === imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.comments;

  await clickWithFallback(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: isCommentsButton ? 10000 : 2500,
    actionTimeout: isCommentsButton ? 15000 : 10000
  });
  await waitForAppToSettle(page, 750);
}

async function ensurePreviousPaymentEnabled(page) {
  const previous = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.previousPayment, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (!previous) {
    return;
  }

  const isDisabled = await previous.locator.isDisabled().catch(() => false);
  if (isDisabled) {
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.nextPayment);
  }
}

async function addComment(page, commentText) {
  await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.comments);
  await fillWithFallback(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.commentInput, commentText, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.addComment);
  const toast = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.commentSuccessToast, {
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
    imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.commentRow(commentText),
    {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    }
  ).catch(() => null);

  if (!visibleCommentRow) {
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.comments);
  }

  const commentRow = visibleCommentRow || await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.commentRow(commentText), {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });

  const rowActionButton = commentRow.locator.locator('button').last();
  await rowActionButton.click({ timeout: 5000 });
  await waitForAppToSettle(page, 750);
}

async function editComment(page, commentText, updatedText) {
  await openCommentRowActions(page, commentText);
  await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.editComment);
  await fillWithFallback(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.commentInput, updatedText, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.saveComment);
}

async function deleteComment(page, commentText) {
  await openCommentRowActions(page, commentText);
  await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.deleteComment);
  const toast = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.deleteCommentSuccessToast, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (toast) {
    await expect(toast.locator).toBeVisible({ timeout: 10000 });
  }
}

async function assertPaymentManagementVisible(page) {
  const heading = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.headings.paymentManagement, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function assertPrintButtonVisibleWhenAvailable(page) {
  const printControl = await resolveFirst(page, [
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.print,
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.print
  ], {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (printControl) {
    await expect(printControl.locator).toBeVisible({ timeout: 10000 });
    return;
  }

  await assertPaymentManagementVisible(page);
}

async function openPaymentDetails(page, data) {
  await openPayablesEndingList(page, data);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const paymentListButtonBeforeOpen = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.paymentList, {
      mustBeVisible: true,
      timeoutPerCandidate: 1000
    }).catch(() => null);

    if (paymentListButtonBeforeOpen || /\/payment-management\/PD_/i.test(page.url())) {
      break;
    }

    await openActionsMenu(page);

    const detailsMenuItem = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.viewPaymentDetails, {
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

  const paymentListButton = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.paymentList, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (paymentListButton) {
    await expect(paymentListButton.locator).toBeVisible({ timeout: 10000 });
  }
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
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const headerForMenu = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.table.header(label), {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });

    await clickResolvedLocator(headerForMenu.locator);
    await waitForAppToSettle(page, 500);

    const menuAction = await resolveFirst(page, actionCandidates, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);

    if (!menuAction) {
      await page.keyboard.press('Escape').catch(() => null);
      await waitForAppToSettle(page, 300);
      continue;
    }

    try {
      await clickResolvedLocator(menuAction.locator);
      await waitForAppToSettle(page, 750);
      return;
    } catch (error) {
      if (!/detached|not attached|timeout|intercepts pointer events|outside of the viewport/i.test(error.message)) {
        throw error;
      }

      await page.keyboard.press('Escape').catch(() => null);
      await waitForAppToSettle(page, 300);
    }
  }

  const header = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.table.header(label), {
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

async function returnToTopOfPaymentList(page) {
  await page.evaluate(() => window.scrollTo(0, 800));
  await waitForAppToSettle(page, 500);
  await clickWithFallback(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.returnToTop, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await assertPaymentManagementVisible(page);
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
  await reportStep('Open the payables ending in next 7 days review list', async () => {
    await openPayablesEndingList(page, data);
  });
}

async function runTs04(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Open the pagination dropdown and verify standard page sizes', async () => {
    const dropdown = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.paginationDropdown, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(dropdown.locator).toBeVisible({ timeout: 10000 });

    for (const size of ['50', '100', '5', '10']) {
      await choosePaginationOption(page, size);
    }
  });
}

async function runTs05(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Export payment data from the list', async () => {
    await exportPaymentData(page);
  });
}

async function runTs06(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Open the column view control', async () => {
    await openColumnView(page);
  });
}

async function runTs07(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Open the actions menu for a payment row', async () => {
    await openActionsMenu(page);
    const item = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.list.viewPaymentDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(item.locator).toBeVisible({ timeout: 10000 });
  });
}

async function runTs08(page, data) {
  await reportStep('Open payment details from the payables ending list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the next payment from the details view', async () => {
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.nextPayment);
  });
}

async function runTs09(page, data) {
  await reportStep('Open payment details from the payables ending list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Return to the previous payment from the details view', async () => {
    await ensurePreviousPaymentEnabled(page);
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.previousPayment);
  });
}

async function runTs10(page, data) {
  await reportStep('Open payment details from the payables ending list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Return from payment details to the payment list', async () => {
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.paymentList);
    const heading = await resolveFirst(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.headings.paymentManagement, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    await expect(heading.locator).toBeVisible({ timeout: 10000 });
  });
}

async function runTs11(page, data) {
  await reportStep('Open payment details from the payables ending list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Comments view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.comments);
  });
}

async function runTs12(page, data) {
  const commentText = 'Comment';

  await reportStep('Open payment details comments', async () => {
    await openPaymentDetails(page, data);
    await addComment(page, commentText);
  });

  await reportStep('Open the edit comment action', async () => {
    await editComment(page, commentText, 'Comment_Edit');
  });
}

async function runTs13(page, data) {
  const commentText = 'Comments';

  await reportStep('Open payment details comments', async () => {
    await openPaymentDetails(page, data);
    await addComment(page, commentText);
  });

  await reportStep('Open the delete comment action', async () => {
    await deleteComment(page, commentText);
  });
}

async function runTs14(page, data) {
  await reportStep('Open payment details from the payables ending list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Invoices view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.invoices);
  });
}

async function runTs15(page, data) {
  await reportStep('Open payment details from the payables ending list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the General Information view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.generalInformation);
  });
}

async function runTs16(page, data) {
  await reportStep('Open payment details from the payables ending list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Transactions view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.transactions);
  });
}

async function runTs17(page, data) {
  await reportStep('Open payment details from the payables ending list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Authorization and Decline view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.authorizationAndDecline);
  });
}

async function runTs18(page, data) {
  await reportStep('Open payment details from the payables ending list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the History view in payment details', async () => {
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.history);
  });
}

async function runTs19(page, data) {
  await reportStep('Open payment details from the payables ending list', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Block Payment action in payment details', async () => {
    await clickDetailButton(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail.blockPayment);
  });
}

async function runTs20(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Validate the payment management view opened from the dashboard card', async () => {
    await assertPaymentManagementVisible(page);
  });
}

async function runTs21(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Verify the Print button is visible when available', async () => {
    await assertPrintButtonVisibleWhenAvailable(page);
  });
}

async function runTs22(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Apply ascending order from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Org Id', 'Facility Name', 'Payment Number']) {
      await clickHeaderAndChoose(page, label, imremitDashboardPayablesEndingInTheNext7DaysSelectors.menus.ascending);
    }
  });
}

async function runTs23(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Apply descending order from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Org Id', 'Facility Name', 'Payment Number']) {
      await clickHeaderAndChoose(page, label, imremitDashboardPayablesEndingInTheNext7DaysSelectors.menus.descending);
    }
  });
}

async function runTs24(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Apply hide-column from visible table headers', async () => {
    for (const label of ['Supplier Name', 'Org Id']) {
      await clickHeaderAndChoose(page, label, imremitDashboardPayablesEndingInTheNext7DaysSelectors.menus.hideColumn);
    }
  });
}

async function runTs25(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Scroll down and return to the top of the payment list', async () => {
    await returnToTopOfPaymentList(page);
  });
}

async function runTs26(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Move through the next-page control', async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await clickPagination(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.pagination.next);
    }
  });
}

async function runTs27(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Move to the last payment-management page', async () => {
    await clickPagination(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.pagination.last);
  });
}

async function runTs28(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Move forward and return through the previous-page control', async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await clickPagination(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.pagination.next);
      await clickPagination(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.pagination.previous);
    }
  });
}

async function runTs29(page, data) {
  await reportStep('Open the payables ending in next 7 days list', async () => {
    await openPayablesEndingList(page, data);
  });

  await reportStep('Move to the last page and return to the first page', async () => {
    await clickPagination(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.pagination.last);
    await clickPagination(page, imremitDashboardPayablesEndingInTheNext7DaysSelectors.pagination.first);
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
    throw new Error(`imREmit Dashboard Payables Ending in the Next 7 Days scenario not implemented: ${scenarioName}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

module.exports = {
  imremitDashboardPayablesEndingInTheNext7DaysHelpers: {
    verifyDashboardModule: runTs01,
    verifyViewCustomerDetailsButton: runTs02,
    verifyReviewButtonOfImremitEndingInModule: runTs03,
    verifyPaginationButton: runTs04,
    verifyExportButton: runTs05,
    verifyColumnViewButton: runTs06,
    verifyActionsIcon: runTs07,
    verifyNextButtonInViewingPaymentPage: runTs08,
    verifyPreviousButtonInViewingPaymentPage: runTs09,
    verifyPaymentListButtonInViewingPaymentPage: runTs10,
    verifyCommentsButtonInViewingPaymentPage: runTs11,
    verifyEditCommentButton: runTs12,
    verifyDeleteCommentButton: runTs13,
    verifyInvoicesButtonInViewingPaymentPage: runTs14,
    verifyGeneralInformationButtonInViewingPaymentPage: runTs15,
    verifyTransactionsButtonInViewingPaymentPage: runTs16,
    verifyAuthorizationAndDeclineButtonInViewingPaymentPage: runTs17,
    verifyHistoryButtonInViewingPaymentPage: runTs18,
    verifyBlockPaymentButtonInViewingPaymentPage: runTs19,
    verifyBackToDashboardButton: runTs20,
    verifyPrintButtonIsVisible: runTs21,
    verifyAscButtonResponsiveForBorderEntries: runTs22,
    verifyDscButtonResponsiveForBorderEntries: runTs23,
    verifyHideButtonResponsiveForBorderEntries: runTs24,
    verifyRunToTopButton: runTs25,
    verifyGoToNextPageButton: runTs26,
    verifyGoToLastPageButton: runTs27,
    verifyGoToPreviousPageButton: runTs28,
    verifyGoToFirstPageButton: runTs29,
    ...wrapHelperMapWithReadableSteps({
      openModule,
      openDashboard,
      selectCustomer,
      openDashboardWorkspace,
      openCustomerDetails,
      closeCustomerDetails,
      openPayablesEndingList,
      openPaymentDetails,
      openActionsMenu,
      exportPaymentData,
      openColumnView,
      choosePaginationOption,
      clickDetailButton,
      ensurePreviousPaymentEnabled,
      addComment,
      openCommentRowActions,
      editComment,
      deleteComment,
      assertPaymentManagementVisible,
      assertPrintButtonVisibleWhenAvailable,
      clickHeaderAndChoose,
      clickPagination,
      returnToTopOfPaymentList,
      selectors: imremitDashboardPayablesEndingInTheNext7DaysSelectors
    }, {
      openModule: 'Open imREmit module',
      openDashboard: 'Open imREmit dashboard',
      selectCustomer: 'Select dashboard customer',
      openDashboardWorkspace: 'Open dashboard workspace',
      openCustomerDetails: 'Open customer details',
      closeCustomerDetails: 'Close customer details',
      openPayablesEndingList: 'Open payables ending list',
      openPaymentDetails: 'Open payment details',
      openActionsMenu: 'Open payment row actions menu',
      exportPaymentData: 'Export payment data',
      openColumnView: 'Open column view control',
      choosePaginationOption: 'Choose pagination option',
      clickDetailButton: 'Click payment detail action',
      ensurePreviousPaymentEnabled: 'Ensure previous payment action is enabled',
      addComment: 'Add payment comment',
      openCommentRowActions: 'Open comment row actions',
      editComment: 'Edit payment comment',
      deleteComment: 'Delete payment comment',
      assertPaymentManagementVisible: 'Assert payment management view is visible',
      assertPrintButtonVisibleWhenAvailable: 'Assert print button is visible when available',
      clickHeaderAndChoose: 'Open table header menu and choose action',
      clickPagination: 'Click pagination control',
      returnToTopOfPaymentList: 'Return to top of payment list'
    }),
    runScenario,
    selectors: imremitDashboardPayablesEndingInTheNext7DaysSelectors
  }
};
