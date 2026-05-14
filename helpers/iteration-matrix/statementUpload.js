const { expect, test } = require('@playwright/test');
const { safeClick, safeExpectVisible, safeFill, waitForAppToSettle } = require('../actions');
const { clickWithFallback, resolveFirst } = require('../fallback');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { statementUploadSelectors } = require('../../selectors/iteration-matrix/statementUpload.selectors.js');

const DEFAULT_CUSTOMER = 'Langham Logistics';
const DEFAULT_SUPPLIER_QUERY = 'MARION';

async function reportStep(name, action) {
  return test.step(name, action);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildWorkbookPayload(rows) {
  return Buffer.from(rows.map((row) => row.join(',')).join('\n'), 'utf8');
}

function buildStandardUploadPayload() {
  return {
    name: 'Normal_File_for_Reconcile.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: buildWorkbookPayload([
      ['invoiceNumber', 'invoiceAmount', 'invoiceDate', 'poNumber'],
      ['INV-1001', '100.15', '03/13/2014', 'PO-2001'],
      ['INV-1002', '82.55', '03/14/2014', 'PO-2002']
    ])
  };
}

function buildPoUploadPayload() {
  return {
    name: 'PoNumber-ST-File_1.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: buildWorkbookPayload([
      ['invoiceNumber', 'invoiceAmount', 'invoiceDate', 'poNumber'],
      ['PO-INV-01', '250.00', '03/13/2014', 'PO-7788'],
      ['PO-INV-02', '410.35', '03/14/2014', 'PO-8899']
    ])
  };
}

function getCustomerName(data) {
  return data?.statementUploadCustomer || data?.statementSearchCustomer || DEFAULT_CUSTOMER;
}

function getMappingName(data) {
  const seed = data?.SR_Mapping_Name || 'SR_Mapping_Name';
  return `${seed}-${Date.now()}`;
}

async function openModule(page) {
  const headingVisible = await resolveFirst(page, statementUploadSelectors.moduleHeading, {
    mustBeVisible: true,
    timeoutPerCandidate: 1000
  }).then(() => true).catch(() => false);

  if (!headingVisible) {
    await safeClick(page, statementUploadSelectors.moduleNavLink, 'Statement Recon navigation link', {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
    await waitForAppToSettle(page, 2000);
  }

  await safeExpectVisible(page, statementUploadSelectors.moduleHeading, 'Statement Recon heading', {
    timeoutPerCandidate: 5000,
    expectTimeout: 15000
  });
  return page;
}

async function selectCustomer(page, customerName = DEFAULT_CUSTOMER) {
  await safeClick(page, statementUploadSelectors.customerTrigger, 'Select Customer trigger', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await safeFill(page, statementUploadSelectors.customerSearchInput, customerName, 'Customer search', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await waitForAppToSettle(page, 1500);

  const optionPattern = new RegExp(`^${escapeRegex(customerName)}$`, 'i');
  const optionCandidates = [
    page.getByRole('option', { name: optionPattern }).first(),
    page.locator('[role="option"]').filter({ hasText: optionPattern }).first(),
    page.getByText(optionPattern).last()
  ];

  let optionLocator = null;
  for (const candidate of optionCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      optionLocator = candidate;
      break;
    }
  }

  if (!optionLocator) {
    const searchInput = page.getByPlaceholder('Search customers (min. 3 characters)...').first();
    await searchInput.press('ArrowDown').catch(() => {});
    await searchInput.press('Enter').catch(() => {});
  } else {
    await optionLocator.click({ timeout: 5000 });
  }

  await waitForAppToSettle(page, 1500);
  await expect(page.getByText(optionPattern).last()).toBeVisible({ timeout: 10000 });
  await page.keyboard.press('Escape').catch(() => {});
  await waitForAppToSettle(page, 500);
}

async function searchSupplier(page, supplierQuery = DEFAULT_SUPPLIER_QUERY) {
  await safeClick(page, statementUploadSelectors.supplierTrigger, 'Supplier trigger', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await safeFill(page, statementUploadSelectors.supplierSearchInput, supplierQuery, 'Supplier search', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await waitForAppToSettle(page, 1000);

  const optionPattern = new RegExp(supplierQuery, 'i');
  const supplierOption = page.locator('[role="option"], [id="suppliers-listbox"] div').filter({ hasText: optionPattern }).first();
  await expect(supplierOption).toBeVisible({ timeout: 10000 });
  await supplierOption.click({ timeout: 5000 });
  await waitForAppToSettle(page, 1000);
}

async function uploadStatementFile(page, payload) {
  await safeExpectVisible(page, statementUploadSelectors.dropzone, 'Statement upload dropzone', {
    timeoutPerCandidate: 5000,
    expectTimeout: 15000
  });
  const { locator } = await resolveFirst(page, statementUploadSelectors.fileInput, {
    mustBeVisible: false,
    timeoutPerCandidate: 5000
  });
  await locator.setInputFiles(payload);
  await waitForAppToSettle(page, 3000);
}

async function expectMappingFormVisible(page) {
  await safeExpectVisible(page, statementUploadSelectors.mappingHeading, 'Statement Mapping', {
    timeoutPerCandidate: 5000,
    expectTimeout: 20000
  });
}

async function openCreateSupplierGroupModal(page) {
  await safeClick(page, statementUploadSelectors.plusButton, 'Plus icon button', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await expect(page.getByRole('heading', { name: /create new supplier group/i }).first()).toBeVisible({ timeout: 10000 });
}

async function createSupplierGroup(page, groupName) {
  await openCreateSupplierGroupModal(page);
  await page.getByPlaceholder('Enter supplier group name...').first().fill(groupName);
  await page.getByRole('button', { name: /add supplier grouping/i }).first().click({ timeout: 5000 });
  await expect(page.getByText(/supplier grouping created successfully/i).first()).toBeVisible({ timeout: 10000 });
}

async function expectMappingRowVisible(page, rowLabel) {
  const rowCell = page.locator('td').filter({ hasText: new RegExp(`^${escapeRegex(rowLabel)}$`, 'i') }).first();
  await expect(rowCell).toBeVisible({ timeout: 10000 });
}

async function openRowVendorField(page, rowLabel) {
  const rowCell = page.locator('td').filter({ hasText: new RegExp(`^${escapeRegex(rowLabel)}$`, 'i') }).first();
  await expect(rowCell).toBeVisible({ timeout: 10000 });

  const row = rowCell.locator('xpath=ancestor::tr[1]');
  await expect(row).toBeVisible({ timeout: 10000 });

  const triggerCandidates = [
    row.getByRole('combobox').first(),
    row.getByRole('button', { name: /select vendor field/i }).first(),
    row.getByText(/select vendor field/i).first()
  ];

  for (const candidate of triggerCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.click({ timeout: 5000 });
      await waitForAppToSettle(page, 500);
      return;
    }
  }

  throw new Error(`Unable to open vendor field selector for row: ${rowLabel}`);
}

async function selectVendorField(page, rowLabel, fieldName) {
  await openRowVendorField(page, rowLabel);
  const option = page.getByText(new RegExp(`^${escapeRegex(fieldName)}$`, 'i')).last();
  await expect(option).toBeVisible({ timeout: 10000 });
  await option.click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
}

async function configureMapping(page, mappingName) {
  await safeFill(page, statementUploadSelectors.mappingNameInput, mappingName, 'Mapping name', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await safeClick(page, statementUploadSelectors.dateFormatTrigger, 'Date format trigger', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  await page.getByText(/^MM\/dd\/yyyy$/i).first().click({ timeout: 5000 });
  await waitForAppToSettle(page, 500);
  await selectVendorField(page, 'invoiceNumber', 'invoiceNumber');
  await selectVendorField(page, 'invoiceAmount', 'invoiceAmount');
  await selectVendorField(page, 'invoiceDate', 'invoiceDate');
  await selectVendorField(page, 'poNumber', 'poNumber');
}

async function expectMappingSaved(page) {
  const successMessage = page.getByText(/mapping created successfully|you have successfully created mapping/i).first();
  const reconciliationHeading = page.getByRole('heading', { name: /statement reconciliation/i }).first();
  const reconcileButton = page.getByRole('button', { name: /reconcile statement/i }).first();

  if (await successMessage.isVisible().catch(() => false)) {
    return;
  }

  if (await reconciliationHeading.isVisible().catch(() => false)) {
    return;
  }

  if (await reconcileButton.isVisible().catch(() => false)) {
    return;
  }

  try {
    await successMessage.waitFor({ state: 'visible', timeout: 5000 });
    return;
  } catch (_) {}

  try {
    await reconciliationHeading.waitFor({ state: 'visible', timeout: 10000 });
    return;
  } catch (_) {}

  await expect(reconcileButton).toBeVisible({ timeout: 10000 });
}

async function saveMapping(page) {
  await page.getByRole('button', { name: /save mapping/i }).first().click({ timeout: 5000 });
  await waitForAppToSettle(page, 1000);
  await expectMappingSaved(page);
}

async function selectMapping(page, mappingName) {
  await safeClick(page, statementUploadSelectors.selectMappingTrigger, 'Select Mapping trigger', {
    mustBeVisible: true,
    timeoutPerCandidate: 5000
  });
  const searchInput = page.getByPlaceholder('Search mapping...').first();
  if (await searchInput.isVisible().catch(() => false)) {
    await searchInput.fill(mappingName);
    await waitForAppToSettle(page, 1000);
  }

  const mappingOption = page.getByText(new RegExp(escapeRegex(mappingName), 'i')).last();
  await expect(mappingOption).toBeVisible({ timeout: 10000 });
  await mappingOption.click({ timeout: 5000 });
  await waitForAppToSettle(page, 1000);
}

async function prepareSupplierWorkspace(page, data) {
  await openModule(page);
  await selectCustomer(page, getCustomerName(data));
  await searchSupplier(page, DEFAULT_SUPPLIER_QUERY);
}

async function prepareMappingWorkspace(page, data, payload) {
  await prepareSupplierWorkspace(page, data);
  await uploadStatementFile(page, payload);
  await expectMappingFormVisible(page);
}

async function runTs01(page) {
  await reportStep('Open the Statement Recon module', async () => {
    await openModule(page);
  });
  await reportStep('Verify the Recon Configuration module is displayed', async () => {
    await safeExpectVisible(page, statementUploadSelectors.moduleHeading, 'Statement Recon heading', {
      timeoutPerCandidate: 5000,
      expectTimeout: 15000
    });
  });
}

async function runTs02(page, data) {
  const customerName = getCustomerName(data);
  await reportStep('Open Statement Recon and select a customer', async () => {
    await openModule(page);
    await selectCustomer(page, customerName);
  });
  await reportStep('Verify the selected customer is shown', async () => {
    await expect(page.getByText(new RegExp(escapeRegex(customerName), 'i')).last()).toBeVisible({ timeout: 10000 });
  });
}

async function runTs03(page, data) {
  await reportStep('Open Statement Recon and search for a supplier', async () => {
    await prepareSupplierWorkspace(page, data);
  });
  await reportStep('Verify the supplier search applied the requested supplier', async () => {
    await expect(page.getByText(/marion/i).last()).toBeVisible({ timeout: 10000 });
  });
}

async function runTs04(page, data) {
  await reportStep('Upload a statement file for the selected supplier', async () => {
    await prepareMappingWorkspace(page, data, buildStandardUploadPayload());
  });
  await reportStep('Verify the statement file upload opens the mapping form', async () => {
    await expectMappingFormVisible(page);
  });
}

async function runTs05(page, data) {
  await reportStep('Open the supplier grouping flow from Recon Configuration', async () => {
    await prepareSupplierWorkspace(page, data);
    await openCreateSupplierGroupModal(page);
  });
  await reportStep('Verify the Create New Supplier Group modal is displayed', async () => {
    await expect(page.getByRole('heading', { name: /create new supplier group/i }).first()).toBeVisible({ timeout: 10000 });
  });
}

async function runTs06(page, data) {
  await reportStep('Create a new supplier grouping from Recon Configuration', async () => {
    await prepareSupplierWorkspace(page, data);
    await createSupplierGroup(page, `group-${Date.now()}`);
  });
  await reportStep('Verify the supplier grouping was created successfully', async () => {
    await expect(page.getByText(/supplier grouping created successfully/i).first()).toBeVisible({ timeout: 10000 });
  });
}

async function runTs07(page, data) {
  await reportStep('Upload a statement file that exposes mapping rows', async () => {
    await prepareMappingWorkspace(page, data, buildPoUploadPayload());
  });
  await reportStep('Verify the key Statement Mapping Form rows are displayed', async () => {
    await expectMappingRowVisible(page, 'invoiceNumber');
    await expectMappingRowVisible(page, 'invoiceAmount');
    await expectMappingRowVisible(page, 'invoiceDate');
    await expectMappingRowVisible(page, 'poNumber');
  });
}

async function runTs08(page, data) {
  const mappingName = getMappingName(data);
  await reportStep('Configure and save a new statement mapping', async () => {
    await prepareMappingWorkspace(page, data, buildStandardUploadPayload());
    await configureMapping(page, mappingName);
    await saveMapping(page);
  });
  await reportStep('Verify the Save Mapping action succeeds', async () => {
    await expectMappingSaved(page);
  });
}

async function runTs09(page, data) {
  await reportStep('Open the uploaded statement mapping form', async () => {
    await prepareMappingWorkspace(page, data, buildStandardUploadPayload());
  });
  await reportStep('Verify the Use Existing Mapping action is available', async () => {
    await safeExpectVisible(page, statementUploadSelectors.useExistingMappingButton, 'Use Existing Mapping button', {
      timeoutPerCandidate: 5000,
      expectTimeout: 10000
    });
    await clickWithFallback(page, statementUploadSelectors.useExistingMappingButton, {
      mustBeVisible: true,
      timeoutPerCandidate: 5000
    });
  });
}

async function runTs10(page, data) {
  const mappingName = getMappingName(data);
  await reportStep('Create a mapping for the uploaded statement', async () => {
    await prepareMappingWorkspace(page, data, buildStandardUploadPayload());
    await configureMapping(page, mappingName);
    await saveMapping(page);
  });
  await reportStep('Select the saved mapping and verify Reconcile Statement is available', async () => {
    await selectMapping(page, mappingName);
    await expect(page.getByRole('button', { name: /reconcile statement/i }).first()).toBeVisible({ timeout: 15000 });
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
  TS_10: runTs10
};

async function runScenario(page, data, testTitle) {
  const scenarioKey = Object.keys(scenarioMap).find((key) => testTitle.includes(key));
  if (!scenarioKey) {
    throw new Error(`Unsupported scenario for Statement Upload: ${testTitle}`);
  }

  return scenarioMap[scenarioKey](page, data);
}

const helperMap = {
  openModule,
  selectCustomer,
  searchSupplier,
  uploadStatementFile,
  expectMappingFormVisible,
  openCreateSupplierGroupModal,
  createSupplierGroup,
  configureMapping,
  saveMapping,
  selectMapping
};

module.exports = {
  statementUploadHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario,
    selectors: statementUploadSelectors
  }
};
