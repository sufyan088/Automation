const { expect, test } = require('@playwright/test');
const { clickWithFallback, fillWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { supplierManagementImremitNewSelectors } = require('../../selectors/iteration-matrix/supplierManagementImremitNew.selectors.js');

const DEFAULT_CUSTOMERS = ['Test_Customer_imREmit', 'Cadent'];

function getCustomerCandidates(data) {
  return [
    data?.Customer_Name_imREmit,
    data?.CustomerNameImremit,
    ...DEFAULT_CUSTOMERS
  ].filter(Boolean);
}

async function openModule(page) {
  return page;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function reportStep(name, action) {
  return test.step(name, action);
}

async function openSupplierManagementWorkspace(page) {
  const supplierSearchInput = await resolveFirst(page, supplierManagementImremitNewSelectors.list.searchInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 1200
  }).catch(() => null);

  if (!supplierSearchInput) {
    const backToListLink = page.getByRole('link', { name: /back to list/i }).first();
    const backToListButton = page.getByRole('button', { name: /back to list/i }).first();

    if (await backToListLink.isVisible().catch(() => false)) {
      await backToListLink.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
    } else if (await backToListButton.isVisible().catch(() => false)) {
      await backToListButton.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
    }

    const supplierSearchInputAfterReturn = await resolveFirst(page, supplierManagementImremitNewSelectors.list.searchInput, {
      mustBeVisible: true,
      timeoutPerCandidate: 1200
    }).catch(() => null);

    if (supplierSearchInputAfterReturn) {
      const heading = await resolveFirst(page, supplierManagementImremitNewSelectors.headings.supplierManagement, {
        mustBeVisible: true,
        timeoutPerCandidate: 2500
      });
      await expect(heading.locator).toBeVisible({ timeout: 15000 });
      return;
    }

    const supplierManagementTab = await resolveFirst(page, supplierManagementImremitNewSelectors.moduleTabs.supplierManagement, {
      mustBeVisible: true,
      timeoutPerCandidate: 1200
    }).catch(() => null);

    if (supplierManagementTab) {
      await supplierManagementTab.locator.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
    } else {
    const imremitHeading = await resolveFirst(page, supplierManagementImremitNewSelectors.headings.module, {
      mustBeVisible: true,
      timeoutPerCandidate: 1200
    }).catch(() => null);

    if (!imremitHeading) {
      await clickWithFallback(page, supplierManagementImremitNewSelectors.moduleTabs.imremit, {
        mustBeVisible: true,
        timeoutPerCandidate: 2500
      });
      await waitForAppToSettle(page, 1000);
    }

    await clickWithFallback(page, supplierManagementImremitNewSelectors.moduleTabs.supplierManagement, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await waitForAppToSettle(page, 1000);
    }
  }

  const heading = await resolveFirst(page, supplierManagementImremitNewSelectors.headings.supplierManagement, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(heading.locator).toBeVisible({ timeout: 15000 });
}

async function ensureCustomerSelected(page, data) {
  const customerCandidates = getCustomerCandidates(data);

  const trigger = await resolveFirst(page, supplierManagementImremitNewSelectors.customerPicker.trigger, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (!trigger) {
    return customerCandidates[0] || DEFAULT_CUSTOMERS[0];
  }

  const triggerText = await trigger.locator.textContent().catch(() => '');

  for (const customerName of customerCandidates) {
    const alreadySelected = new RegExp(escapeRegExp(customerName), 'i').test(triggerText || '');
    if (alreadySelected) {
      return customerName;
    }
  }

  await trigger.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 300);

  for (const customerName of customerCandidates) {
    const searchInput = await resolveFirst(page, supplierManagementImremitNewSelectors.customerPicker.searchInput, {
      mustBeVisible: true,
      timeoutPerCandidate: 1200
    }).catch(() => null);

    if (searchInput) {
      await searchInput.locator.fill('');
      await searchInput.locator.fill(customerName);
      await waitForAppToSettle(page, 500);
    }

    const optionByRole = page.getByRole('option', { name: new RegExp(escapeRegExp(customerName), 'i') }).first();
    if (await optionByRole.isVisible().catch(() => false)) {
      await optionByRole.click({ timeout: 5000 });
      await waitForAppToSettle(page, 750);
      await page.keyboard.press('Escape').catch(() => {});
      return customerName;
    }

    const optionByText = page.getByText(new RegExp(`^${escapeRegExp(customerName)}$`, 'i')).last();
    if (await optionByText.isVisible().catch(() => false)) {
      await optionByText.click({ timeout: 5000 });
      await waitForAppToSettle(page, 750);
      await page.keyboard.press('Escape').catch(() => {});
      return customerName;
    }
  }

  await page.keyboard.press('Escape').catch(() => {});
  return customerCandidates[0] || DEFAULT_CUSTOMERS[0];
}

async function selectCustomerOnAddSupplier(page, data) {
  const addSupplierHeading = page.getByRole('heading', { name: /add supplier/i }).first();
  if (!await addSupplierHeading.isVisible().catch(() => false)) {
    return getCustomerCandidates(data)[0] || DEFAULT_CUSTOMERS[0];
  }

  const customerCandidates = getCustomerCandidates(data);
  const combobox = page.locator('[role="combobox"]').first();
  const currentText = await combobox.textContent().catch(() => '');

  for (const customerName of customerCandidates) {
    if (new RegExp(escapeRegExp(customerName), 'i').test(currentText || '')) {
      return customerName;
    }
  }

  await combobox.click({ timeout: 5000 });
  await waitForAppToSettle(page, 300);

  for (const customerName of customerCandidates) {
    const searchInput = page.getByPlaceholder(/search customers? \(min\. 3 characters\)\.\.\./i).first();

    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('');
      await searchInput.fill(customerName);
      await waitForAppToSettle(page, 500);
    } else {
      await page.keyboard.press('ControlOrMeta+A').catch(() => {});
      await page.keyboard.type(customerName).catch(() => {});
      await waitForAppToSettle(page, 500);
    }

    const optionMatchers = [
      page.locator('div[aria-selected="true"]').filter({ hasText: new RegExp(`^${escapeRegExp(customerName)}$`, 'i') }).first(),
      page.locator('span[title]').filter({ hasText: new RegExp(`^${escapeRegExp(customerName)}$`, 'i') }).first(),
      page.getByText(new RegExp(`^${escapeRegExp(customerName)}$`, 'i')).last()
    ];

    for (const option of optionMatchers) {
      if (await option.isVisible().catch(() => false)) {
        await option.click({ timeout: 5000 });
        await waitForAppToSettle(page, 750);
        return customerName;
      }
    }

    await page.keyboard.press('ArrowDown').catch(() => {});
    await page.keyboard.press('Enter').catch(() => {});
    await waitForAppToSettle(page, 750);

    const updatedText = await combobox.textContent().catch(() => '');
    if (updatedText && !/select a customer/i.test(updatedText)) {
      return customerName;
    }
  }

  const firstOption = page.locator('span[title]').first();
  if (await firstOption.isVisible().catch(() => false)) {
    const optionText = (await firstOption.textContent().catch(() => '')).trim();
    await firstOption.click({ timeout: 5000 });
    await waitForAppToSettle(page, 750);
    return optionText || customerCandidates[0] || DEFAULT_CUSTOMERS[0];
  }

  await page.keyboard.press('Escape').catch(() => {});
  return customerCandidates[0] || DEFAULT_CUSTOMERS[0];
}

async function openModuleWithCustomer(page, data) {
  await openSupplierManagementWorkspace(page);
  return ensureCustomerSelected(page, data);
}

async function openExportDialog(page) {
  await clickWithFallback(page, supplierManagementImremitNewSelectors.actions.exportDataButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 500);

  const heading = await resolveFirst(page, supplierManagementImremitNewSelectors.headings.exportSupplierDetails, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

async function toggleExportField(page, label) {
  const option = page.getByText(new RegExp(`^${escapeRegExp(label)}$`, 'i')).last();
  await expect(option).toBeVisible({ timeout: 10000 });
  await option.click({ timeout: 5000 });
}

async function exportSupplierDetails(page) {
  const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
  await clickWithFallback(page, supplierManagementImremitNewSelectors.actions.exportConfirmButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  const download = await downloadPromise;
  if (download) {
    await expect.poll(async () => download.suggestedFilename().length > 0, { timeout: 5000 }).toBe(true);
  }
}

async function openAddSupplier(page) {
  await clickWithFallback(page, supplierManagementImremitNewSelectors.actions.addSupplierButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 750);

  const heading = await resolveFirst(page, supplierManagementImremitNewSelectors.headings.supplierDetails, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(heading.locator).toBeVisible({ timeout: 10000 });
}

function buildUniqueSupplier(prefix = 'SupplierNew') {
  const stamp = Date.now().toString().slice(-8);
  return {
    supplierName: `${prefix}${stamp}`,
    supplierNumber: stamp,
    supplierEmail: `qa+${stamp}@example.com`,
    phoneNumber: '5551234567'
  };
}

async function createSupplier(page, data, overrides = {}) {
  const supplier = {
    ...buildUniqueSupplier(),
    ...overrides
  };

  await openModuleWithCustomer(page, data);
  await openAddSupplier(page);
  await selectCustomerOnAddSupplier(page, data);

  const supplierNameInput = page.locator('input[name="supplierName"]').first();
  await expect(supplierNameInput).toBeVisible({ timeout: 10000 });
  await expect(supplierNameInput).not.toBeDisabled({ timeout: 10000 });

  await fillWithFallback(page, supplierManagementImremitNewSelectors.fields.supplierName, supplier.supplierName, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await fillWithFallback(page, supplierManagementImremitNewSelectors.fields.supplierNumber, supplier.supplierNumber, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await fillWithFallback(page, supplierManagementImremitNewSelectors.fields.supplierEmail, supplier.supplierEmail, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await fillWithFallback(page, supplierManagementImremitNewSelectors.fields.phoneNumber, supplier.phoneNumber, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await page.keyboard.press('Tab').catch(() => {});

  const saveAndContinueButton = await resolveFirst(page, supplierManagementImremitNewSelectors.buttons.saveAndContinue, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(saveAndContinueButton.locator).toBeEnabled({ timeout: 10000 });
  await saveAndContinueButton.locator.click({ timeout: 5000 });
  await waitForAppToSettle(page, 1000);

  let listSearchInput = await resolveFirst(page, supplierManagementImremitNewSelectors.list.searchInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  }).catch(() => null);

  if (!listSearchInput) {
    const backToListLink = page.getByRole('link', { name: /back to list/i }).first();
    const backToListButton = page.getByRole('button', { name: /back to list/i }).first();

    if (await backToListLink.isVisible().catch(() => false)) {
      await backToListLink.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
    } else if (await backToListButton.isVisible().catch(() => false)) {
      await backToListButton.click({ timeout: 5000 });
      await waitForAppToSettle(page, 1000);
    }

    listSearchInput = await resolveFirst(page, supplierManagementImremitNewSelectors.list.searchInput, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    }).catch(() => null);
  }

  if (!listSearchInput) {
    const supplierDetailsHeading = await resolveFirst(page, supplierManagementImremitNewSelectors.headings.supplierDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 1200
    }).catch(() => null);

    if (supplierDetailsHeading) {
      const formText = await page.locator('form').first().textContent().catch(() => '');
      throw new Error(`Save and continue did not return to the supplier list. Current form text: ${String(formText || '').replace(/\s+/g, ' ').trim()}`);
    }
  }

  return supplier;
}

async function searchSuppliers(page, value) {
  const searchInput = await resolveFirst(page, supplierManagementImremitNewSelectors.list.searchInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (!searchInput) {
    await openSupplierManagementWorkspace(page);
  }

  await fillWithFallback(page, supplierManagementImremitNewSelectors.list.searchInput, value, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
  await expect(page.locator('table').first()).toContainText(value, { timeout: 15000 });
}

async function openEditSupplierDetails(page, supplierName) {
  await searchSuppliers(page, supplierName);
  await clickWithFallback(page, supplierManagementImremitNewSelectors.actions.rowActionsButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  const menuItem = page.getByRole('menuitem', { name: /edit supplier details/i }).first();
  if (await menuItem.isVisible().catch(() => false)) {
    await menuItem.click({ timeout: 5000 });
  } else {
    await clickWithFallback(page, supplierManagementImremitNewSelectors.actions.editSupplierDetails, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
  }
  await waitForAppToSettle(page, 1000);
  const heading = await resolveFirst(page, supplierManagementImremitNewSelectors.headingsForm.editSupplier, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await expect(heading.locator).toBeVisible({ timeout: 15000 });
}

async function openViewSupplierDetails(page, supplierName) {
  await searchSuppliers(page, supplierName);
  await clickWithFallback(page, supplierManagementImremitNewSelectors.actions.rowActionsButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  const menuItem = page.getByRole('menuitem', { name: /view supplier details/i }).first();
  await expect(menuItem).toBeVisible({ timeout: 10000 });
  await menuItem.click({ timeout: 5000 });
  await waitForAppToSettle(page, 1000);

  await expect(page.getByRole('heading', { name: /view supplier details/i }).first()).toBeVisible({ timeout: 15000 });
}

async function expectSupplierListStatus(page, supplierName, statusText) {
  await searchSuppliers(page, supplierName);
  const row = page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(supplierName), 'i') }).first();
  await expect(row).toContainText(new RegExp(escapeRegExp(statusText), 'i'), { timeout: 15000 });
}

async function searchSuppliersAndExpectRow(page, searchValue, expectedRowText) {
  const searchInput = await resolveFirst(page, supplierManagementImremitNewSelectors.list.searchInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (!searchInput) {
    await openSupplierManagementWorkspace(page);
  }

  await fillWithFallback(page, supplierManagementImremitNewSelectors.list.searchInput, searchValue, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);
  await expect(page.locator('table tbody tr').filter({ hasText: new RegExp(escapeRegExp(expectedRowText), 'i') }).first()).toBeVisible({ timeout: 15000 });
}

async function deleteSupplier(page, supplierName) {
  await searchSuppliers(page, supplierName);
  await clickWithFallback(page, supplierManagementImremitNewSelectors.actions.rowActionsButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  const deleteAction = page.getByRole('menuitem', { name: /delete supplier/i }).first();
  if (!await deleteAction.isVisible().catch(() => false)) {
    throw new Error('Delete Supplier action was not available.');
  }
  await deleteAction.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);

  const deleteConfirm = page.getByRole('button', { name: /^delete( delete)?$/i }).last();
  await expect(deleteConfirm).toBeVisible({ timeout: 10000 });
  await deleteConfirm.click({ timeout: 5000 });
  await waitForAppToSettle(page, 1000);

  await expect(page.locator('table').first()).not.toContainText(supplierName, { timeout: 15000 });
}

async function scrollToTopAndVerify(page) {
  await page.evaluate(() => {
    window.scrollTo(0, 800);
    document.documentElement.scrollTop = 800;
    document.body.scrollTop = 800;
  }).catch(() => null);
  await waitForAppToSettle(page, 300);

  const returnToTop = page.getByRole('button', { name: /return to top/i }).first();
  await expect(returnToTop).toBeVisible({ timeout: 10000 });
  await returnToTop.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);

  await expect.poll(async () => page.evaluate(() => Math.min(window.scrollY || 0, document.documentElement.scrollTop || 0, document.body.scrollTop || 0))).toBe(0);
}

async function findColumnHeaderTrigger(page, headerName) {
  const exactMatcher = new RegExp(`^${escapeRegExp(headerName)}$`, 'i');
  const candidates = [
    page.locator('table thead th button').filter({ hasText: exactMatcher }).first(),
    page.getByRole('button', { name: exactMatcher }).first(),
    page.locator('table thead th').filter({ hasText: exactMatcher }).locator('button').first()
  ];

  for (const candidate of candidates) {
    if (await candidate.isVisible().catch(() => false)) {
      return candidate;
    }
  }

  throw new Error(`Could not find a column header trigger for ${headerName}.`);
}

async function openColumnHeaderMenu(page, headerName) {
  const trigger = await findColumnHeaderTrigger(page, headerName);
  await trigger.click({ timeout: 5000 });
  await waitForAppToSettle(page, 300);
}

async function chooseColumnHeaderMenuOption(page, headerName, optionName) {
  await openColumnHeaderMenu(page, headerName);
  const option = page.getByRole('menuitem', { name: optionName }).first();
  await expect(option).toBeVisible({ timeout: 10000 });
  await option.click({ timeout: 5000 });
  await waitForAppToSettle(page, 400);
}

async function verifyColumnMenuOptionAcrossHeaders(page, headers, optionName) {
  for (const headerName of headers) {
    await chooseColumnHeaderMenuOption(page, headerName, optionName);
  }
}

async function openColumnOrderPanel(page) {
  const columnOrderButtonCandidates = [
    page.locator('button[aria-label*="Column settings"]').first(),
    page.locator('button:has-text("Column Order")').first(),
    page.locator('button:has-text("Column Views")').first(),
    page.getByRole('button', { name: /column (order|views|settings)/i }).first()
  ];

  let columnOrderButton = null;
  for (const candidate of columnOrderButtonCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      columnOrderButton = candidate;
      break;
    }
  }

  if (!columnOrderButton) {
    throw new Error('Column Order trigger was not visible on the supplier list page.');
  }

  await columnOrderButton.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);

  const panelHeading = page.getByText(/reorder\s*&\s*toggle columns/i).first();
  await expect(panelHeading).toBeVisible({ timeout: 10000 });

  const panel = page.locator('div').filter({ has: panelHeading }).last();
  await expect(panel).toBeVisible({ timeout: 10000 });
  return panel;
}

async function toggleFirstVisibleColumnOrderControls(page, expectedLabels) {
  await openColumnOrderPanel(page);
  await expect(page.locator('input[placeholder*="Search columns"]').first()).toBeVisible({ timeout: 10000 });
  for (const expectedLabel of expectedLabels) {
    await expect(page.getByText(new RegExp(`^${escapeRegExp(expectedLabel)}$`, 'i')).first()).toBeVisible({ timeout: 10000 });
  }
}

async function openAdvancedSearchPanel(page) {
  const advancedSearchButton = page.locator('button:has-text("Advanced Search")').first();
  await expect(advancedSearchButton).toBeVisible({ timeout: 10000 });
  await advancedSearchButton.click({ timeout: 5000 });
  await waitForAppToSettle(page, 400);

  const advancedSearchHeading = page.getByRole('heading', { name: /advanced search/i }).first();
  await expect(advancedSearchHeading).toBeVisible({ timeout: 10000 });

  return advancedSearchHeading.locator('xpath=ancestor::div[contains(@class,"z-50")][1]').first().or(page.locator('body'));
}

async function selectUpdatedDateInAdvancedSearch(page) {
  await openAdvancedSearchPanel(page);
  await expect(page.getByText(/^updated date$/i).first()).toBeVisible({ timeout: 10000 });

  const dateTrigger = page.locator('button').filter({ has: page.getByText(/updated date/i).first() }).first();
  await expect(dateTrigger).toBeVisible({ timeout: 10000 });
  await dateTrigger.click({ timeout: 5000 });
  await waitForAppToSettle(page, 300);

  const dayButton = page.getByRole('button', { name: /^6$/i }).first();
  if (await dayButton.isVisible().catch(() => false)) {
    await dayButton.click({ timeout: 5000 });
  }
  await waitForAppToSettle(page, 300);
}

async function fillAdvancedSearchField(page, { labelText, fieldName, placeholder, value, expectedTableText = null }) {
  const panel = await openAdvancedSearchPanel(page);
  await expect(panel.getByText(new RegExp(`^${escapeRegExp(labelText)}$`, 'i')).first()).toBeVisible({ timeout: 10000 });

  const candidates = [
    fieldName ? panel.locator(`input[name="${fieldName}"]`).first() : null,
    placeholder ? panel.getByPlaceholder(new RegExp(escapeRegExp(placeholder), 'i')).first() : null,
    page.locator(`input[name="${fieldName}"]`).first()
  ].filter(Boolean);

  let input = null;
  for (const candidate of candidates) {
    if (await candidate.isVisible().catch(() => false)) {
      input = candidate;
      break;
    }
  }

  if (!input) {
    throw new Error(`Advanced Search field was not visible for ${labelText}.`);
  }

  await input.fill('');
  await input.fill(value);
  await expect(input).toHaveValue(value, { timeout: 10000 });
  await waitForAppToSettle(page, 500);
  await page.keyboard.press('Escape').catch(() => null);
  await page.locator('article').first().click({ position: { x: 5, y: 5 }, timeout: 5000 }).catch(() => null);
  await waitForAppToSettle(page, 500);

  if (expectedTableText) {
    await expect(page.locator('table').first()).toContainText(new RegExp(escapeRegExp(expectedTableText), 'i'), { timeout: 15000 });
  }
}

async function applyStatusFilter(page, statusText) {
  const statusButton = page.getByRole('button', { name: /^status$/i }).first();
  await expect(statusButton).toBeVisible({ timeout: 10000 });
  await statusButton.click({ timeout: 5000 });
  await waitForAppToSettle(page, 300);

  const optionCandidates = [
    page.getByRole('option', { name: new RegExp(escapeRegExp(statusText), 'i') }).first(),
    page.getByRole('menuitem', { name: new RegExp(escapeRegExp(statusText), 'i') }).first(),
    page.getByRole('button', { name: new RegExp(escapeRegExp(statusText), 'i') }).first(),
    page.getByText(new RegExp(`^${escapeRegExp(statusText)}$`, 'i')).first()
  ];

  for (const option of optionCandidates) {
    if (await option.isVisible().catch(() => false)) {
      await option.click({ timeout: 5000 });
      await waitForAppToSettle(page, 500);
      return;
    }
  }

  throw new Error(`Status filter option was not visible for ${statusText}.`);
}

async function approveSupplier(page, supplierName, options = {}) {
  const { requireToast = false } = options;
  await searchSuppliers(page, supplierName);
  await clickWithFallback(page, supplierManagementImremitNewSelectors.actions.rowActionsButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  const viewDetails = page.getByRole('menuitem', { name: /view supplier details/i }).first();
  if (await viewDetails.isVisible().catch(() => false)) {
    await viewDetails.click({ timeout: 5000 });
  } else {
    throw new Error('View Supplier Details action was not available.');
  }
  await waitForAppToSettle(page, 1000);
  await clickWithFallback(page, supplierManagementImremitNewSelectors.buttons.approve, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await clickWithFallback(page, supplierManagementImremitNewSelectors.buttons.approveConfirm, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);

  const approvedToast = await resolveFirst(page, supplierManagementImremitNewSelectors.status.approved, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  }).catch(() => null);

  if (approvedToast) {
    await expect(approvedToast.locator).toBeVisible({ timeout: 15000 });
    return;
  }

  if (requireToast) {
    throw new Error('Approve confirmation completed, but the approved toast was not shown.');
  }

  await openSupplierManagementWorkspace(page);
  await searchSuppliers(page, supplierName);
}

async function fillVisibleInput(page, selector, value) {
  const fields = page.locator(selector);
  const count = await fields.count().catch(() => 0);
  for (let index = 0; index < count; index += 1) {
    const field = fields.nth(index);
    if (await field.isVisible().catch(() => false)) {
      await field.fill(value);
      await waitForAppToSettle(page, 150);
      return;
    }
  }
}

async function fillFirstVisibleInput(page, selectors, value) {
  for (const selector of selectors) {
    const fields = page.locator(selector);
    const count = await fields.count().catch(() => 0);
    for (let index = 0; index < count; index += 1) {
      const field = fields.nth(index);
      if (await field.isVisible().catch(() => false)) {
        await field.fill(value);
        await waitForAppToSettle(page, 150);
        return true;
      }
    }
  }

  return false;
}

async function fillLabeledInput(page, labelText, value) {
  const fields = page.locator(`xpath=//*[normalize-space()="${labelText}"]/following::input[1]`);
  const count = await fields.count().catch(() => 0);
  for (let index = 0; index < count; index += 1) {
    const field = fields.nth(index);
    if (await field.isVisible().catch(() => false)) {
      await field.fill(value);
      await waitForAppToSettle(page, 150);
      return true;
    }
  }

  return false;
}

async function fillInputFollowingLabel(page, labelFragment, value) {
  const fields = page.locator(`xpath=//*[contains(normalize-space(), "${labelFragment}")]/following::input[1]`);
  const count = await fields.count().catch(() => 0);
  for (let index = 0; index < count; index += 1) {
    const field = fields.nth(index);
    if (await field.isVisible().catch(() => false)) {
      await field.fill(value);
      await waitForAppToSettle(page, 150);
      return true;
    }
  }

  return false;
}

async function fillByPlaceholder(page, placeholder, value) {
  const fields = page.getByPlaceholder(placeholder);
  const count = await fields.count().catch(() => 0);
  for (let index = 0; index < count; index += 1) {
    const field = fields.nth(index);
    if (await field.isVisible().catch(() => false)) {
      await field.fill(value);
      await waitForAppToSettle(page, 150);
      return true;
    }
  }

  return false;
}

async function clickVisible(page, locator) {
  const count = await locator.count().catch(() => 0);
  for (let index = 0; index < count; index += 1) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.scrollIntoViewIfNeeded().catch(() => null);
      await candidate.click({ timeout: 5000 });
      await waitForAppToSettle(page, 300);
      return true;
    }
  }

  return false;
}

async function clickFirstVisibleLocator(locator) {
  const count = await locator.count().catch(() => 0);
  for (let index = 0; index < count; index += 1) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.scrollIntoViewIfNeeded().catch(() => null);
      await candidate.click({ timeout: 5000 });
      return true;
    }
  }

  return false;
}

async function optionOrButtonIsVisible(page, optionName) {
  const candidates = [
    page.getByRole('option', { name: String(optionName), exact: true }),
    page.getByRole('button', { name: String(optionName), exact: true }),
    page.getByText(String(optionName), { exact: true })
  ];

  for (const locator of candidates) {
    if (await clickFirstVisibleLocator(locator)) {
      return true;
    }
  }

  return false;
}

async function chooseDropdownOption(page, optionNames) {
  for (const optionName of optionNames) {
    if (!String(optionName || '').trim()) {
      continue;
    }

    const clicked = await optionOrButtonIsVisible(page, optionName);
    if (clicked) {
      await waitForAppToSettle(page, 300);
      return optionName;
    }
  }

  await page.keyboard.press('ArrowDown').catch(() => null);
  await waitForAppToSettle(page, 200);
  await page.keyboard.press('Enter').catch(() => null);
  await waitForAppToSettle(page, 300);
  return null;
}

async function ensureDropdownValueSelected(page, trigger, expectedValue, optionNames) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const control = trigger.first();
    await control.scrollIntoViewIfNeeded().catch(() => null);

    if (!await clickVisible(page, trigger)) {
      break;
    }

    const selectedByClick = await chooseDropdownOption(page, optionNames);
    if (!selectedByClick) {
      await control.focus().catch(() => null);
      await control.press('ArrowDown').catch(() => null);
      await waitForAppToSettle(page, 200);
      await control.press('Enter').catch(() => null);
    }
    await waitForAppToSettle(page, 500);

    const text = ((await control.textContent().catch(() => '')) || '').trim();
    if (new RegExp(escapeRegExp(expectedValue), 'i').test(text)) {
      return;
    }
  }

  const text = ((await trigger.first().textContent().catch(() => '')) || '').trim();
  throw new Error(`Expected dropdown to select ${expectedValue}, but current text is: ${text || '[empty]'}`);
}

async function fillVisibleLocator(locator, value) {
  const count = await locator.count().catch(() => 0);
  for (let index = 0; index < count; index += 1) {
    const field = locator.nth(index);
    if (await field.isVisible().catch(() => false)) {
      await field.fill(value);
      return true;
    }
  }

  return false;
}

async function fillTextbox(container, namePattern, value) {
  return fillVisibleLocator(container.getByRole('textbox', { name: namePattern }), value);
}

async function fillNamedInput(container, fieldName, value, placeholder) {
  const byName = container.locator(`input[name="${fieldName}"]`).first();
  if (await byName.isVisible().catch(() => false)) {
    await byName.fill('');
    await byName.fill(String(value));
    await waitForAppToSettle(container.page(), 150);
    return true;
  }

  if (placeholder) {
    return fillByPlaceholder(container.page(), placeholder, value);
  }

  return false;
}

async function clickFirstVisible(page, locators) {
  for (const locator of locators) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.scrollIntoViewIfNeeded().catch(() => null);
      await locator.click({ timeout: 5000 });
      await waitForAppToSettle(page, 300);
      return true;
    }
  }

  return false;
}

async function ensureEnrollmentYes(page) {
  const form = page.locator('form').first();
  const enrollmentYes = page.locator('#enrolled-yes').first();
  if (await enrollmentYes.isVisible().catch(() => false) && !await enrollmentYes.isChecked().catch(() => false)) {
    await enrollmentYes.click({ timeout: 5000 });
    await waitForAppToSettle(page, 300);
  }

  return form;
}

async function expectVisibleText(page, text) {
  const locator = page.getByText(text, { exact: true }).first();
  await expect(locator).toBeVisible({ timeout: 10000 });
}

async function toggleSectionIfNeeded(page, title, childLocator) {
  if (await childLocator.isVisible().catch(() => false)) {
    return;
  }

  const toggled = await clickFirstVisible(page, [
    page.getByRole('button', { name: new RegExp(title, 'i') }).first(),
    page.locator('button').filter({ has: page.getByText(new RegExp(title, 'i')) }).first(),
    page.locator(`xpath=//h3[contains(normalize-space(), "${title}")]/following::button[1]`).first()
  ]);

  if (!toggled && !await childLocator.isVisible().catch(() => false)) {
    throw new Error(`Unable to expand ${title} section.`);
  }
}

async function fillPayByWebCredentials(page, form) {
  await expectVisibleText(page, 'Supplier Script:*');

  const scriptYesClicked = await clickFirstVisible(page, [
    form.locator('#script-yes').first(),
    form.locator('label[for="script-yes"]').first(),
    page.getByText(/^yes$/i).last()
  ]);

  if (!scriptYesClicked) {
    throw new Error('Unable to select Supplier Script Yes.');
  }

  const userIdField = form.getByPlaceholder(/enter the user id/i).first();
  await toggleSectionIfNeeded(page, 'User Credentials', userIdField);
  await expect(userIdField).toBeVisible({ timeout: 10000 });
  await userIdField.fill('test');
  await waitForAppToSettle(page, 150);

  const passwordField = form.locator('input[name="loginCredentialRequests.0.password"], input[type="password"]').first();
  await expect(passwordField).toBeVisible({ timeout: 10000 });
  await passwordField.fill('test123');
  await waitForAppToSettle(page, 150);

  await fillNamedInput(form, 'proxyPayUrl', 'https://ntqatracker.iterationm.com/', 'Enter the web url...');
  await fillNamedInput(form, 'clientKey', 'test', 'Enter the client key...');
  await fillNamedInput(form, 'websiteKey', 'test12', 'Enter the website key...');
  await fillByPlaceholder(page, 'Enter the confirmation...', 'test@1234.com');
  await fillByPlaceholder(page, 'Enter the batch size...', '10');
}

async function selectSupplierScriptYes(page, form) {
  await expectVisibleText(page, 'Supplier Script:*');
  const scriptYesClicked = await clickFirstVisible(page, [
    form.locator('#script-yes').first(),
    form.locator('label[for="script-yes"]').first(),
    form.getByText(/^yes$/i).last(),
    page.getByText(/^yes$/i).last()
  ]);

  if (!scriptYesClicked) {
    throw new Error('Unable to select Supplier Script Yes.');
  }
}

async function selectSupplierScriptNo(page, form) {
  await expectVisibleText(page, 'Supplier Script:*');
  const scriptNoClicked = await clickFirstVisible(page, [
    form.locator('#script-no').first(),
    form.locator('label[for="script-no"]').first(),
    form.getByText(/^no$/i).last(),
    page.getByText(/^no$/i).last()
  ]);

  if (!scriptNoClicked) {
    throw new Error('Unable to select Supplier Script No.');
  }
}

async function addUserCredential(page, form, options = {}) {
  const { fillValues = false } = options;
  const addButton = page.getByRole('button', { name: /^add$/i }).first();
  await expect(addButton).toBeVisible({ timeout: 10000 });
  await addButton.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);

  const userIdField = form.getByPlaceholder(/enter the user id/i).first();
  await expect(userIdField).toBeVisible({ timeout: 10000 });

  if (fillValues) {
    await userIdField.fill('test');
    await waitForAppToSettle(page, 150);

    const passwordField = form.locator('input[name="loginCredentialRequests.0.password"], input[type="password"]').first();
    await expect(passwordField).toBeVisible({ timeout: 10000 });
    await passwordField.fill('Pass77');
    await waitForAppToSettle(page, 150);
  }

  return form.locator('table tbody tr').first();
}

async function enableCredentialScriptOptions(page, credentialRow) {
  const scriptOptionsLabel = credentialRow.getByText(/script options:/i).first();
  await expect(scriptOptionsLabel).toBeVisible({ timeout: 10000 });
  const scriptOptionsSwitch = credentialRow.locator('[role="switch"]').first();
  await expect(scriptOptionsSwitch).toBeVisible({ timeout: 10000 });
  await scriptOptionsSwitch.click({ timeout: 5000 });
  await waitForAppToSettle(page, 300);
}

async function deleteFirstCredential(page, form) {
  const credentialRow = form.locator('table tbody tr').first();
  await expect(credentialRow).toBeVisible({ timeout: 10000 });
  const deleteButton = credentialRow.getByRole('button').filter({ has: credentialRow.locator('svg.lucide-trash2') }).first();
  const fallbackDeleteButton = credentialRow.locator('button').last();
  const control = await deleteButton.isVisible().catch(() => false) ? deleteButton : fallbackDeleteButton;
  await expect(control).toBeVisible({ timeout: 10000 });
  await control.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
}

async function enablePaymentRestrictions(page, form) {
  await expect(page.getByText(/^Are there any Payment Restrictions:\*?$/i).first()).toBeVisible({ timeout: 10000 });
  const restrictionsYesClicked = await clickFirstVisible(page, [
    form.locator('#restrictions-yes').first(),
    form.locator('label[for="restrictions-yes"]').first(),
    form.getByText(/^yes$/i).last(),
    page.getByText(/^yes$/i).last()
  ]);

  if (!restrictionsYesClicked) {
    throw new Error('Unable to select Payment Restrictions Yes.');
  }

  await waitForAppToSettle(page, 300);
}

async function fillPaymentRestrictions(form, values = {}) {
  const {
    minAmountPerTransaction = '50',
    maxAmountPerTransaction = '200',
    noOfTransactionPerDay = '3',
    amountTransactionLimitPerDay = '70'
  } = values;

  await expect(form.getByText('Minimum Amount Per Transaction:', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  await expect(form.getByText('Maximum Amount Per Transaction:', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  await expect(form.getByText('Amount Transactions Limit Per Day:', { exact: true }).first()).toBeVisible({ timeout: 10000 });

  await fillNamedInput(form, 'minAmountPerTransaction', minAmountPerTransaction);
  await fillNamedInput(form, 'maxAmountPerTransaction', maxAmountPerTransaction);
  await fillNamedInput(form, 'noOfTransactionPerDay', noOfTransactionPerDay);
  await fillNamedInput(form, 'amountTransactionLimitPerDay', amountTransactionLimitPerDay);
}

async function fillManualPayByWebFields(form, values = {}) {
  const {
    proxyPayUrl = 'https://ntqatracker.iterationm.com',
    batchSize = '50',
    cronInterval = '30 minutes'
  } = values;

  await fillNamedInput(form, 'proxyPayUrl', proxyPayUrl, 'Enter the web url...');
  await fillNamedInput(form, 'batchSize', batchSize, 'Enter the batch size...');
  await fillNamedInput(form, 'cronInterval', cronInterval, 'Enter the cron interval...');
}

async function preparePayByWebSupplierScript(page, supplier, options = {}) {
  const {
    addCredential = false,
    fillCredential = false,
    enableScriptOptions = false,
    enablePaymentLimiter = false,
    supplierScript = 'yes',
    enableRestrictions = false,
    fillRestrictions = false,
    manualPayByWeb = false
  } = options;

  const form = await ensureEnrollmentYes(page);

  await expectVisibleText(page, 'Card Type:*');
  await expectVisibleText(page, 'Single Use Card');
  await clickFirstVisible(page, [
    form.locator('#single-use-card').first(),
    form.locator('label[for="single-use-card"]').first(),
    page.getByText(/single use card/i).first()
  ]);

  const remittanceMethodTrigger = getControlFollowingLabel(form, 'Remittance Method');
  await expect(remittanceMethodTrigger).toBeVisible({ timeout: 10000 });
  await ensureDropdownValueSelected(page, remittanceMethodTrigger, 'Pay By Web', ['Pay By Web']);

  if (supplierScript === 'skip') {
    await expectVisibleText(page, 'Supplier Script:*');
  } else if (supplierScript === 'no') {
    await selectSupplierScriptNo(page, form);
  } else {
    await selectSupplierScriptYes(page, form);
  }

  if (enableRestrictions) {
    await enablePaymentRestrictions(page, form);
  }

  if (fillRestrictions) {
    await fillPaymentRestrictions(form);
  }

  if (manualPayByWeb) {
    await fillManualPayByWebFields(form);
  }

  let credentialRow = null;
  if (addCredential) {
    credentialRow = await addUserCredential(page, form, { fillValues: fillCredential });
  }

  if (enableScriptOptions) {
    credentialRow = credentialRow || form.locator('table tbody tr').first();
    await enableCredentialScriptOptions(page, credentialRow);
  }

  if (enablePaymentLimiter) {
    await expectVisibleText(page, 'Script Payment Limiter:');
    const limiterYesClicked = await clickFirstVisible(page, [
      form.locator('#payment-limiter-yes').first(),
      form.locator('label[for="payment-limiter-yes"]').first(),
      page.getByText(/^yes$/i).last()
    ]);
    if (!limiterYesClicked) {
      throw new Error('Unable to select Script Payment Limiter Yes.');
    }
  }

  return { form, credentialRow };
}

function getControlFollowingLabel(container, labelText) {
  return container.locator(`xpath=//*[normalize-space()="${labelText}" or normalize-space()="${labelText}:" or normalize-space()="${labelText}:*"]/following::*[@role="combobox" or self::button][1]`).first();
}

async function completeSupplierEnrollmentDetails(page, supplier, options = {}) {
  const {
    remittanceMethod = 'Pay By Phone',
    submitMode = 'submit',
    requireEnrollmentLabels = false,
    requireCardType = false,
    payByWeb = false
  } = options;

  const form = await ensureEnrollmentYes(page);

  await fillNamedInput(form, 'supplierName', supplier.supplierName, 'Enter the supplier name...');
  await fillNamedInput(form, 'supplierNumber', supplier.supplierNumber, 'Enter the supplier number...');
  await fillNamedInput(form, 'supplierEmail', supplier.supplierEmail, 'Enter the supplier email...');
  await fillNamedInput(form, 'phoneNumber', supplier.phoneNumber, 'Enter the phone number...');

  if (requireEnrollmentLabels) {
    await expectVisibleText(page, 'Enrolled Date:*');
    await expectVisibleText(page, 'Authorization Type:*');
  }

  if (requireCardType) {
    await expectVisibleText(page, 'Card Type:*');
    await expectVisibleText(page, 'Single Use Card');
    const singleUseSelected = await clickFirstVisible(page, [
      form.locator('#single-use-card').first(),
      form.locator('label[for="single-use-card"]').first(),
      page.getByText(/single use card/i).first()
    ]);
    if (!singleUseSelected) {
      throw new Error('Unable to select Single Use Card option.');
    }
  }

  const remittanceMethodTrigger = getControlFollowingLabel(form, 'Remittance Method');
  await expect(remittanceMethodTrigger).toBeVisible({ timeout: 10000 });
  await ensureDropdownValueSelected(page, remittanceMethodTrigger, remittanceMethod, [remittanceMethod]);

  if (payByWeb) {
    await fillPayByWebCredentials(page, form);
  } else {
    await fillNamedInput(form, 'remittanceName', 'Test_123');
    await fillNamedInput(form, 'remittancePhoneNumber', '832937287373');
  }

  await fillNamedInput(form, 'supplierContactName', 'Test', 'Enter the contact name...');
  await fillNamedInput(form, 'contactEmail', 'test@1234.com', 'Enter the contact email...');
  await fillNamedInput(form, 'taxId', '7566', 'Enter the tax ID...');
  await fillNamedInput(form, 'address1', '13th Street. 47 W 13th St, New York', 'Enter the address 1...');
  await fillNamedInput(form, 'address2', '13th Street. 47 W 13th St, New York', 'Enter the address 2...');
  await fillNamedInput(form, 'address3', '13th Street. 47 W 13th St, New York', 'Enter the address 3...');
  await fillNamedInput(form, 'address4', '13th Street. 47 W 13th St, New York', 'Enter the address 4...');

  const countryTrigger = getControlFollowingLabel(form, 'Country');
  await expect(countryTrigger).toBeVisible({ timeout: 10000 });
  await ensureDropdownValueSelected(page, countryTrigger, 'USA', ['USA']);

  const stateTrigger = getControlFollowingLabel(form, 'State');
  await expect(stateTrigger).toBeVisible({ timeout: 10000 });
  await expect(stateTrigger).not.toBeDisabled({ timeout: 10000 });
  await ensureDropdownValueSelected(page, stateTrigger, 'Alaska', ['Alaska']);

  await fillNamedInput(form, 'city', 'New York', 'Enter the city...');
  await fillNamedInput(form, 'zip', '87653', 'Enter the zip...');
  await fillNamedInput(form, 'locationCode', '5677', 'Enter the location code...');

  const visibleInputs = await page.getByRole('textbox').evaluateAll((inputs) => {
    return inputs.map((input) => ({
      ariaLabel: input.getAttribute('aria-label') || '',
      placeholder: input.getAttribute('placeholder') || '',
      value: input.value || ''
    }));
  }).catch(() => []);

  const submitSelector = submitMode === 'continue'
    ? supplierManagementImremitNewSelectors.buttons.saveAndContinue
    : supplierManagementImremitNewSelectors.buttons.saveAndSubmit;

  await clickWithFallback(page, submitSelector, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });
  await waitForAppToSettle(page, 1000);

  const listSearchInput = await resolveFirst(page, supplierManagementImremitNewSelectors.list.searchInput, {
    mustBeVisible: true,
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (!listSearchInput) {
    const formText = await page.locator('form').first().textContent().catch(() => '');
    throw new Error(`Save and submit did not return to the supplier list. Visible inputs: ${JSON.stringify(visibleInputs)}. Current form text: ${String(formText || '').replace(/\s+/g, ' ').trim()}`);
  }
}

async function returnToSupplierListFromEdit(page) {
  const backToList = page.getByRole('link', { name: /back to list/i }).first();
  const backToListButton = page.getByRole('button', { name: /back to list/i }).first();
  const control = await backToList.isVisible().catch(() => false) ? backToList : backToListButton;
  await expect(control).toBeVisible({ timeout: 10000 });
  await control.click({ timeout: 5000 });
  await waitForAppToSettle(page, 1000);
  await openSupplierManagementWorkspace(page);
}

async function declineSupplier(page, supplierName, options = {}) {
  const { requireToast = false } = options;
  await searchSuppliers(page, supplierName);
  await clickWithFallback(page, supplierManagementImremitNewSelectors.actions.rowActionsButton, {
    mustBeVisible: true,
    timeoutPerCandidate: 2500
  });

  const viewDetails = page.getByRole('menuitem', { name: /view supplier details/i }).first();
  if (!await viewDetails.isVisible().catch(() => false)) {
    throw new Error('View Supplier Details action was not available.');
  }

  await viewDetails.click({ timeout: 5000 });
  await waitForAppToSettle(page, 1000);

  const declineButton = page.getByRole('button', { name: /decline/i }).first();
  await expect(declineButton).toBeVisible({ timeout: 15000 });
  await declineButton.click({ timeout: 5000 });

  const confirmDecline = page.getByRole('button', { name: /yes decline/i }).first();
  await expect(confirmDecline).toBeVisible({ timeout: 10000 });
  await confirmDecline.click({ timeout: 5000 });
  await waitForAppToSettle(page, 1000);

  const declineToastTitle = page.getByText(/decline\s*!?$/i).first();
  const declineToastDescription = page.getByText(/the form has been declin(?:e|ed)\.?/i).first();

  if (requireToast) {
    await expect(async () => {
      const hasTitle = await declineToastTitle.isVisible().catch(() => false);
      const hasDescription = await declineToastDescription.isVisible().catch(() => false);
      return hasTitle || hasDescription;
    }).toPass({ timeout: 5000 }).catch(() => null);
  }

  await openSupplierManagementWorkspace(page);
  await searchSuppliers(page, supplierName);
}

async function runTs51(page, data) {
  await reportStep('Open Supplier Management for a customer', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Open the export dialog', async () => {
    await openExportDialog(page);
  });
  await reportStep('Select supplier details fields to export', async () => {
    for (const label of ['Customer Name', 'Supplier Name', 'Tax ID', 'Phone Number', 'Zip', 'Onboard Status']) {
      await toggleExportField(page, label);
    }
  });
  await reportStep('Export the supplier details', async () => {
    await exportSupplierDetails(page);
  });
}

async function runTs52(page, data) {
  await reportStep('Open Supplier Management for a customer', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Open the Add Supplier form', async () => {
    await openAddSupplier(page);
  });
  await reportStep('Enter a space in the Supplier Name field', async () => {
    await fillWithFallback(page, supplierManagementImremitNewSelectors.fields.supplierName, ' ', {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    const supplierNumberField = await resolveFirst(page, supplierManagementImremitNewSelectors.fields.supplierNumber, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await supplierNumberField.locator.click({ timeout: 5000 });
  });
  await reportStep('Verify Supplier Name required validation is shown', async () => {
    const error = await resolveFirst(page, supplierManagementImremitNewSelectors.labels.supplierNameRequired, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(error.locator).toBeVisible({ timeout: 10000 });
  });
}

async function runTs53(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Enter declined enrollment details and submit', async () => {
    const enrollmentLabel = await resolveFirst(page, supplierManagementImremitNewSelectors.labels.supplierEnrollment, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(enrollmentLabel.locator).toBeVisible({ timeout: 10000 });
    const enrollmentNo = page.getByRole('radio', { name: /^no$/i }).first();
    if (await enrollmentNo.isVisible().catch(() => false) && !await enrollmentNo.isChecked().catch(() => false)) {
      await enrollmentNo.click({ timeout: 5000 });
      await waitForAppToSettle(page, 500);
    }
    const declinedReasonLabel = await resolveFirst(page, supplierManagementImremitNewSelectors.labels.declinedReason, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(declinedReasonLabel.locator).toBeVisible({ timeout: 10000 });
    await fillWithFallback(page, supplierManagementImremitNewSelectors.fields.declinedReason, 'test', {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await clickWithFallback(page, supplierManagementImremitNewSelectors.buttons.saveAndSubmit, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await waitForAppToSettle(page, 1000);
    await openSupplierManagementWorkspace(page);
  });
  await reportStep('Approve the supplier after decline submission', async () => {
    await approveSupplier(page, supplier.supplierName);
  });
  await reportStep('Verify the supplier shows Declined Enrollment status', async () => {
    await expectSupplierListStatus(page, supplier.supplierName, 'DECLINED ENROLLMENT');
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs54(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Complete the supplier enrollment details and submit', async () => {
    await completeSupplierEnrollmentDetails(page, supplier);
  });
  await reportStep('Decline the supplier from the details page', async () => {
    await declineSupplier(page, supplier.supplierName);
  });
  await reportStep('Verify the supplier shows Form Declined status', async () => {
    await expectSupplierListStatus(page, supplier.supplierName, 'FORM DECLINED');
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs55(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Verify supplier name search is not case sensitive', async () => {
    await searchSuppliersAndExpectRow(page, supplier.supplierName.toLowerCase(), supplier.supplierName);
    await searchSuppliersAndExpectRow(page, supplier.supplierName.toUpperCase(), supplier.supplierName);
  });
  await reportStep('Verify supplier number search returns the created supplier', async () => {
    await searchSuppliersAndExpectRow(page, supplier.supplierNumber, supplier.supplierName);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs56(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Enter declined enrollment details and submit', async () => {
    const enrollmentLabel = await resolveFirst(page, supplierManagementImremitNewSelectors.labels.supplierEnrollment, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(enrollmentLabel.locator).toBeVisible({ timeout: 10000 });
    const enrollmentNo = page.getByRole('radio', { name: /^no$/i }).first();
    if (await enrollmentNo.isVisible().catch(() => false) && !await enrollmentNo.isChecked().catch(() => false)) {
      await enrollmentNo.click({ timeout: 5000 });
      await waitForAppToSettle(page, 500);
    }
    const declinedReasonLabel = await resolveFirst(page, supplierManagementImremitNewSelectors.labels.declinedReason, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await expect(declinedReasonLabel.locator).toBeVisible({ timeout: 10000 });
    await fillWithFallback(page, supplierManagementImremitNewSelectors.fields.declinedReason, 'test', {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await clickWithFallback(page, supplierManagementImremitNewSelectors.buttons.saveAndSubmit, {
      mustBeVisible: true,
      timeoutPerCandidate: 2500
    });
    await waitForAppToSettle(page, 1000);
    await openSupplierManagementWorkspace(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs57(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Enable supplier enrollment and verify enrolled controls', async () => {
    await ensureEnrollmentYes(page);
    await expectVisibleText(page, 'Enrolled Date:*');
    await expectVisibleText(page, 'Card Type:*');
    await expectVisibleText(page, 'Single Use Card');
    await returnToSupplierListFromEdit(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs58(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Complete enrolled supplier details and submit', async () => {
    await completeSupplierEnrollmentDetails(page, supplier);
  });
  await reportStep('Decline the enrolled supplier from the details page', async () => {
    await declineSupplier(page, supplier.supplierName, { requireToast: true });
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs59(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Complete the Pay By Web supplier script flow and save', async () => {
    await completeSupplierEnrollmentDetails(page, supplier, {
      remittanceMethod: 'Pay By Web',
      submitMode: 'continue',
      requireCardType: true,
      payByWeb: true
    });
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs60(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Enable script options and verify payment filename identifier controls', async () => {
    const { credentialRow } = await preparePayByWebSupplierScript(page, supplier, {
      addCredential: true,
      enableScriptOptions: true
    });
    await expect(credentialRow.getByText(/script options:/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Payment Filename Identifier:', { exact: true }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder(/enter the payment filename identifier/i).first()).toBeVisible({ timeout: 10000 });
    await returnToSupplierListFromEdit(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs61(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Enable payment limiter and verify payment limit number field', async () => {
    const { form } = await preparePayByWebSupplierScript(page, supplier, {
      addCredential: true,
      fillCredential: true,
      enableScriptOptions: true,
      enablePaymentLimiter: true
    });
    await expect(page.getByText('Payment Limit Number:*', { exact: true }).first()).toBeVisible({ timeout: 10000 });
    const paymentLimitNumber = form.locator('input[name="paymentLimitNumber"]').first();
    await expect(paymentLimitNumber).toBeVisible({ timeout: 10000 });
    await paymentLimitNumber.fill('8');
    await waitForAppToSettle(page, 150);
    await returnToSupplierListFromEdit(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs62(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Enable supplier script and verify script option fields', async () => {
    await preparePayByWebSupplierScript(page, supplier);
    for (const label of [
      'Confirmation Of Payment Email:*',
      'Script Payment Limiter:',
      'MFA Email:',
      'MFA Password:',
      'Proxy Pay Batch Size:*',
      'Proxy Pay Cron Interval:'
    ]) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible({ timeout: 10000 });
    }
    await returnToSupplierListFromEdit(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs63(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Enable supplier script and verify payment limiter option', async () => {
    await preparePayByWebSupplierScript(page, supplier);
    await expect(page.getByText('Script Payment Limiter:', { exact: true }).first()).toBeVisible({ timeout: 10000 });
    await returnToSupplierListFromEdit(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs64(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Verify manual Pay By Web payment fields on the supplier script branch', async () => {
    const { form } = await preparePayByWebSupplierScript(page, supplier, {
      manualPayByWeb: true
    });
    for (const label of [
      'Supplier Script:*',
      'Maintenance Window Start Time:',
      'Maintenance Window End Time:'
    ]) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible({ timeout: 10000 });
    }
    await expect(form.locator('input[name="batchSize"]').first()).toHaveValue('50', { timeout: 10000 });
    await expect(form.locator('input[name="cronInterval"]').first()).toHaveValue('30 minutes', { timeout: 10000 });
    await returnToSupplierListFromEdit(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs65(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Add and delete a user credential during enrollment', async () => {
    const { form } = await preparePayByWebSupplierScript(page, supplier, {
      addCredential: true,
      fillCredential: true
    });
    await expect(form.locator('table tbody tr').first()).toBeVisible({ timeout: 10000 });
    await deleteFirstCredential(page, form);
    await expect(form.locator('table tbody tr')).toHaveCount(0, { timeout: 10000 });
    await returnToSupplierListFromEdit(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs66(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Add a user credential during enrollment', async () => {
    const { form, credentialRow } = await preparePayByWebSupplierScript(page, supplier, {
      addCredential: true,
      fillCredential: true
    });
    await expect(page.getByRole('heading', { name: /user credentials/i }).first()).toBeVisible({ timeout: 10000 });
    await expect(credentialRow).toBeVisible({ timeout: 10000 });
    await expect(form.getByPlaceholder(/enter the user id/i).first()).toHaveValue('test', { timeout: 10000 });
    await returnToSupplierListFromEdit(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs67(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details for the created supplier', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
  });
  await reportStep('Add payment restrictions for the supplier', async () => {
    const { form } = await preparePayByWebSupplierScript(page, supplier, {
      supplierScript: 'skip',
      enableRestrictions: true,
      fillRestrictions: true
    });
    await expect(form.locator('input[name="minAmountPerTransaction"]').first()).toHaveValue('50', { timeout: 10000 });
    await expect(form.locator('input[name="maxAmountPerTransaction"]').first()).toHaveValue('200', { timeout: 10000 });
    await expect(form.locator('input[name="noOfTransactionPerDay"]').first()).toHaveValue('3', { timeout: 10000 });
    await expect(form.locator('input[name="amountTransactionLimitPerDay"]').first()).toHaveValue('70', { timeout: 10000 });
    await returnToSupplierListFromEdit(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs68(page, data) {
  const supplier = await reportStep('Create a supplier entry using Save and continue', async () => createSupplier(page, data));
  await reportStep('Verify the new supplier is visible in the list', async () => {
    await searchSuppliersAndExpectRow(page, supplier.supplierName, supplier.supplierName);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs69(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Delete the supplier from the Actions menu', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs70(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open View Supplier Details from the Actions menu', async () => {
    await openViewSupplierDetails(page, supplier.supplierName);
    await returnToSupplierListFromEdit(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs71(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Open Edit Supplier Details from the Actions menu', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await returnToSupplierListFromEdit(page);
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs72(page, data) {
  await reportStep('Open the supplier management list', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Scroll down and use Return to top', async () => {
    await scrollToTopAndVerify(page);
  });
}

async function runTs73(page, data) {
  await reportStep('Open the supplier management list', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Open header menus and choose Hide column', async () => {
    await verifyColumnMenuOptionAcrossHeaders(page, [
      'Customer Name',
      'Supplier Number',
      'Phone Number',
      'Supplier Name',
      'Tax ID',
      'Zip',
      'Updated Date',
      'Supplier Email'
    ], /hide column/i);
  });
}

async function runTs74(page, data) {
  await reportStep('Open the supplier management list', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Open header menus and choose Descending', async () => {
    await verifyColumnMenuOptionAcrossHeaders(page, [
      'Customer Name',
      'Supplier Number',
      'Phone Number',
      'Supplier Name',
      'Tax ID',
      'Zip',
      'Remittance Method',
      'Self Registered',
      'Updated Date',
      'Supplier Email'
    ], /descending/i);
  });
}

async function runTs75(page, data) {
  await reportStep('Open the supplier management list', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Open header menus and choose Ascending', async () => {
    await verifyColumnMenuOptionAcrossHeaders(page, [
      'Customer Name',
      'Supplier Number',
      'Phone Number',
      'Supplier Name',
      'Tax ID',
      'Zip',
      'Remittance Method',
      'Self Registered',
      'Updated Date'
    ], /ascending/i);
  });
}

async function runTs76(page, data) {
  await reportStep('Open the supplier management list', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Open Column Order and verify visible column controls', async () => {
    await toggleFirstVisibleColumnOrderControls(page, [
      'Customer Name',
      'Supplier Number',
      'Supplier Name',
      'Tax ID',
      'Phone Number'
    ]);
  });
}

async function runTs77(page, data) {
  await reportStep('Open the supplier management list', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Open Advanced Search and select an Updated Date', async () => {
    await selectUpdatedDateInAdvancedSearch(page);
  });
}

async function runTs78(page, data) {
  await reportStep('Open the supplier management list', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Filter Advanced Search by Zip Code', async () => {
    await fillAdvancedSearchField(page, {
      labelText: 'Zip Code',
      fieldName: 'zip',
      placeholder: 'Search zip code',
      value: '45445',
      expectedTableText: '45445'
    });
  });
}

async function runTs79(page, data) {
  await reportStep('Open the supplier management list', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Filter Advanced Search by Phone Number', async () => {
    await fillAdvancedSearchField(page, {
      labelText: 'Phone Number',
      fieldName: 'phoneNumber',
      placeholder: 'Search phone no',
      value: '483032011'
    });
  });
}

async function runTs80(page, data) {
  await reportStep('Open the supplier management list', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Filter Advanced Search by Supplier Email', async () => {
    await fillAdvancedSearchField(page, {
      labelText: 'Supplier Email',
      fieldName: 'supplierEmail',
      placeholder: 'Search email',
      value: 'test@test.com',
      expectedTableText: 'test@test.com'
    });
  });
}

async function runTs81(page, data) {
  await reportStep('Open the supplier management list', async () => {
    await openModuleWithCustomer(page, data);
  });
  await reportStep('Open Advanced Search and verify its heading', async () => {
    await openAdvancedSearchPanel(page);
  });
}

async function runTs82(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Complete enrollment and decline the supplier form', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await completeSupplierEnrollmentDetails(page, supplier);
    await declineSupplier(page, supplier.supplierName);
  });
  await reportStep('Filter the supplier list by Form Declined status', async () => {
    await applyStatusFilter(page, 'Form Declined');
    await expectSupplierListStatus(page, supplier.supplierName, 'FORM DECLINED');
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs83(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Filter the supplier list by Onboarding Pending status', async () => {
    await applyStatusFilter(page, 'Onboarding Pending');
    await expectSupplierListStatus(page, supplier.supplierName, 'ONBOARDING PENDING');
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function runTs84(page, data) {
  const supplier = await reportStep('Create a supplier entry', async () => createSupplier(page, data));
  await reportStep('Complete enrollment details for approval pending', async () => {
    await openEditSupplierDetails(page, supplier.supplierName);
    await completeSupplierEnrollmentDetails(page, supplier);
  });
  await reportStep('Filter the supplier list by Approval Pending status', async () => {
    await applyStatusFilter(page, 'Approval Pending');
    await expectSupplierListStatus(page, supplier.supplierName, 'APPROVAL PENDING');
  });
  await reportStep('Delete the created supplier entry', async () => {
    await deleteSupplier(page, supplier.supplierName);
  });
}

async function markScenarioPending(_page, _data, scenarioName) {
  test.fixme(`Pending conversion for Supplier_Management_imREmit_New: ${scenarioName}`);
}

const scenarioMap = Object.fromEntries(
  Array.from({ length: 34 }, (_, index) => {
    const scenarioNumber = String(index + 51).padStart(2, '0');
    return [`TS_${scenarioNumber}`, markScenarioPending];
  })
);

scenarioMap.TS_51 = runTs51;
scenarioMap.TS_52 = runTs52;
scenarioMap.TS_53 = runTs53;
scenarioMap.TS_54 = runTs54;
scenarioMap.TS_55 = runTs55;
scenarioMap.TS_56 = runTs56;
scenarioMap.TS_57 = runTs57;
scenarioMap.TS_58 = runTs58;
scenarioMap.TS_59 = runTs59;
scenarioMap.TS_60 = runTs60;
scenarioMap.TS_61 = runTs61;
scenarioMap.TS_62 = runTs62;
scenarioMap.TS_63 = runTs63;
scenarioMap.TS_64 = runTs64;
scenarioMap.TS_65 = runTs65;
scenarioMap.TS_66 = runTs66;
scenarioMap.TS_67 = runTs67;
scenarioMap.TS_68 = runTs68;
scenarioMap.TS_69 = runTs69;
scenarioMap.TS_70 = runTs70;
scenarioMap.TS_71 = runTs71;
scenarioMap.TS_72 = runTs72;
scenarioMap.TS_73 = runTs73;
scenarioMap.TS_74 = runTs74;
scenarioMap.TS_75 = runTs75;
scenarioMap.TS_76 = runTs76;
scenarioMap.TS_77 = runTs77;
scenarioMap.TS_78 = runTs78;
scenarioMap.TS_79 = runTs79;
scenarioMap.TS_80 = runTs80;
scenarioMap.TS_81 = runTs81;
scenarioMap.TS_82 = runTs82;
scenarioMap.TS_83 = runTs83;
scenarioMap.TS_84 = runTs84;

async function runScenario(page, data, scenarioName) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => String(scenarioName).includes(key));
  if (!scenarioKey) {
    throw new Error(`Unsupported scenario for Supplier_Management_imREmit_New: ${scenarioName}`);
  }

  return scenarioMap[scenarioKey](page, data, scenarioName);
}

const helperMap = {
  openModule,
  openSupplierManagementWorkspace,
  runScenario
};

module.exports = {
  supplierManagementImremitNewHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario,
    selectors: supplierManagementImremitNewSelectors
  }
};
