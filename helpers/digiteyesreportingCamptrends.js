const {
  openReportingMenu,
  openReportingModule,
  openSearchFilter,
  applySearch,
  resetSearch,
  expectDropdownOptions,
  fillFieldAndExpectValue
} = require('./digiteyesreportingCommon');
const { expect } = require('@playwright/test');
const { waitForAppToSettle } = require('./actions');
const { resolveFirst } = require('./fallback');
const { digiteyesreportingCamptrendsSelectors } = require('../selectors/digiteyesreportingCamptrends.selectors');
const { wrapHelperMapWithReadableSteps } = require('./clientReadableSteps');

async function getSelectedOptionText(page, fieldSelectors) {
  const { locator } = await resolveFirst(page, fieldSelectors);
  return locator.locator('option:checked').textContent();
}

async function selectDropdownOption(page, fieldSelectors, optionLabel, label) {
  const { locator } = await resolveFirst(page, fieldSelectors);
  await locator.selectOption({ label: optionLabel });
  await expect(locator.locator('option:checked')).toHaveText(optionLabel, { timeout: 10000 });
  console.log(`[SELECT] ${label} -> ${optionLabel}`);
}

async function captureChartSnapshot(page) {
  const { locator } = await resolveFirst(page, digiteyesreportingCamptrendsSelectors.chartCanvas);
  return locator.evaluate((canvas) => canvas.toDataURL());
}

async function clickChartAtRatio(page, xRatio, yRatio = 0.02) {
  const { locator } = await resolveFirst(page, digiteyesreportingCamptrendsSelectors.chartCanvas);
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('Camp Trends chart canvas is not available for interaction.');
  }

  await page.mouse.click(box.x + (box.width * xRatio), box.y + (box.height * yRatio));
  await waitForAppToSettle(page, 1000);
}

async function verifyMenu(page, data) {
  await openReportingMenu(page, data, digiteyesreportingCamptrendsSelectors);
}

async function openModule(page, data) {
  await openReportingModule(page, data, digiteyesreportingCamptrendsSelectors, 'Camp Trends');
}

async function verifySearchFilter(page) {
  await openSearchFilter(page, digiteyesreportingCamptrendsSelectors);
}

async function verifyCountryDropdown(page, expectedCountry = 'India') {
  await openSearchFilter(page, digiteyesreportingCamptrendsSelectors);
  const selectedCountry = await getSelectedOptionText(page, digiteyesreportingCamptrendsSelectors.countryField);
  expect(String(selectedCountry || '')).toContain(expectedCountry);
}

async function verifyThemeDropdown(page) {
  await openSearchFilter(page, digiteyesreportingCamptrendsSelectors);
  await expectDropdownOptions(
    page,
    digiteyesreportingCamptrendsSelectors.themeField,
    ['S2E', 'S2L', 'S2S', 'Other than S2E, S2L, S2S'],
    'Camp Trends theme dropdown'
  );
}

async function verifyPayerDropdown(page) {
  await openSearchFilter(page, digiteyesreportingCamptrendsSelectors);
  await expectDropdownOptions(page, digiteyesreportingCamptrendsSelectors.payerField, ['Ajmer Sharif'], 'Camp Trends payer dropdown');
}

async function verifyThemeSelection(page, theme) {
  await openSearchFilter(page, digiteyesreportingCamptrendsSelectors);
  await verifyCountryDropdown(page);
  await selectDropdownOption(page, digiteyesreportingCamptrendsSelectors.themeField, theme, 'Camp Trends theme');
}

async function verifyReset(page, values = {}) {
  await openSearchFilter(page, digiteyesreportingCamptrendsSelectors);
  await selectDropdownOption(page, digiteyesreportingCamptrendsSelectors.themeField, values.theme || 'S2L', 'Camp Trends theme');
  await selectDropdownOption(page, digiteyesreportingCamptrendsSelectors.payerField, values.payer || 'Ajmer Sharif', 'Camp Trends payer');
  await fillFieldAndExpectValue(page, digiteyesreportingCamptrendsSelectors.dateFromField, values.dateFrom || '2026-03', 'Camp Trends Date From');
  await fillFieldAndExpectValue(page, digiteyesreportingCamptrendsSelectors.dateToField, values.dateTo || '2026-04', 'Camp Trends Date To');
  await resetSearch(page, digiteyesreportingCamptrendsSelectors);

  expect(String(await getSelectedOptionText(page, digiteyesreportingCamptrendsSelectors.countryField) || '')).toContain('India');
  await expect((await resolveFirst(page, digiteyesreportingCamptrendsSelectors.themeField)).locator.locator('option:checked')).toHaveText(/all themes/i, { timeout: 10000 });
  await expect((await resolveFirst(page, digiteyesreportingCamptrendsSelectors.payerField)).locator.locator('option:checked')).toHaveText(/select payer/i, { timeout: 10000 });
  await expect((await resolveFirst(page, digiteyesreportingCamptrendsSelectors.dateFromField)).locator).toHaveValue('', { timeout: 10000 });
  await expect((await resolveFirst(page, digiteyesreportingCamptrendsSelectors.dateToField)).locator).toHaveValue('', { timeout: 10000 });
}

async function verifyApply(page, payer = 'Ajmer Sharif') {
  const beforeChart = await captureChartSnapshot(page);
  await openSearchFilter(page, digiteyesreportingCamptrendsSelectors);
  await selectDropdownOption(page, digiteyesreportingCamptrendsSelectors.payerField, payer, 'Camp Trends payer');
  await applySearch(page, digiteyesreportingCamptrendsSelectors);

  const afterChart = await captureChartSnapshot(page);
  expect(afterChart).not.toBe(beforeChart);

  await openSearchFilter(page, digiteyesreportingCamptrendsSelectors);
  await expect((await resolveFirst(page, digiteyesreportingCamptrendsSelectors.payerField)).locator.locator('option:checked')).toHaveText(payer, { timeout: 10000 });
}

async function verifyDateFrom(page, value) {
  await openSearchFilter(page, digiteyesreportingCamptrendsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingCamptrendsSelectors.dateFromField, value, 'Camp Trends Date From');
}

async function verifyDateTo(page, value) {
  await openSearchFilter(page, digiteyesreportingCamptrendsSelectors);
  await fillFieldAndExpectValue(page, digiteyesreportingCamptrendsSelectors.dateToField, value, 'Camp Trends Date To');
}

async function verifyRegistrationChartToggle(page) {
  const beforeChart = await captureChartSnapshot(page);
  await clickChartAtRatio(page, 0.55);
  const afterChart = await captureChartSnapshot(page);
  expect(afterChart).not.toBe(beforeChart);
}

async function verifyClosedCampsChartToggle(page) {
  const beforeChart = await captureChartSnapshot(page);
  await clickChartAtRatio(page, 0.41);
  const afterChart = await captureChartSnapshot(page);
  expect(afterChart).not.toBe(beforeChart);
}

module.exports = {
  digiteyesreportingCamptrendsHelpers: wrapHelperMapWithReadableSteps({
    verifyMenu,
    openModule,
    verifySearchFilter,
    verifyCountryDropdown,
    verifyThemeDropdown,
    verifyThemeSelection,
    verifyPayerDropdown,
    verifyReset,
    verifyApply,
    verifyDateFrom,
    verifyDateTo,
    verifyRegistrationChartToggle,
    verifyClosedCampsChartToggle,
    selectors: digiteyesreportingCamptrendsSelectors
  })
};
