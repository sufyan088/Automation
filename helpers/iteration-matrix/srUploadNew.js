const { srUploadNewSelectors } = require('../../selectors/iteration-matrix/srUploadNew.selectors.js');

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

async function openModule(page) {
  await clickFirstVisible(page, srUploadNewSelectors.statementReconModule);
  await waitForFirstVisible(page, srUploadNewSelectors.pageHeading);
  return page;
}

async function selectCustomer(page, customerName) {
  await clickFirstVisible(page, srUploadNewSelectors.customerTrigger);

  const searchInput = await waitForFirstVisible(page, srUploadNewSelectors.customerSearchInput);
  await searchInput.fill('');
  await searchInput.type(customerName, { delay: 40 });
  await page.waitForTimeout(1200);

  await searchInput.press('Enter').catch(() => {});
  await page.waitForTimeout(500);

  const triggerAfterEnter = await waitForFirstVisible(page, srUploadNewSelectors.customerTrigger);
  const triggerTextAfterEnter = ((await triggerAfterEnter.textContent().catch(() => '')) || '').trim();
  if (triggerTextAfterEnter.toLowerCase().includes(customerName.toLowerCase())) {
    return;
  }

  const listboxOption = page.locator('[role="listbox"] [role="option"]').filter({ hasText: customerName }).first();
  if (await listboxOption.isVisible().catch(() => false)) {
    await listboxOption.click({ timeout: 5000 });
    return;
  }

  const option = page.getByRole('option', { name: new RegExp(customerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first();
  if (await option.isVisible().catch(() => false)) {
    await option.click({ timeout: 5000 });
    return;
  }

  const fallbackOption = page.locator('[role="listbox"] span').filter({ hasText: customerName }).first();
  if (await fallbackOption.isVisible().catch(() => false)) {
    await fallbackOption.click({ timeout: 5000 });
    return;
  }

  const firstVisibleOption = page.locator('[role="listbox"] [role="option"]').first();
  if (await firstVisibleOption.isVisible().catch(() => false)) {
    await firstVisibleOption.click({ timeout: 5000 });
    return;
  }

  await searchInput.press('ArrowDown').catch(() => {});
  await searchInput.press('Enter').catch(() => {});
  await page.waitForTimeout(500);

  const triggerAfterArrowSelect = await waitForFirstVisible(page, srUploadNewSelectors.customerTrigger);
  const triggerTextAfterArrowSelect = ((await triggerAfterArrowSelect.textContent().catch(() => '')) || '').trim();
  if (triggerTextAfterArrowSelect && !/select customer/i.test(triggerTextAfterArrowSelect)) {
    return;
  }

  throw new Error(`Customer option was not available: ${customerName}`);
}

async function verifySelectedCustomer(page, expectedCustomer, previousCustomer) {
  const trigger = await waitForFirstVisible(page, srUploadNewSelectors.customerTrigger);
  const triggerText = ((await trigger.textContent().catch(() => '')) || '').trim();

  if (!triggerText.includes(expectedCustomer)) {
    throw new Error(`Selected customer did not update to ${expectedCustomer}. Current trigger text: ${triggerText}`);
  }

  if (previousCustomer && previousCustomer !== expectedCustomer && triggerText.includes(previousCustomer)) {
    throw new Error(`Customer trigger still shows multiple customers: ${triggerText}`);
  }
}

async function ensureCustomerSelected(page, preferredCustomer) {
  const trigger = await waitForFirstVisible(page, srUploadNewSelectors.customerTrigger);
  const triggerText = ((await trigger.textContent().catch(() => '')) || '').trim();

  if (triggerText && !/select customer/i.test(triggerText)) {
    return triggerText;
  }

  if (!preferredCustomer) {
    throw new Error('No customer is selected and no preferred customer was provided.');
  }

  await selectCustomer(page, preferredCustomer);
  return preferredCustomer;
}

async function searchSupplier(page, supplierQuery) {
  const supplierTrigger = await clickFirstVisible(page, srUploadNewSelectors.supplierSection);

  try {
    const searchInput = await waitForFirstVisible(page, srUploadNewSelectors.supplierSearchInput, 3000);
    await searchInput.click({ timeout: 5000 }).catch(() => {});
    await searchInput.fill(supplierQuery);

    const currentValue = await searchInput.inputValue();
    if (currentValue !== supplierQuery) {
      throw new Error(`Supplier search value mismatch. Expected ${supplierQuery}, received ${currentValue}`);
    }
    return;
  } catch {
    await supplierTrigger.click({ timeout: 5000 }).catch(() => {});
    await page.keyboard.type(supplierQuery, { delay: 50 });
    await page.waitForTimeout(500);

    const searchInput = page.locator(srUploadNewSelectors.supplierSearchInput[0]).first();
    if (await searchInput.isVisible().catch(() => false)) {
      const currentValue = await searchInput.inputValue();
      if (currentValue === supplierQuery) {
        return;
      }
    }

    const triggerText = ((await supplierTrigger.textContent().catch(() => '')) || '').trim();
    if (triggerText.toUpperCase().includes(supplierQuery.toUpperCase())) {
      return;
    }

    throw new Error(`Supplier search value was not applied for query: ${supplierQuery}`);
  }
}

module.exports = {
  srUploadNewHelpers: {
    openModule,
    selectCustomer,
    verifySelectedCustomer,
    ensureCustomerSelected,
    searchSupplier,
    selectors: srUploadNewSelectors
  }
};
