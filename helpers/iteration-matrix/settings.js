const { expect, test } = require('@playwright/test');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { settingsSelectors } = require('../../selectors/iteration-matrix/settings.selectors.js');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function reportStep(name, action) {
  return test.step(name, action);
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

async function getVisibleComboboxes(page) {
  const comboboxes = page.getByRole('combobox');
  const total = await comboboxes.count().catch(() => 0);
  const visibleComboboxes = [];

  for (let index = 0; index < total; index += 1) {
    const combobox = comboboxes.nth(index);
    if (await combobox.isVisible().catch(() => false)) {
      visibleComboboxes.push(combobox);
    }
  }

  return visibleComboboxes;
}

async function getCustomerCombobox(page) {
  const labeledCombobox = page.getByText(/select customer/i).first().locator('xpath=following::*[@role="combobox"][1]').first();
  if (await labeledCombobox.isVisible().catch(() => false)) {
    return labeledCombobox;
  }

  const visibleComboboxes = await getVisibleComboboxes(page);
  return visibleComboboxes[visibleComboboxes.length - 1] || null;
}

async function waitForSettingsShell(page) {
  await Promise.all([
    waitForFirstVisible(page, settingsSelectors.subrouteNavigation),
    waitForFirstVisible(page, [
      ...settingsSelectors.settingsHeading,
      ...settingsSelectors.customerCombobox,
      ...settingsSelectors.searchFields.allEntries
    ])
  ]);
}

async function openModule(page) {
  await clickFirstVisible(page, settingsSelectors.statementReconModule);
  await waitForFirstVisible(page, settingsSelectors.statementReconHeading);
  await clickFirstVisible(page, settingsSelectors.settingsLink);
  await page.waitForURL(/statement-recon\/settings/i, { timeout: 15000 });
  await waitForSettingsShell(page);
  return page;
}

async function selectCustomer(page, preferredCustomer = 'Stanford U') {
  const customerCombobox = await getCustomerCombobox(page);

  if (!customerCombobox) {
    throw new Error('No visible customer combobox was found on the Settings page.');
  }

  const currentText = ((await customerCombobox.textContent().catch(() => '')) || '').trim();
  const hasExistingSelection = currentText && !/select customer/i.test(currentText);
  if (hasExistingSelection && currentText.toLowerCase().includes(preferredCustomer.toLowerCase())) {
    return currentText;
  }

  await customerCombobox.click({ timeout: 5000 });

  const searchInput = await waitForFirstVisible(page, settingsSelectors.customerSearchInput);
  await searchInput.fill('');
  await searchInput.type(preferredCustomer, { delay: 40 });
  await page.waitForTimeout(500);

  const preferredOption = page.getByRole('option', {
    name: new RegExp(escapeRegExp(preferredCustomer), 'i')
  }).first();

  if (await preferredOption.isVisible().catch(() => false)) {
    await preferredOption.click({ timeout: 5000 });
  } else {
    const firstOption = await waitForFirstVisible(page, settingsSelectors.customerOptions, 4000).catch(() => null);
    if (firstOption) {
      await firstOption.click({ timeout: 5000 });
    } else if (hasExistingSelection) {
      await page.keyboard.press('Escape').catch(() => {});
      return currentText;
    } else {
      throw new Error(`No customer options became visible after searching for ${preferredCustomer}.`);
    }
  }

  await page.waitForTimeout(500);

  const selectedText = ((await customerCombobox.textContent().catch(() => '')) || '').trim();
  if (!selectedText || /select customer/i.test(selectedText)) {
    throw new Error(`Customer selection did not apply. Current trigger text: ${selectedText}`);
  }

  return selectedText;
}

async function dismissDeleteSettingIfPresent(page) {
  const reconNotificationRow = page.getByRole('row').filter({
    has: page.getByText(/Recon Notification/i)
  }).first();

  if (!await reconNotificationRow.isVisible().catch(() => false)) {
    return;
  }

  const actionButton = reconNotificationRow.getByRole('button').last();
  if (await actionButton.isVisible().catch(() => false)) {
    await actionButton.click({ timeout: 5000 });
  } else {
    const gripHandle = reconNotificationRow.locator('svg.lucide.lucide-grip-vertical').first();
    if (await gripHandle.isVisible().catch(() => false)) {
      await gripHandle.click({ timeout: 5000 });
    }
  }

  const deleteSetting = page.getByText(/^Delete Setting$/i).first();
  if (await deleteSetting.isVisible().catch(() => false)) {
    await deleteSetting.click({ timeout: 5000 });
  }
}

async function ensureSettingsPage(page, preferredCustomer = 'Stanford U') {
  await openModule(page);
  if (preferredCustomer) {
    await selectCustomer(page, preferredCustomer);
  }
}

async function expectTextVisible(page, pattern, timeout = 15000) {
  const locator = typeof pattern === 'string'
    ? page.getByText(pattern, { exact: false }).first()
    : page.getByText(pattern).first();
  await locator.waitFor({ state: 'visible', timeout });
  return locator;
}

async function fillSearchField(page, key, value) {
  const selectors = settingsSelectors.searchFields[key];
  if (!selectors) {
    throw new Error(`Unsupported Settings search field: ${key}`);
  }

  const input = await waitForFirstVisible(page, selectors);
  await input.fill('');
  await input.fill(value, { timeout: 5000 });
  await page.waitForTimeout(500);
  return input;
}

async function expectSearchFieldValue(page, key, expectedValue) {
  const selectors = settingsSelectors.searchFields[key];
  const input = await waitForFirstVisible(page, selectors);
  await expect(input).toHaveValue(expectedValue);
}

async function openColumnViewsMenu(page) {
  const button = await waitForFirstVisible(page, settingsSelectors.columnViewsButton);
  await button.click({ timeout: 5000 });
}

async function toggleFirstColumnOption(page) {
  const option = page.getByRole('checkbox').first();
  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click({ timeout: 5000 });
  await page.waitForTimeout(300);
  await option.click({ timeout: 5000 });
}

async function openHeaderMenu(page, headerLabel = 'Settings ID') {
  const header = page.getByText(new RegExp(`^${escapeRegExp(headerLabel)}$`, 'i')).first();
  await header.waitFor({ state: 'visible', timeout: 15000 });
  await header.click({ timeout: 5000 });
}

async function chooseHeaderMenuOption(page, optionLabel) {
  const option = page.getByText(new RegExp(optionLabel, 'i')).first();
  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click({ timeout: 5000 });
}

async function clickPaginationButton(page, namePattern) {
  const button = page.getByRole('button', { name: namePattern }).first();
  await button.waitFor({ state: 'visible', timeout: 15000 });

  if (await button.isDisabled().catch(() => false)) {
    const singlePage = await page.getByText(/Page:\s*1\s+of\s+1/i).first().isVisible().catch(() => false);
    if (singlePage) {
      return;
    }
  }

  try {
    await button.click({ timeout: 5000 });
  } catch (error) {
    const singlePage = await page.getByText(/Page:\s*1\s+of\s+1/i).first().isVisible().catch(() => false);
    if (singlePage) {
      return;
    }

    throw error;
  }
}

async function openPageSizeMenu(page) {
  const candidates = [
    ...settingsSelectors.paginationTrigger,
    'button:has-text("5")',
    'button:has-text("10")',
    'button:has-text("25")',
    'button:has-text("50")',
    'button:has-text("100")'
  ];
  const trigger = await waitForFirstVisible(page, candidates);
  await trigger.click({ timeout: 5000 });
}

async function choosePageSize(page, size) {
  const option = page.getByRole('option', { name: String(size), exact: true }).first();
  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click({ timeout: 5000 });
  await page.waitForTimeout(300);
}

async function clickReturnToTop(page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const button = await waitForFirstVisible(page, settingsSelectors.returnToTop);
  await button.click({ timeout: 5000 });
}

async function expectSectionVisible(page, title) {
  await expectTextVisible(page, new RegExp(escapeRegExp(title), 'i'));
}

async function clickButtonByName(page, namePattern) {
  const button = page.getByRole('button', { name: namePattern }).first();
  await button.waitFor({ state: 'visible', timeout: 15000 });
  await button.click({ timeout: 5000 });
}

async function clickFirstLabel(page, labelPattern) {
  const label = page.getByText(labelPattern).first();
  await label.waitFor({ state: 'visible', timeout: 15000 });
  await label.click({ timeout: 5000 });
}

function getReconNotificationCard(page) {
  return page.locator('div, section').filter({
    has: page.getByText(/^Recon Notification$/i)
  }).first();
}

async function ensureReconNotificationEnabled(page) {
  const card = getReconNotificationCard(page);
  const configureButton = card.getByRole('button', { name: /Configure/i }).first();
  if (await configureButton.isEnabled().catch(() => false)) {
    return;
  }

  const enabledLabel = card.getByText(/^Enabled$/i).first();
  if (await enabledLabel.isVisible().catch(() => false)) {
    await enabledLabel.click({ timeout: 5000 });
  }

  await expect(configureButton).toBeEnabled({ timeout: 5000 });
}

async function openReconNotificationDialog(page) {
  await expectSectionVisible(page, 'Recon Notification');
  await ensureReconNotificationEnabled(page);
  await clickButtonByName(page, /Configure/i);
  await waitForFirstVisible(page, [
    'text="Configure Recon Notification"',
    'input[placeholder="Type email and press Enter"]',
    'input[name^="recipientEmails"]',
    'input[placeholder="Enter the recipient email..."]',
    'button:has-text("Add Email")',
    'button:has-text("Delete")',
    '[role="dialog"]'
  ]);
}

async function fillReconNotificationEmail(page, emailAddress) {
  const input = page.locator('input[placeholder="Type email and press Enter"], input[name^="recipientEmails"], input[placeholder="Enter the recipient email..."]').first();
  await input.waitFor({ state: 'visible', timeout: 15000 });
  await input.fill(emailAddress, { timeout: 5000 });
  return input;
}

async function clickAddEmail(page) {
  const button = page.getByRole('button', { name: /Add Email|Add/i }).first();
  await button.waitFor({ state: 'visible', timeout: 15000 });
  await button.click({ timeout: 5000 });
}

async function clickDeleteEmail(page, emailAddress) {
  const dialog = page.locator('[role="dialog"]').last();
  const scope = await dialog.isVisible().catch(() => false) ? dialog : page.locator('body');

  if (emailAddress) {
    const emailChipControl = scope.locator('span, div, button').filter({
      hasText: new RegExp(`${escapeRegExp(emailAddress)}.*(Remove|Delete)|(Remove|Delete).*${escapeRegExp(emailAddress)}`, 'i')
    }).last();
    if (await emailChipControl.isVisible().catch(() => false)) {
      await emailChipControl.click({ timeout: 5000, force: true });
      return;
    }

    const emailScopedRemove = scope.locator(`text=${emailAddress}`).last().locator('xpath=following::*[normalize-space()="Remove" or normalize-space()="Delete"][1]').first();
    if (await emailScopedRemove.isVisible().catch(() => false)) {
      await emailScopedRemove.click({ timeout: 5000, force: true });
      return;
    }
  }

  const pendingRecipientInput = scope.locator('input[placeholder="Enter the recipient email..."]').last();
  if (await pendingRecipientInput.isVisible().catch(() => false)) {
    const adjacentDelete = pendingRecipientInput.locator('xpath=following::*[normalize-space()="Delete" or normalize-space()="Remove"][1]').first();
    if (await adjacentDelete.isVisible().catch(() => false)) {
      await adjacentDelete.click({ timeout: 5000 });
      return;
    }

    const rowDelete = pendingRecipientInput.locator('xpath=ancestor::tr[1]//*[normalize-space()="Delete" or normalize-space()="Remove"] | ancestor::tr[1]//*[@role="button" and (normalize-space()="Delete" or normalize-space()="Remove")] | ancestor::div[contains(@class,"flex")][1]//*[normalize-space()="Delete" or normalize-space()="Remove"]').last();
    if (await rowDelete.isVisible().catch(() => false)) {
      await rowDelete.click({ timeout: 5000, force: true });
      return;
    }
  }

  const button = scope.getByRole('button', { name: /Delete|Remove/i }).first();
  if (await button.isVisible().catch(() => false)) {
    await button.click({ timeout: 5000 });
    return;
  }

  const rowDelete = scope.locator('tr, div').filter({
    has: scope.locator('input[placeholder="Enter the recipient email..."], input[name^="recipientEmails"]')
  }).getByText(/^(Delete|Remove)$/i).last();
  if (await rowDelete.isVisible().catch(() => false)) {
    await rowDelete.click({ timeout: 5000, force: true });
    return;
  }

  const textButton = scope.locator('span, button, [role="button"]').filter({ hasText: /^(Delete|Remove)$/i }).last();
  await textButton.waitFor({ state: 'visible', timeout: 15000 });
  await textButton.click({ timeout: 5000, force: true });
}

async function clickFirstUpdateSetting(page) {
  await clickButtonByName(page, /Update Setting/i);
}

async function clickDeleteSettingFromRow(page, rowPattern) {
  const inlineGripHandle = page.getByText(rowPattern).first().locator('xpath=following::*[name()="svg" and contains(@class,"lucide-grip-vertical")][1]').first();
  if (await inlineGripHandle.isVisible().catch(() => false)) {
    await inlineGripHandle.click({ timeout: 5000, force: true });
  } else {
  const row = page.locator('tr, div').filter({
    has: page.getByText(rowPattern).first()
  }).first();

    if (!await row.isVisible().catch(() => false)) {
      throw new Error(`Could not find a Settings row matching ${rowPattern}.`);
    }

    const actionButton = row.getByRole('button').last();
    if (await actionButton.isVisible().catch(() => false)) {
      await actionButton.click({ timeout: 5000, force: true });
    } else {
      const gripHandle = row.locator('svg.lucide.lucide-grip-vertical').first();
      await gripHandle.waitFor({ state: 'visible', timeout: 15000 });
      await gripHandle.click({ timeout: 5000, force: true });
    }
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const deleteMenuItem = page.getByRole('menuitem', { name: /Delete Setting/i }).first();
    if (await deleteMenuItem.isVisible().catch(() => false)) {
      await deleteMenuItem.click({ timeout: 5000 });
      return;
    }

    const deleteButton = page.getByRole('button', { name: /Delete Setting/i }).first();
    if (await deleteButton.isVisible().catch(() => false)) {
      await deleteButton.click({ timeout: 5000 });
      return;
    }

    const deleteText = page.getByText(/^Delete Setting$/i).first();
    if (await deleteText.isVisible().catch(() => false)) {
      await deleteText.click({ timeout: 5000 });
      return;
    }

    if (attempt === 0) {
      if (await inlineGripHandle.isVisible().catch(() => false)) {
        await inlineGripHandle.click({ timeout: 5000, force: true });
      }
    }
  }

  throw new Error(`Delete Setting menu did not become visible for row ${rowPattern}.`);
}

async function runTs02(page) {
  await reportStep('Open Settings and select a customer', async () => {
    await ensureSettingsPage(page);
  });
}

async function runTs03(page) {
  await reportStep('Open Settings and search trailing leading type values', async () => {
    await ensureSettingsPage(page);
    await fillSearchField(page, 'leadingTrailingType', 'trailing');
    await expectSearchFieldValue(page, 'leadingTrailingType', 'trailing');
  });
}

async function runTs04(page) {
  await reportStep('Open Settings and verify Ignore Special Characters section', async () => {
    await ensureSettingsPage(page);
    await expectSectionVisible(page, 'Ignore Special Characters');
  });
}

async function runTs05(page) {
  await reportStep('Open Settings and verify Character Limit section', async () => {
    await ensureSettingsPage(page);
    await expectSectionVisible(page, 'Character Limit for Invoice Statements');
  });
}

async function runTs06(page) {
  await reportStep('Open Settings and verify Credit Pair Logic section', async () => {
    await ensureSettingsPage(page);
    await expectSectionVisible(page, 'Matched Credit Logic');
  });
}

async function runTs07(page) {
  await reportStep('Open Settings and verify PO Match section', async () => {
    await ensureSettingsPage(page);
    await expectSectionVisible(page, 'PO Match');
    await clickFirstLabel(page, /Enabled/i);
  });
}

async function runTs08(page) {
  await reportStep('Open Settings and verify Potential Match section', async () => {
    await ensureSettingsPage(page);
    await expectSectionVisible(page, 'Potential Match');
    await clickFirstLabel(page, /Enabled/i);
  });
}

async function runTs09(page) {
  await reportStep('Open Settings and verify Recon Notification controls', async () => {
    await ensureSettingsPage(page);
    await openReconNotificationDialog(page);
  });
}

async function runTs10(page) {
  await reportStep('Open Settings and return to the top of the page', async () => {
    await ensureSettingsPage(page);
    await clickReturnToTop(page);
  });
}

async function runTs11(page) {
  await reportStep('Open Settings and search leading type values', async () => {
    await ensureSettingsPage(page);
    await fillSearchField(page, 'leadingTrailingType', 'leading');
    await expectSearchFieldValue(page, 'leadingTrailingType', 'leading');
  });
}

async function runTs12(page) {
  await reportStep('Open Settings and search both leading or trailing values', async () => {
    await ensureSettingsPage(page);
    await fillSearchField(page, 'leadingTrailingType', 'both');
    await expectSearchFieldValue(page, 'leadingTrailingType', 'both');
  });
}

async function runTs13(page) {
  await reportStep('Open Settings and verify Credit Pair Logic section for missing credit', async () => {
    await ensureSettingsPage(page);
    await expectSectionVisible(page, 'Matched Credit Logic');
  });
}

async function runTs14(page) {
  await reportStep('Open Settings and click the last page control', async () => {
    await ensureSettingsPage(page);
    await clickPaginationButton(page, /Go to last page/i);
  });
}

async function runTs15(page) {
  await reportStep('Open Settings and click the previous page control', async () => {
    await ensureSettingsPage(page);
    await clickPaginationButton(page, /Go to previous page/i);
  });
}

async function runTs16(page) {
  await reportStep('Open Settings and click the first page control', async () => {
    await ensureSettingsPage(page);
    await clickPaginationButton(page, /Go to first page/i);
  });
}

async function runTs17(page) {
  await reportStep('Open Settings and click the next page control', async () => {
    await ensureSettingsPage(page);
    await clickPaginationButton(page, /Go to next page/i);
  });
}

async function runTs18(page) {
  await reportStep('Open Settings and use the column views menu', async () => {
    await ensureSettingsPage(page);
    await openColumnViewsMenu(page);
    await toggleFirstColumnOption(page);
  });
}

async function runTs19(page) {
  await reportStep('Open Settings and use the return to top button', async () => {
    await ensureSettingsPage(page);
    await clickReturnToTop(page);
  });
}

async function runTs20(page) {
  await reportStep('Open Settings and choose descending sort from the header menu', async () => {
    await ensureSettingsPage(page);
    await openHeaderMenu(page, 'Settings ID');
    await chooseHeaderMenuOption(page, 'Descending|Desc');
  });
}

async function runTs21(page) {
  await reportStep('Open Settings and choose hide column from the header menu', async () => {
    await ensureSettingsPage(page);
    await openHeaderMenu(page, 'Settings ID');
    await chooseHeaderMenuOption(page, 'Hide column|Hide');
  });
}

async function runTs22(page) {
  await reportStep('Open Settings and use the pagination size menu', async () => {
    await ensureSettingsPage(page);
    for (const size of [50, 100, 5, 10, 25]) {
      await openPageSizeMenu(page);
      await choosePageSize(page, size);
    }
  });
}

async function runTs23(page) {
  await reportStep('Open Settings and search all entries', async () => {
    await ensureSettingsPage(page);
    await fillSearchField(page, 'allEntries', '146');
    await expectSearchFieldValue(page, 'allEntries', '146');
  });
}

async function runTs24(page) {
  await reportStep('Open Settings and search by character', async () => {
    await ensureSettingsPage(page);
    await fillSearchField(page, 'character', '#');
    await expectSearchFieldValue(page, 'character', '#');
  });
}

async function runTs25(page) {
  await reportStep('Open Settings and search by leading or trailing type', async () => {
    await ensureSettingsPage(page);
    await fillSearchField(page, 'leadingTrailingType', 'trailing');
    await expectSearchFieldValue(page, 'leadingTrailingType', 'trailing');
  });
}

async function runTs26(page) {
  await reportStep('Open Settings and use an Update Setting control', async () => {
    await ensureSettingsPage(page);
    await clickFirstUpdateSetting(page);
  });
}

async function runTs27(page) {
  await reportStep('Open Settings and use a Delete Setting control', async () => {
    await ensureSettingsPage(page);
    await clickDeleteSettingFromRow(page, /trailing/i);
  });
}

async function runTs28(page) {
  await reportStep('Open Settings and choose ascending sort from the header menu', async () => {
    await ensureSettingsPage(page);
    await openHeaderMenu(page, 'Settings ID');
    await chooseHeaderMenuOption(page, 'Ascending|Asc');
  });
}

async function runTs29(page) {
  await reportStep('Open Settings and toggle the statement uploader notification checkbox', async () => {
    await ensureSettingsPage(page);
    await openReconNotificationDialog(page);
    await clickFirstLabel(page, /Send Notification to the Statement Uploader/i);
  });
}

async function runTs30(page) {
  await reportStep('Open Settings and add a recon notification email', async () => {
    await ensureSettingsPage(page);
    await openReconNotificationDialog(page);
    await fillReconNotificationEmail(page, 'automation.settings@example.com');
    await clickAddEmail(page);
  });
}

async function runTs31(page) {
  await reportStep('Open Settings and delete a recon notification email row', async () => {
    await ensureSettingsPage(page);
    await dismissDeleteSettingIfPresent(page);
    await openReconNotificationDialog(page);
    const emailAddress = 'automation.settings@example.com';
    await fillReconNotificationEmail(page, emailAddress);
    await clickAddEmail(page);
    await clickDeleteEmail(page, emailAddress);
  });
}

async function runTs01(page) {
  await reportStep('Open Statement Recon Settings page', async () => {
    await openModule(page);
  });

  await reportStep('Verify the Settings module is visible', async () => {
    await waitForSettingsShell(page);
    await expect(page).toHaveURL(/statement-recon\/settings/i);
  });
}

async function runScenario(page, data, scenarioName) {
  const scenarios = [
    [/^TS_01_/i, runTs01],
    [/^TS_02_/i, runTs02],
    [/^TS_03_/i, runTs03],
    [/^TS_04_/i, runTs04],
    [/^TS_05_/i, runTs05],
    [/^TS_06_/i, runTs06],
    [/^TS_07_/i, runTs07],
    [/^TS_08_/i, runTs08],
    [/^TS_09_/i, runTs09],
    [/^TS_10_/i, runTs10],
    [/^TS_11_/i, runTs11],
    [/^TS_12_/i, runTs12],
    [/^TS_13_/i, runTs13],
    [/^TS_14_/i, runTs14],
    [/^TS_15_/i, runTs15],
    [/^TS_16_/i, runTs16],
    [/^TS_17_/i, runTs17],
    [/^TS_18_/i, runTs18],
    [/^TS_19_/i, runTs19],
    [/^TS_20_/i, runTs20],
    [/^TS_21_/i, runTs21],
    [/^TS_22_/i, runTs22],
    [/^TS_23_/i, runTs23],
    [/^TS_24_/i, runTs24],
    [/^TS_25_/i, runTs25],
    [/^TS_26_/i, runTs26],
    [/^TS_27_/i, runTs27],
    [/^TS_28_/i, runTs28],
    [/^TS_29_/i, runTs29],
    [/^TS_30_/i, runTs30],
    [/^TS_31_/i, runTs31]
  ];

  for (const [pattern, handler] of scenarios) {
    if (pattern.test(scenarioName)) {
      return handler(page, data);
    }
  }

  throw new Error(`Settings scenario not implemented yet: ${scenarioName}`);
}

const helperMap = {
  openModule,
  ensureSettingsPage,
  selectCustomer,
  fillSearchField,
  openColumnViewsMenu,
  openHeaderMenu,
  openReconNotificationDialog,
  runScenario,
  selectors: settingsSelectors
};

module.exports = {
  settingsHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap, {
      openModule: 'Open Statement Recon Settings module',
      ensureSettingsPage: 'Open Settings and prepare customer context',
      selectCustomer: 'Select Statement Recon customer',
      fillSearchField: 'Search Settings records',
      openColumnViewsMenu: 'Open Settings column views menu',
      openHeaderMenu: 'Open Settings table header menu',
      openReconNotificationDialog: 'Open Recon Notification configuration',
      runScenario: 'Run Settings scenario'
    }),
    runScenario,
    selectors: settingsSelectors
  }
};
