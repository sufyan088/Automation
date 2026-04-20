const { expect } = require('@playwright/test');
const { safeClick, safeClickIfFound, safeFill, safeExpectVisible, waitForAppToSettle } = require('./actions');
const { resolveFirst } = require('./fallback');
const { digiteyescampsManagecampsclusterHelpers } = require('./digiteyescampsManagecampscluster');
const { wrapHelperMapWithReadableSteps } = require('./clientReadableSteps');

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

async function openSettingsMenu(page, data, selectors) {
  const countryModalVisible = await page.locator('#divLoginCountry').isVisible().catch(() => false);
  const menuAlreadyAvailable = await resolveFirst(page, selectors.settingsMenuButton, {
    timeoutPerCandidate: 1000
  }).catch(() => null);

  if (countryModalVisible || !menuAlreadyAvailable) {
    await digiteyescampsManagecampsclusterHelpers.selectLoginCountry(page, data.visionSpringCountry);
  }

  await safeClick(page, selectors.settingsMenuButton, 'DigitEYES Settings menu');
  await waitForAppToSettle(page, 500);
}

async function openSettingsModule(page, data, selectors, moduleName) {
  await openSettingsMenu(page, data, selectors);
  await safeClick(page, selectors.moduleLink, moduleName, { noWaitAfter: true });
  await waitForAppToSettle(page, 1000);

  if (selectors.pageMarker) {
    await safeExpectVisible(page, selectors.pageMarker, `${moduleName} page marker`);
  }
}

async function expectHeaderVisible(page, selectors, label) {
  await safeExpectVisible(page, selectors.pageMarker, label);
}

async function setPageSize(page, selectors, labelOrValue) {
  const { locator } = await resolveFirst(page, selectors.pageSizeSelect);
  const target = String(labelOrValue);

  await locator.selectOption({ label: `Show: ${target}` }).catch(async () => {
    await locator.selectOption({ value: target }).catch(async () => {
      await locator.selectOption({ label: target });
    });
  });

  await waitForAppToSettle(page, 600);
}

async function expectPageSizeOptions(page, selectors, expectedLabels) {
  const { locator } = await resolveFirst(page, selectors.pageSizeSelect);
  const actual = (await locator.locator('option').allTextContents()).map(normalizeText);

  for (const label of expectedLabels) {
    expect(actual).toContain(normalizeText(label));
  }
}

async function clickPagination(page, selectors, controlName) {
  const controls = selectors.pagination || {};
  const candidates = controls[controlName];

  if (!candidates) {
    throw new Error(`Missing pagination selector for ${controlName}`);
  }

  await safeClick(page, candidates, `Pagination ${controlName}`);
  await waitForAppToSettle(page, 800);
}

async function expectPaginationSummary(page, selectors) {
  const { locator } = await resolveFirst(page, selectors.paginationSummary);
  await expect(locator).toContainText(/showing\s*:\s*\d+\s*-\s*\d+\s*of\s*\d+/i, { timeout: 10000 });
}

async function openSearchFilter(page, selectors) {
  await safeClick(page, selectors.searchFilterButton, 'Search / Filter');
  await waitForAppToSettle(page, 600);
}

async function fillSearchField(page, candidates, value, label) {
  await safeFill(page, candidates, value, label);
  const { locator } = await resolveFirst(page, candidates);
  await expect(locator).toHaveValue(String(value), { timeout: 10000 });
}

async function selectDropdownValue(page, candidates, labelOrValue, label) {
  const { locator } = await resolveFirst(page, candidates);
  const target = String(labelOrValue);

  await locator.selectOption({ label: target }).catch(async () => {
    await locator.selectOption({ value: target }).catch(async () => {
      await locator.selectOption({ index: 1 });
    });
  });

  await waitForAppToSettle(page, 300);
  console.log(`[SELECT] ${label} -> ${target}`);
}

async function getSelectedOptionText(page, candidates) {
  const { locator } = await resolveFirst(page, candidates);
  return locator.evaluate((element) => {
    const selectedOption = element.options[element.selectedIndex];
    return selectedOption ? selectedOption.textContent.trim() : '';
  });
}

async function clickApplySearch(page, selectors) {
  await safeClick(page, selectors.applyButton, 'Apply Search');
  await waitForAppToSettle(page, 800);
}

async function clickCloseSearch(page, selectors) {
  await safeClick(page, selectors.closeButton, 'Close Search');
  await waitForAppToSettle(page, 800);
}

async function openFirstRowEdit(page, selectors) {
  await safeClick(page, selectors.editIcon, 'First row edit');
  await waitForAppToSettle(page, 600);
}

async function openFirstRowConfigure(page, selectors) {
  await safeClick(page, selectors.configureIcon, 'First row configure');
  await waitForAppToSettle(page, 600);
}

async function openAddForm(page, selectors) {
  await safeClick(page, selectors.addButton, 'Add New');
  await waitForAppToSettle(page, 600);
}

async function closeForm(page, selectors) {
  const closeClicked = await safeClickIfFound(page, selectors.formCloseButton, 'Close form', { actionTimeout: 4000 });

  if (!closeClicked.clicked && selectors.topCloseButton) {
    await safeClickIfFound(page, selectors.topCloseButton, 'Top close icon', { actionTimeout: 4000 });
  }

  await waitForAppToSettle(page, 500);
}

async function setCheckbox(page, candidates, checked, label) {
  const { locator } = await resolveFirst(page, candidates);
  if (checked) {
    await locator.check();
  } else {
    await locator.uncheck();
  }
  console.log(`[CHECKBOX] ${label} -> ${checked}`);
}

async function clickSave(page, selectors) {
  await safeClick(page, selectors.saveButton, 'Save');
  await waitForAppToSettle(page, 800);
}

async function clickRefresh(page, selectors) {
  await safeClick(page, selectors.refreshButton, 'Refresh');
  await waitForAppToSettle(page, 800);
}

async function clickSyncAndAssertToast(page, selectors) {
  await safeClick(page, selectors.syncButton, 'Sync From SF');
  await waitForAppToSettle(page, 500);
  await safeExpectVisible(page, selectors.processingToast, 'Processing toast');
}

async function expectHeaderCountAtLeast(page, selectors, count) {
  const cssCandidate = (selectors.tableHeaders || []).find((candidate) => candidate.type === 'css')?.value;
  if (!cssCandidate) {
    throw new Error('Missing css selector for tableHeaders');
  }

  const headerLocator = page.locator(cssCandidate);
  await headerLocator.first().waitFor({ state: 'visible', timeout: 10000 });
  const headerCount = await headerLocator.count();
  expect(headerCount).toBeGreaterThanOrEqual(count);
}

async function expectTableHeaders(page, selectors, expectedHeaders) {
  const cssCandidate = (selectors.tableHeaders || []).find((candidate) => candidate.type === 'css')?.value;
  if (!cssCandidate) {
    throw new Error('Missing css selector for tableHeaders');
  }

  const headerLocator = page.locator(cssCandidate);
  await headerLocator.first().waitFor({ state: 'visible', timeout: 10000 });
  const actualHeaders = (await headerLocator.allTextContents())
    .map((value) => normalizeText(value))
    .filter(Boolean);

  for (const expectedHeader of expectedHeaders) {
    expect(actualHeaders).toContain(normalizeText(expectedHeader));
  }
}

async function clickFirstSortableHeader(page, selectors) {
  await safeClick(page, selectors.firstSortableHeader, 'First sortable header');
  await waitForAppToSettle(page, 600);
}

async function clickResultRow(page, selectors, label = 'Result row') {
  await safeClick(page, selectors.resultRow, label);
  await waitForAppToSettle(page, 600);
}

async function fillHospitalForm(page, selectors, data) {
  await fillSearchField(page, selectors.hospitalNameField, data.name, 'Hospital Name');
  await fillSearchField(page, selectors.addressField, data.address, 'Address');
  await fillSearchField(page, selectors.cityField, data.city, 'City');
  await fillSearchField(page, selectors.countryField, data.country, 'Country');
  await fillSearchField(page, selectors.stateField, data.state, 'State');
  await fillSearchField(page, selectors.sfidField, data.sfid, 'Salesforce ID');
}

module.exports = wrapHelperMapWithReadableSteps({
  openSettingsMenu,
  openSettingsModule,
  expectHeaderVisible,
  setPageSize,
  expectPageSizeOptions,
  clickPagination,
  expectPaginationSummary,
  openSearchFilter,
  fillSearchField,
  selectDropdownValue,
  getSelectedOptionText,
  clickApplySearch,
  clickCloseSearch,
  openFirstRowEdit,
  openFirstRowConfigure,
  openAddForm,
  closeForm,
  setCheckbox,
  clickSave,
  clickRefresh,
  clickSyncAndAssertToast,
  expectHeaderCountAtLeast,
  expectTableHeaders,
  clickFirstSortableHeader,
  clickResultRow,
  fillHospitalForm
});