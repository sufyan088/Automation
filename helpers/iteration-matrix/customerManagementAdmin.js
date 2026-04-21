const { customerManagementAdminSelectors } = require('../../selectors/iteration-matrix/customerManagementAdmin.selectors.js');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

async function clickFirstVisible(page, selectors, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  await locator.click({ timeout: 5000 });
  return locator;
}

async function openAdminModule(page) {
  const adminLink = page.getByRole('link', { name: /^admin$/i }).first();
  await adminLink.waitFor({ state: 'visible', timeout: 15000 });
  await adminLink.click({ timeout: 5000 });
  await waitForFirstVisible(page, customerManagementAdminSelectors.adminHeading);
}

async function openModule(page) {
  await openAdminModule(page);
  return page;
}

async function verifyAdminLandingPage(page) {
  await waitForFirstVisible(page, customerManagementAdminSelectors.adminHeading);
  await waitForFirstVisible(page, customerManagementAdminSelectors.adminSubrouteNavigation);
  await waitForFirstVisible(page, customerManagementAdminSelectors.adminSubrouteLinks.customerManagement);
  await waitForFirstVisible(page, customerManagementAdminSelectors.adminSubrouteLinks.userManagement);
}

async function openAdminSection(page, linkKey) {
  const linkSelectors = customerManagementAdminSelectors.adminSubrouteLinks[linkKey];
  if (!linkSelectors) {
    throw new Error(`Unsupported admin section link key: ${linkKey}`);
  }

  await clickFirstVisible(page, linkSelectors);

  const routeFragment = customerManagementAdminSelectors.routeFragments[linkKey];
  if (routeFragment) {
    await page.waitForURL((url) => url.toString().includes(routeFragment), { timeout: 15000 });
  }

  const headingSelectors = customerManagementAdminSelectors.pageHeadings[linkKey];
  if (headingSelectors) {
    await waitForFirstVisible(page, headingSelectors);
  }
}

async function verifySectionVisible(page, linkKey) {
  const headingSelectors = customerManagementAdminSelectors.pageHeadings[linkKey];
  if (!headingSelectors) {
    throw new Error(`Unsupported admin section heading key: ${linkKey}`);
  }

  await waitForFirstVisible(page, headingSelectors);
}

async function readPaginationState(page) {
  await page.waitForFunction(() => {
    const summaries = Array.from(document.querySelectorAll('p'));
    return summaries.some((node) => /Page:\s*\d+\s+of\s+\d+/i.test(node.textContent || ''));
  }, { timeout: 15000 });

  const summary = await waitForFirstVisible(page, customerManagementAdminSelectors.paginationSummary);
  const text = (await summary.textContent())?.trim() || '';
  const match = text.match(/Page:\s*(\d+)\s+of\s+(\d+)/i);

  if (!match) {
    throw new Error(`Unable to parse pagination summary: ${text}`);
  }

  return {
    currentPage: Number(match[1]),
    totalPages: Number(match[2])
  };
}

async function clickPaginationButton(page, buttonKey) {
  const buttonName = customerManagementAdminSelectors.paginationButtons[buttonKey];
  if (!buttonName) {
    throw new Error(`Unsupported pagination button key: ${buttonKey}`);
  }

  const button = page.getByRole('button', { name: buttonName }).first();
  await button.waitFor({ state: 'visible', timeout: 15000 });
  await button.click({ timeout: 5000 });
}

async function expectPageNumber(page, expectedPage) {
  await page.waitForFunction((pageNumber) => {
    const summaries = Array.from(document.querySelectorAll('p'));
    return summaries.some((node) => {
      const text = node.textContent || '';
      return new RegExp(`Page:\\s*${pageNumber}\\s+of\\s+\\d+`, 'i').test(text);
    });
  }, expectedPage, { timeout: 15000 });
}

async function openPageSizeMenu(page) {
  const pageSizeCombo = page.getByRole('combobox').first();
  await pageSizeCombo.waitFor({ state: 'visible', timeout: 15000 });
  await pageSizeCombo.click({ timeout: 5000 });
}

async function verifyPageSizeOptions(page, expectedOptions) {
  for (const option of expectedOptions) {
    await page.getByRole('option', { name: String(option), exact: true }).waitFor({
      state: 'visible',
      timeout: 15000
    });
  }
}

async function choosePageSize(page, option) {
  const optionText = String(option);
  const optionLocator = page.getByRole('option', { name: optionText, exact: true }).first();
  await optionLocator.waitFor({ state: 'visible', timeout: 15000 });
  await optionLocator.click({ timeout: 5000 });
  await page.waitForFunction((pageSize) => {
    const summaries = Array.from(document.querySelectorAll('p'));
    return summaries.some((node) => {
      const text = node.textContent || '';
      const match = text.match(/Viewing Entries:\s*\d+\s+to\s+(\d+)/i);
      return Boolean(match) && Number(match[1]) <= Number(pageSize);
    });
  }, optionText, { timeout: 15000 });
}

async function searchAllCustomers(page, value) {
  const input = await waitForFirstVisible(page, customerManagementAdminSelectors.searchFields.allCustomers);
  await input.fill(value, { timeout: 5000 });
  return input;
}

async function expectTableContainsText(page, text) {
  await page.locator('table').first().waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForFunction((expectedText) => {
    const tables = Array.from(document.querySelectorAll('table'));
    return tables.some((table) => (table.textContent || '').includes(expectedText));
  }, text, { timeout: 15000 });
}

async function verifyCurrentRoute(page, linkKey) {
  const routeFragment = customerManagementAdminSelectors.routeFragments[linkKey];
  if (!routeFragment) {
    throw new Error(`Unsupported route verification key: ${linkKey}`);
  }

  await page.waitForURL((url) => url.toString().includes(routeFragment), { timeout: 15000 });
}

async function searchByCustomerName(page, value) {
  const input = await waitForFirstVisible(page, customerManagementAdminSelectors.searchFields.customerName);
  await input.fill(value, { timeout: 5000 });
  return input;
}

async function searchUsernames(page, value) {
  const input = await waitForFirstVisible(page, customerManagementAdminSelectors.searchFields.usernames);
  await input.fill(value, { timeout: 5000 });
  return input;
}

async function openFilterButton(page, filterKey) {
  const selectors = customerManagementAdminSelectors.filterButtons[filterKey];
  if (!selectors) {
    throw new Error(`Unsupported filter button key: ${filterKey}`);
  }

  await clickFirstVisible(page, selectors);
}

async function clickVisibleText(page, text) {
  const roleTargets = [
    page.locator('[role="menuitem"]').filter({ hasText: text }).first(),
    page.getByRole('button', { name: text, exact: true }).first(),
    page.getByRole('checkbox', { name: text, exact: true }).first(),
    page.getByRole('option', { name: text, exact: true }).first(),
    page.getByText(text, { exact: true }).first()
  ];

  for (const locator of roleTargets) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 5000 });
      return;
    }
  }

  throw new Error(`No visible clickable target found for text: ${text}`);
}

async function openTableHeaderMenu(page, label) {
  const headerButton = page.getByRole('columnheader', { name: new RegExp(escapeRegExp(label), 'i') })
    .getByRole('button')
    .first();
  await headerButton.waitFor({ state: 'visible', timeout: 15000 });
  await headerButton.click({ timeout: 5000 });
}

async function verifyVisibleText(page, text) {
  const targets = [
    page.locator('[role="menuitem"]').filter({ hasText: text }).first(),
    page.getByRole('button', { name: text, exact: true }).first(),
    page.getByRole('checkbox', { name: text, exact: true }).first(),
    page.getByRole('option', { name: text, exact: true }).first(),
    page.getByText(text, { exact: true }).first()
  ];

  for (const locator of targets) {
    if (await locator.isVisible().catch(() => false)) {
      return locator;
    }
  }

  throw new Error(`No visible target found for text: ${text}`);
}

async function openColumnOrder(page) {
  await clickFirstVisible(page, customerManagementAdminSelectors.columnOrderButton);
}

async function searchColumnOrderOptions(page, value) {
  const input = page.getByPlaceholder('Search columns...').first();
  await input.waitFor({ state: 'visible', timeout: 15000 });
  await input.fill(value, { timeout: 5000 });
}

async function clickColumnOrderAction(page, label) {
  await page.getByText(label, { exact: true }).first().click({ timeout: 5000 });
}

async function verifyColumnOrderOptionVisible(page, label) {
  await page.getByText(label, { exact: true }).first().waitFor({ state: 'visible', timeout: 15000 });
}

async function verifyColumnToggleActionVisible(page, label, action) {
  await page.getByRole('button', {
    name: new RegExp(`${escapeRegExp(action)}.*${escapeRegExp(label)}`, 'i')
  }).first().waitFor({ state: 'visible', timeout: 15000 });
}

async function toggleColumnOrderOption(page, label) {
  const labelPattern = new RegExp(`(hide|show).*${escapeRegExp(label)}`, 'i');
  const toggle = page.getByRole('button', { name: labelPattern }).first();

  if (await toggle.isVisible().catch(() => false)) {
    await toggle.click({ timeout: 5000 });
    return;
  }

  await clickVisibleText(page, label);
}

async function verifyTableHeaderVisible(page, label) {
  await page.getByRole('columnheader', { name: new RegExp(escapeRegExp(label), 'i') }).first().waitFor({
    state: 'visible',
    timeout: 15000
  });
}

async function verifyTableHeaderHidden(page, label) {
  await page.getByRole('columnheader', { name: new RegExp(escapeRegExp(label), 'i') }).first().waitFor({
    state: 'hidden',
    timeout: 15000
  });
}

async function ensureColumnVisibility(page, label, shouldBeVisible) {
  const header = page.getByRole('columnheader', { name: new RegExp(escapeRegExp(label), 'i') }).first();
  const isVisible = await header.isVisible().catch(() => false);

  if (isVisible === shouldBeVisible) {
    return;
  }

  await openColumnOrder(page);
  await toggleColumnOrderOption(page, label);

  if (shouldBeVisible) {
    await verifyTableHeaderVisible(page, label);
    return;
  }

  await verifyTableHeaderHidden(page, label);
}

async function setColumnToggleState(page, label, shouldBeVisible) {
  const desiredAction = shouldBeVisible ? 'Hide' : 'Show';
  const desiredToggle = page.getByRole('button', {
    name: new RegExp(`${desiredAction}.*${escapeRegExp(label)}`, 'i')
  }).first();

  if (await desiredToggle.isVisible().catch(() => false)) {
    return;
  }

  await toggleColumnOrderOption(page, label);
  await verifyColumnToggleActionVisible(page, label, desiredAction);
}

async function scrollDown(page, pixels) {
  await page.evaluate((amount) => {
    window.scrollTo({ top: amount, behavior: 'instant' });
  }, pixels);
}

async function clickReturnToTop(page) {
  await clickVisibleText(page, 'Return to top');
  await page.waitForFunction(() => window.scrollY === 0, { timeout: 15000 });
}

async function openFirstRowActionsMenu(page) {
  const actionButtons = [
    page.getByRole('button', { name: /actions for/i }).first(),
    page.getByRole('button', { name: /^open menu$/i }).first()
  ];

  for (const actionButton of actionButtons) {
    if (await actionButton.isVisible().catch(() => false)) {
      await actionButton.scrollIntoViewIfNeeded();
      await actionButton.click({ timeout: 5000 });
      return;
    }
  }

  for (const actionButton of actionButtons) {
    await actionButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    if (await actionButton.isVisible().catch(() => false)) {
      await actionButton.scrollIntoViewIfNeeded();
      await actionButton.click({ timeout: 5000 });
      return;
    }
  }

  throw new Error('No visible row actions menu button found for the first row.');
}

module.exports = {
  customerManagementAdminHelpers: {
    openModule,
    openAdminModule,
    verifyAdminLandingPage,
    openAdminSection,
    verifySectionVisible,
    readPaginationState,
    clickPaginationButton,
    expectPageNumber,
    openPageSizeMenu,
    verifyPageSizeOptions,
    choosePageSize,
    searchAllCustomers,
    searchByCustomerName,
    searchUsernames,
    openFilterButton,
    clickVisibleText,
    verifyVisibleText,
    openTableHeaderMenu,
    openColumnOrder,
    searchColumnOrderOptions,
    clickColumnOrderAction,
    verifyColumnOrderOptionVisible,
    verifyColumnToggleActionVisible,
    toggleColumnOrderOption,
    verifyTableHeaderVisible,
    verifyTableHeaderHidden,
    ensureColumnVisibility,
    setColumnToggleState,
    scrollDown,
    clickReturnToTop,
    openFirstRowActionsMenu,
    expectTableContainsText,
    verifyCurrentRoute,
    selectors: customerManagementAdminSelectors
  }
};
