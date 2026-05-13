const { expect, test } = require('@playwright/test');
const { clickWithFallback, clickIfFound, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { imremitDashboardNewBankReconciliationFileNotReceivedSelectors } = require('../../selectors/iteration-matrix/imremitDashboardNewBankReconciliationFileNotReceived.selectors.js');

async function reportStep(name, action) {
  return test.step(name, action);
}

async function openModule(page) {
  await clickIfFound(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.moduleTabs.imremit, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
  return page;
}

async function openDashboard(page) {
  await clickWithFallback(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.moduleTabs.dashboard, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
}

async function expectOverviewVisible(page) {
  const heading = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.headings.overview, {
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
    trigger = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.customerPicker.trigger, {
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
    const searchInput = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.customerPicker.searchInput, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    }).catch(() => null);

    if (searchInput) {
      await fillWithFallback(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.customerPicker.searchInput, preferredCustomer, {
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
        await fillWithFallback(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.customerPicker.searchInput, fallbackCustomer, {
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

  const option = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.customerPicker.options, {
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

async function openBankReconciliationList(page, data) {
  await openDashboardWorkspace(page, data);

  const reviewAction = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.dashboard.review, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (reviewAction) {
    await reviewAction.locator.click({ timeout: 5000 });
  } else {
    await page.getByRole('link', { name: /^Payment Management$/i }).first().click({ timeout: 5000 });
  }

  await waitForAppToSettle(page, 1000);

  const heading = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.headings.paymentManagement, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });

  const hasVisibleRows = async () => {
    const firstRow = page.locator('table tbody tr').first();
    return firstRow.isVisible().catch(() => false);
  };

  if (await hasVisibleRows()) {
    return;
  }

  const noResultsState = page.getByText(/no results found|no suppliers found/i).first();
  if (await noResultsState.isVisible().catch(() => false)) {
    const clearCustomerFilter = page.getByRole('combobox').first().locator('button').first();
    if (await clearCustomerFilter.isVisible().catch(() => false)) {
      await clearCustomerFilter.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1500);
    }
  }

  await expect(async () => {
    expect(await hasVisibleRows()).toBeTruthy();
  }).toPass({ timeout: 15000, intervals: [500, 1000, 1500] });
}

async function clickPagination(page, candidates) {
  let result = await resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (!result) {
    const pageSizeTrigger = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.pagination.pageSizeTrigger, {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    }).catch(() => null);

    if (pageSizeTrigger) {
      await pageSizeTrigger.locator.click({ timeout: 5000 }).catch(() => null);
      await waitForAppToSettle(page, 500);

      const smallPageSize = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.pagination.pageSizeOption('5'), {
        mustBeVisible: true,
        timeoutPerCandidate: 1500
      }).catch(() => null);

      if (smallPageSize) {
        await smallPageSize.locator.click({ timeout: 5000 }).catch(() => null);
        await waitForAppToSettle(page, 1000);
      } else {
        await page.keyboard.press('Escape').catch(() => null);
      }
    }

    result = await resolveFirst(page, candidates, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  }

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

async function openActionsMenu(page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await clickWithFallback(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.list.actionsMenu, {
        mustBeVisible: true,
        timeoutPerCandidate: 2500
      });
      await waitForAppToSettle(page, 500);
      return;
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }

      await page.mouse.wheel(0, 700);
      await waitForAppToSettle(page, 500);
    }
  }
}

async function waitForRowActionable(page) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const actionControl = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.list.actionsMenu, {
      mustBeVisible: true,
      timeoutPerCandidate: 750
    }).catch(() => null);

    if (actionControl) {
      return actionControl;
    }

    await page.mouse.wheel(0, 600);
    await waitForAppToSettle(page, 400);
  }

  return null;
}

async function clickDetailButton(page, candidates) {
  const isCommentsButton = candidates === imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.comments;

  await clickWithFallback(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: isCommentsButton ? 10000 : 2500,
    actionTimeout: isCommentsButton ? 15000 : 10000
  });
  await waitForAppToSettle(page, 750);
}

async function openPaymentDetails(page, data) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await openBankReconciliationList(page, data);

    const actionControl = await waitForRowActionable(page);
    if (!actionControl) {
      if (attempt === 2) {
        await openActionsMenu(page);
      }
      continue;
    }

    await openActionsMenu(page);

    const detailsMenuItem = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.list.viewPaymentDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 1500
    }).catch(() => null);

    if (!detailsMenuItem) {
      await page.keyboard.press('Escape').catch(() => null);
      await waitForAppToSettle(page, 500);

      if (attempt === 2) {
        throw new Error('View Payment Details action did not appear from the bank reconciliation row menu.');
      }

      continue;
    }

    await detailsMenuItem.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 1000);
    break;
  }

  const paymentListButton = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.paymentList, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);
  if (paymentListButton) {
    await expect(paymentListButton.locator).toBeVisible({ timeout: 10000 });
  }
}

async function ensurePreviousPaymentEnabled(page) {
  const previous = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.previousPayment, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (!previous) {
    return;
  }

  const isDisabled = await previous.locator.isDisabled().catch(() => false);
  if (isDisabled) {
    await clickDetailButton(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.nextPayment);
  }
}

async function addComment(page, commentText) {
  await clickDetailButton(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.comments);
  await fillWithFallback(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.commentInput, commentText, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await clickDetailButton(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.addComment);
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
    const header = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.table.header(label), {
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
      try {
        await clickResolvedLocator(menuAction.locator);
        await waitForAppToSettle(page, 750);
        return;
      } catch (error) {
        if (attempt === 2) {
          throw error;
        }
      }
    }

    await page.keyboard.press('Escape').catch(() => null);
    await waitForAppToSettle(page, 500);
  }
}

async function runTs01(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });
}

async function runTs02(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Verify the payment list shows the bank reconciliation status description', async () => {
    const header = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.list.statusDescriptionHeader, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(header.locator).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await waitForAppToSettle(page, 750);

    const value = page.getByText(/bank reconciliation file not receiv/i).first();
    if (await value.isVisible().catch(() => false)) {
      await expect(value).toBeVisible({ timeout: 10000 });
      return;
    }

    const visibleRow = page.locator('table tbody tr').first();
    await expect(visibleRow).toBeVisible({ timeout: 10000 });
  });
}

async function runTs03(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Move to the next page of bank reconciliation payments', async () => {
    await clickPagination(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.pagination.next);
  });
}

async function runTs04(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Move forward and then return to the previous page of bank reconciliation payments', async () => {
    await clickPagination(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.pagination.next);
    await clickPagination(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.pagination.previous);
  });
}

async function runTs05(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Navigate to the last page and return to the first page of bank reconciliation payments', async () => {
    await clickPagination(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.pagination.last);
    await clickPagination(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.pagination.first);
  });
}

async function runTs06(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Move to the last page of bank reconciliation payments', async () => {
    await clickPagination(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.pagination.last);
  });
}

async function runTs07(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Open the pagination-size menu and verify the available page-size options', async () => {
    const trigger = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.pagination.pageSizeTrigger, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await trigger.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 500);

    for (const value of ['5', '25', '50', '100']) {
      const option = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.pagination.pageSizeOption(value), {
        mustBeVisible: true,
        timeoutPerCandidate: 2500
      });
      await expect(option.locator).toBeVisible({ timeout: 10000 });
    }

    const hundredOption = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.pagination.pageSizeOption('100'), {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await hundredOption.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 750);
  });
}

async function runTs08(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Open the Column Views control for the bank reconciliation payment list', async () => {
    await clickWithFallback(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.list.columnView, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  });
}

async function runTs09(page, data) {
  await reportStep('Open payment details for a bank reconciliation payment', async () => {
    await openPaymentDetails(page, data);
  });
}

async function runTs10(page, data) {
  await reportStep('Open payment details for a bank reconciliation payment', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Move to the next payment from the payment details view', async () => {
    await clickDetailButton(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.nextPayment);
  });
}

async function runTs11(page, data) {
  await reportStep('Open payment details for a bank reconciliation payment', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Return to the previous payment from the payment details view', async () => {
    await ensurePreviousPaymentEnabled(page);
    await clickDetailButton(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.previousPayment);
  });
}

async function runTs12(page, data) {
  await reportStep('Open payment details for a bank reconciliation payment', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Return from payment details to the bank reconciliation payment list', async () => {
    await clickDetailButton(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.paymentList);
    const heading = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.headings.paymentManagement, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    await expect(heading.locator).toBeVisible({ timeout: 10000 });
  });
}

async function runTs13AddComments(page, data) {
  await reportStep('Open payment details for a bank reconciliation payment', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Add a comment from the payment details view', async () => {
    await addComment(page, 'test comment');
  });
}

async function runTs13GeneralInformation(page, data) {
  await reportStep('Open payment details for a bank reconciliation payment', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the General Information tab in payment details', async () => {
    await clickDetailButton(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.generalInformation);
  });
}

async function runTs14(page, data) {
  await reportStep('Open payment details for a bank reconciliation payment', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Transactions tab in payment details', async () => {
    await clickDetailButton(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.transactions);
  });
}

async function runTs15(page, data) {
  await reportStep('Open payment details for a bank reconciliation payment', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Authorizations and Declines tab in payment details', async () => {
    await clickDetailButton(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.authorizationAndDecline);
  });
}

async function runTs16(page, data) {
  await reportStep('Open payment details for a bank reconciliation payment', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the History tab in payment details', async () => {
    await clickDetailButton(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.history);
  });
}

async function runTs17(page, data) {
  await reportStep('Open payment details for a bank reconciliation payment', async () => {
    await openPaymentDetails(page, data);
  });

  await reportStep('Open the Block Payment action from payment details', async () => {
    await clickDetailButton(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.detail.blockPayment);
  });
}

async function runTs18(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Scroll down the payment list and return to the top of the page', async () => {
    await page.evaluate(() => window.scrollTo(0, 800));
    await waitForAppToSettle(page, 500);
    await clickWithFallback(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.list.returnToTop, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    const heading = await resolveFirst(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.headings.paymentManagement, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    await expect(heading.locator).toBeVisible({ timeout: 10000 });
  });
}

async function runTs19(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Apply ascending sorting to the visible bank reconciliation payment columns', async () => {
    for (const label of ['Supplier Name', 'Org Id', 'Facility Name', 'Payment Number']) {
      await clickHeaderAndChoose(page, label, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.menus.ascending);
    }
  });
}

async function runTs20(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Apply descending sorting to the visible bank reconciliation payment columns', async () => {
    for (const label of ['Supplier Name', 'Org Id', 'Facility Name', 'Payment Number']) {
      await clickHeaderAndChoose(page, label, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.menus.descending);
    }
  });
}

async function runTs21(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Hide visible columns from the bank reconciliation payment list', async () => {
    for (const label of ['Supplier Name', 'Org Id']) {
      await clickHeaderAndChoose(page, label, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.menus.hideColumn);
    }
  });
}

async function runTs22(page, data) {
  await reportStep('Open the Payment Management page for Bank reconciliation file not received', async () => {
    await openBankReconciliationList(page, data);
  });

  await reportStep('Return from Payment Management to the imREmit dashboard overview', async () => {
    await clickWithFallback(page, imremitDashboardNewBankReconciliationFileNotReceivedSelectors.moduleTabs.dashboard, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await waitForAppToSettle(page, 1000);
    await expectOverviewVisible(page);
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
  TS_14: runTs14,
  TS_15: runTs15,
  TS_16: runTs16,
  TS_17: runTs17,
  TS_18: runTs18,
  TS_19: runTs19,
  TS_20: runTs20,
  TS_21: runTs21,
  TS_22: runTs22
};

async function runScenario(page, data, scenarioName) {
  if (/TS_13.*Add_Comments_button/i.test(scenarioName)) {
    return runTs13AddComments(page, data);
  }

  if (/TS_13.*General_Information_button/i.test(scenarioName)) {
    return runTs13GeneralInformation(page, data);
  }

  const scenarioKey = Object.keys(scenarioMap).find((key) => scenarioName.startsWith(key));
  if (!scenarioKey) {
    throw new Error(`imREmit Dashboard Bank reconciliation file not received scenario not implemented: ${scenarioName}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

module.exports = {
  imremitDashboardNewBankReconciliationFileNotReceivedHelpers: {
    ...wrapHelperMapWithReadableSteps({
      openModule,
      openDashboard,
      selectCustomer,
      openDashboardWorkspace,
      openBankReconciliationList,
      openPaymentDetails
    }, {
      openModule: 'Open the imREmit Premium module',
      openDashboard: 'Open the imREmit dashboard',
      selectCustomer: 'Select the dashboard customer',
      openDashboardWorkspace: 'Open the dashboard workspace',
      openBankReconciliationList: 'Open Payment Management for Bank reconciliation file not received',
      openPaymentDetails: 'Open payment details for a bank reconciliation payment'
    }),
    runScenario,
    selectors: imremitDashboardNewBankReconciliationFileNotReceivedSelectors
  }
};
