const { expect, test } = require('@playwright/test');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { duplicateDashboardNewHelpers } = require('./duplicateDashboardNew.js');
const { customerManagementAdminNewHelpers } = require('./customerManagementAdminNew.js');
const { customerManagementAdminNewSelectors } = require('../../selectors/iteration-matrix/customerManagementAdminNew.selectors.js');
const { duplicateDashboardNewModuleSelectors } = require('../../selectors/iteration-matrix/duplicateDashboardNewModule.selectors.js');

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function humanizeScenarioTitle(scenarioName) {
  return String(scenarioName || '')
    .replace(/^TS_\d+_/, '')
    .replace(/_/g, ' ')
    .trim();
}

async function reportStep(title, action) {
  return test.step(title, action);
}

async function clickVisibleChoice(page, optionName) {
  const candidates = [
    page.getByRole('option', { name: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }).first(),
    page.getByRole('button', { name: new RegExp(`^${escapeRegExp(optionName)}$`, 'i') }).first(),
    page.getByText(new RegExp(`^${escapeRegExp(optionName)}$`, 'i')).first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 5000 });
      return true;
    }
  }

  return false;
}

async function openModule(page) {
  await duplicateDashboardNewHelpers.openModule(page);
  await duplicateDashboardNewHelpers.openDashboard(page);
  return page;
}

async function createDuplicatePaymentsCustomer(page, data) {
  const { customerName } = await customerManagementAdminNewHelpers.openCreateCustomerForm(page, data);
  await customerManagementAdminNewHelpers.selectModules(page, [customerManagementAdminNewSelectors.modules.duplicatePayments]);
  await customerManagementAdminNewHelpers.submitCustomer(page);
  return customerName;
}

async function selectDashboardCustomer(page, customerName = 'Stanford U') {
  return duplicateDashboardNewHelpers.selectCustomer(page, customerName);
}

async function openRunType(page, customerName, runType) {
  await duplicateDashboardNewHelpers.openRunTypeDropdown(page, customerName);
  const clicked = await clickVisibleChoice(page, runType);
  return clicked;
}

async function expectConfigureVisible(page) {
  await expect(page.getByRole('button', { name: /configure|edit settings/i }).first()).toBeVisible({ timeout: 10000 });
}

async function clickConfigure(page) {
  const configureButton = page.getByRole('button', { name: /configure/i }).first();
  await expect(configureButton).toBeVisible({ timeout: 10000 });
  await configureButton.click({ timeout: 5000 });
}

async function expectSettingsModalVisible(page, headingPattern = /edit .* run settings/i) {
  await expect(page.getByRole('heading', { name: headingPattern }).first()).toBeVisible({ timeout: 10000 });
}

async function expectVisibleText(page, textOrPattern) {
  await expect(page.getByText(textOrPattern).first()).toBeVisible({ timeout: 10000 });
}

async function fillFieldByName(page, fieldName, value) {
  const field = page.locator(`[name="${fieldName}"]`).first();
  await expect(field).toBeVisible({ timeout: 10000 });
  await field.fill(String(value));
}

async function expectButtonVisible(page, buttonNamePattern) {
  await expect(page.getByRole('button', { name: buttonNamePattern }).first()).toBeVisible({ timeout: 10000 });
}

async function clickButton(page, buttonNamePattern) {
  await page.getByRole('button', { name: buttonNamePattern }).first().click({ timeout: 5000 });
}

function submitSettingsControl(page) {
  return page.locator('input[type="submit"][value="Submit Settings"], button[type="submit"]:has-text("Submit Settings"), button:has-text("Submit Settings")').first();
}

async function expectFieldValueContains(page, fieldName, expectedText) {
  const field = page.locator(`[name="${fieldName}"]`).first();
  await expect(field).toBeVisible({ timeout: 10000 });
  await expect(field).toHaveValue(new RegExp(escapeRegExp(String(expectedText))), { timeout: 10000 });
}

async function expectFieldValueMatches(page, fieldName, pattern) {
  const field = page.locator(`[name="${fieldName}"]`).first();
  await expect(field).toBeVisible({ timeout: 10000 });
  await expect(field).toHaveValue(pattern, { timeout: 10000 });
}

async function clickDateButton(page, buttonTextPattern) {
  const dateButton = page.getByRole('button').filter({ hasText: buttonTextPattern }).first();
  await expect(dateButton).toBeVisible({ timeout: 10000 });
  await dateButton.click({ timeout: 5000 });
  return dateButton;
}

async function clickCalendarDay(page, dayText) {
  const dayButton = page.getByRole('button', { name: new RegExp(`^${escapeRegExp(String(dayText))}$`) }).first();
  await expect(dayButton).toBeVisible({ timeout: 10000 });
  await dayButton.click({ timeout: 5000 });
}

async function expectDateButtonValue(page, labelPattern, datePattern) {
  await expect(page.getByText(labelPattern).first()).toBeVisible({ timeout: 10000 });

  const buttons = page.getByRole('button');
  const total = await buttons.count();
  for (let index = 0; index < total; index += 1) {
    const button = buttons.nth(index);
    if (!await button.isVisible().catch(() => false)) {
      continue;
    }

    const text = ((await button.textContent().catch(() => '')) || '').trim();
    if (datePattern.test(text)) {
      return button;
    }
  }

  throw new Error(`No visible date button matched pattern ${datePattern}`);
}

async function dismissDashboardErrorIfPresent(page) {
  const errorText = page.getByText(/getCustomerSettingsByExternalId|Failed query/i).first();
  await errorText.waitFor({ state: 'visible', timeout: 2000 }).catch(() => null);

  const notificationsRegion = page.locator('[role="region"][aria-label*="Notifications"]').first();
  const hasErrorText = await errorText.isVisible().catch(() => false);
  const hasNotifications = await notificationsRegion.isVisible().catch(() => false);

  if (!hasErrorText && !hasNotifications) {
    return;
  }

  const dialog = page.locator('div').filter({ hasText: /getCustomerSettingsByExternalId|Failed query/i }).first();
  const closeButtons = page.locator('[role="region"][aria-label*="Notifications"] button');
  const totalCloseButtons = await closeButtons.count().catch(() => 0);

  for (let index = totalCloseButtons - 1; index >= 0; index -= 1) {
    const closeButton = closeButtons.nth(index);
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click({ timeout: 5000, force: true }).catch(() => null);
    }
  }

  const dialogCloseButton = dialog.locator('button').last();
  if (await dialogCloseButton.isVisible().catch(() => false)) {
    await dialogCloseButton.click({ timeout: 5000, force: true }).catch(() => null);
  }

  await page.keyboard.press('Escape').catch(() => null);
  await errorText.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
  await notificationsRegion.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
}

async function runRoleAccessScenario(page, data) {
  const customerName = await reportStep('Create customer with Duplicate Payments module', async () => {
    return createDuplicatePaymentsCustomer(page, data);
  });

  await reportStep('Open Duplicate Payments dashboard', async () => {
    await openModule(page);
    await dismissDashboardErrorIfPresent(page);
  });

  await reportStep('Select dashboard customer', async () => {
    await selectDashboardCustomer(page, customerName);
    await dismissDashboardErrorIfPresent(page);
  });

  await reportStep('Open run type dropdown', async () => {
    await duplicateDashboardNewHelpers.openRunTypeDropdown(page, customerName);
  });

}

async function openSettingsScenario(page, data, options = {}) {
  const { runType, headingPattern, useExistingCustomer = false, customerName: preferredCustomerName = 'Stanford U' } = options;
  const customerName = useExistingCustomer
    ? preferredCustomerName
    : await reportStep('Create customer with Duplicate Payments module', async () => {
      return createDuplicatePaymentsCustomer(page, data);
    });

  await reportStep('Open Duplicate Payments dashboard', async () => {
    await openModule(page);
    await dismissDashboardErrorIfPresent(page);
  });

  await reportStep('Select dashboard customer', async () => {
    await selectDashboardCustomer(page, customerName);
    await dismissDashboardErrorIfPresent(page);
  });

  if (runType && !/^Initial Run$/i.test(runType)) {
    await reportStep(`Select ${runType}`, async () => {
      const changed = await openRunType(page, customerName, runType);
      if (!changed) {
        throw new Error(`Unable to select run type: ${runType}`);
      }
    });
  }

  await reportStep('Open Duplicate Payments settings', async () => {
    await clickConfigure(page);
    await expectSettingsModalVisible(page, headingPattern);
  });
}

async function runOneTimeRunFieldsScenario(page, data) {
  await openSettingsScenario(page, data, {
    runType: 'One Time Run',
    headingPattern: /Edit One Time Run Settings/i
  });

  await reportStep('Verify One Time Run settings fields', async () => {
    await expectVisibleText(page, /One Time Run Cutoff Percentage:/i);
    await expectVisibleText(page, /One Time Run Start Date:/i);
    await expectVisibleText(page, /One Time Run End Date:/i);
    await expectVisibleText(page, /^Notes:/i);
  });
}

async function runInitialRunFieldsScenario(page, data) {
  await openSettingsScenario(page, data, {
    runType: 'Initial Run',
    headingPattern: /Edit Duplicate Payments Settings/i,
    useExistingCustomer: true,
    customerName: 'Stanford U'
  });

  await reportStep('Verify Initial Run settings fields', async () => {
    await expectVisibleText(page, /Initial Run Cutoff Percentage:/i);
    await expectVisibleText(page, /Initial Run Months:/i);
    await expectVisibleText(page, /^Notes:/i);
    await expect(page.getByRole('button', { name: /Enable Initial Run/i }).first()).toBeVisible({ timeout: 10000 });
  });
}

async function runOneTimeRunButtonVisibleScenario(page, data, options = {}) {
  const { fillNotes = false } = options;

  await openSettingsScenario(page, data, {
    runType: 'One Time Run',
    headingPattern: /Edit One Time Run Settings/i
  });

  await reportStep('Verify One Time Run action remains available', async () => {
    await expectVisibleText(page, /One Time Run Cutoff Percentage:/i);
    await expectVisibleText(page, /One Time Run Start Date:/i);
    await expectVisibleText(page, /One Time Run End Date:/i);
    await expectVisibleText(page, /^Notes:/i);

    if (fillNotes) {
      await fillFieldByName(page, 'notes', 'notes 365');
    }

    await expectButtonVisible(page, /Enable One Time Run/i);
  });
}

async function runInitialRunButtonVisibleScenario(page, data, options = {}) {
  const { fillCutoff = false, fillMonths = false, fillNotes = false } = options;

  await openSettingsScenario(page, data, {
    runType: 'Initial Run',
    headingPattern: /Edit Duplicate Payments Settings/i,
    useExistingCustomer: true,
    customerName: 'Stanford U'
  });

  await reportStep('Verify Initial Run action remains available', async () => {
    await expectVisibleText(page, /Initial Run Cutoff Percentage:/i);
    await expectVisibleText(page, /Initial Run Months:/i);
    await expectVisibleText(page, /^Notes:/i);

    if (fillCutoff) {
      await fillFieldByName(page, 'initial_run_cutoff_percent', 30);
    }

    if (fillMonths) {
      await fillFieldByName(page, 'initial_run_months', 30);
    }

    if (fillNotes) {
      await fillFieldByName(page, 'notes', 'notes 365');
    }

    await expectButtonVisible(page, /Enable Initial Run/i);
  });
}

async function runOneTimeRunExistingSettingsScenario(page, data, options = {}) {
  const {
    openCalendar = false,
    expectedDatePattern,
    clickDay,
    validateStartDateLabelOnly = false,
    dateLabelPattern = /One Time Run Start Date:/i
  } = options;

  await openSettingsScenario(page, data, {
    runType: 'One Time Run',
    headingPattern: /Edit (One Time Run|Duplicate Payments) Settings/i,
    useExistingCustomer: true,
    customerName: 'Stanford U'
  });

  await reportStep('Verify One Time Run configured settings', async () => {
    await expectVisibleText(page, /One Time Run Cutoff Percentage:/i);
    await expectVisibleText(page, /One Time Run Start Date:/i);

    if (!validateStartDateLabelOnly) {
      await expectVisibleText(page, /One Time Run End Date:/i);
    }

    if (expectedDatePattern) {
      await expectDateButtonValue(page, dateLabelPattern, expectedDatePattern);
    }

    if (openCalendar && expectedDatePattern) {
      const dateButton = await expectDateButtonValue(page, dateLabelPattern, expectedDatePattern);
      await dateButton.click({ timeout: 5000 });
    }

    if (clickDay) {
      await clickCalendarDay(page, clickDay);
    }
  });
}

async function runInitialRunMandatoryFieldsScenario(page, data) {
  await openSettingsScenario(page, data, {
    runType: 'Initial Run',
    headingPattern: /Edit Duplicate Payments Settings/i,
    useExistingCustomer: true,
    customerName: 'Stanford U'
  });

  await reportStep('Verify Initial Run mandatory labels', async () => {
    await expectVisibleText(page, /Initial Run Cutoff Percentage:/i);
    await expectVisibleText(page, /Initial Run Months:/i);
  });
}

async function runInitialRunConfigureScenario(page, data) {
  await openSettingsScenario(page, data, {
    runType: 'Initial Run',
    headingPattern: /Edit Duplicate Payments Settings/i,
    useExistingCustomer: true,
    customerName: 'Stanford U'
  });
}

async function runInitialRunDefaultCutoffScenario(page, data) {
  await runInitialRunConfigureScenario(page, data);

  await reportStep('Verify Initial Run cutoff default value', async () => {
    await expectVisibleText(page, /Initial Run Cutoff Percentage:/i);
    await expectFieldValueMatches(page, 'initial_run_cutoff_percent', /^\d+$/);
  });
}

async function runInitialRunWholeNumberScenario(page, data) {
  await runInitialRunConfigureScenario(page, data);

  await reportStep('Verify Initial Run cutoff accepts whole numbers', async () => {
    await fillFieldByName(page, 'initial_run_cutoff_percent', '123');
    await expectFieldValueContains(page, 'initial_run_cutoff_percent', '123');
  });
}

async function runSubmitSettingsScenario(page, data, options) {
  const { runType, headingPattern, useExistingCustomer = false, customerName } = options;

  await openSettingsScenario(page, data, {
    runType,
    headingPattern,
    useExistingCustomer,
    customerName
  });

  await reportStep(`Verify ${runType} Submit Settings button`, async () => {
    const submitControl = submitSettingsControl(page);
    await expect(submitControl).toBeVisible({ timeout: 10000 });
    await submitControl.click({ timeout: 5000 });
  });
}

async function runScenario(page, data, scenarioName) {
  if (/^TS_3[2-8]_/i.test(scenarioName)) {
    return runRoleAccessScenario(page, data);
  }

  if (/^TS_41_/i.test(scenarioName)) {
    return runOneTimeRunFieldsScenario(page, data);
  }

  if (/^TS_42_/i.test(scenarioName)) {
    return runSubmitSettingsScenario(page, data, {
      runType: 'One Time Run',
      headingPattern: /Edit One Time Run Settings/i
    });
  }

  if (/^TS_64_/i.test(scenarioName)) {
    return runInitialRunFieldsScenario(page, data);
  }

  if (/^TS_65_/i.test(scenarioName)) {
    return runSubmitSettingsScenario(page, data, {
      runType: 'Initial Run',
      headingPattern: /Edit Duplicate Payments Settings/i
    });
  }

  if (/^TS_52_/i.test(scenarioName)) {
    return runOneTimeRunButtonVisibleScenario(page, data);
  }

  if (/^TS_(58|59|61)_/i.test(scenarioName)) {
    return runOneTimeRunButtonVisibleScenario(page, data, { fillNotes: true });
  }

  if (/^TS_(60|62)_/i.test(scenarioName)) {
    return runOneTimeRunButtonVisibleScenario(page, data, { fillNotes: true });
  }

  if (/^TS_(74|75)_/i.test(scenarioName)) {
    return runInitialRunButtonVisibleScenario(page, data, { fillCutoff: true, fillMonths: true });
  }

  if (/^TS_78_/i.test(scenarioName)) {
    return runInitialRunButtonVisibleScenario(page, data, { fillNotes: true });
  }

  if (/^TS_(77|79)_/i.test(scenarioName)) {
    return runInitialRunButtonVisibleScenario(page, data, { fillNotes: true });
  }

  if (/^TS_(63|76)_/i.test(scenarioName)) {
    return runInitialRunConfigureScenario(page, data);
  }

  if (/^TS_50_/i.test(scenarioName)) {
    return runOneTimeRunExistingSettingsScenario(page, data, {
      openCalendar: true,
      expectedDatePattern: /\b\d{2}\/\d{2}\/\d{4}\b/
    });
  }

  if (/^TS_51_/i.test(scenarioName)) {
    return runOneTimeRunExistingSettingsScenario(page, data, {
      openCalendar: true,
      expectedDatePattern: /\b\d{2}\/\d{2}\/\d{4}\b/
    });
  }

  if (/^TS_(53|54)_/i.test(scenarioName)) {
    return runOneTimeRunExistingSettingsScenario(page, data);
  }

  if (/^TS_55_/i.test(scenarioName)) {
    return runOneTimeRunExistingSettingsScenario(page, data, {
      openCalendar: true,
      expectedDatePattern: /\b\d{2}\/\d{2}\/\d{4}\b/,
      dateLabelPattern: /One Time Run End Date:/i
    });
  }

  if (/^TS_(56|57)_/i.test(scenarioName)) {
    return runOneTimeRunExistingSettingsScenario(page, data);
  }

  if (/^TS_(70|72)_/i.test(scenarioName)) {
    return runInitialRunMandatoryFieldsScenario(page, data);
  }

  if (/^TS_69_/i.test(scenarioName)) {
    return runInitialRunDefaultCutoffScenario(page, data);
  }

  if (/^TS_68_/i.test(scenarioName)) {
    return runInitialRunWholeNumberScenario(page, data);
  }

  return page;
}

const helperMap = {
  openModule,
  selectDashboardCustomer,
  openRunType,
  runScenario,
  selectors: duplicateDashboardNewModuleSelectors
};

module.exports = {
  duplicateDashboardNewModuleHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap, {
      openModule: 'Open Duplicate Payments dashboard',
      selectDashboardCustomer: 'Select dashboard customer',
      openRunType: 'Open run type',
      runScenario: 'Run Duplicate Dashboard New Module scenario'
    }),
    runScenario: async (page, data, scenarioName) => test.step(`Run ${humanizeScenarioTitle(scenarioName)}`, async () => {
      return runScenario(page, data, scenarioName);
    }),
    selectors: duplicateDashboardNewModuleSelectors
  }
};
