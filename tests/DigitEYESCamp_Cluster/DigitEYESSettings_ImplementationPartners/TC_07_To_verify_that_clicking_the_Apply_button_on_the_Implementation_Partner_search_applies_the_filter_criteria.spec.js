const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsImplementationpartnersHelpers
} = require('./_shared');

test('TC_07_To_verify_that_clicking_the_Apply_button_on_the_Implementation_Partner_search_applies_the_filter_criteria', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/ImplementationPartners/TC_07_To_verify_that_clicking_the_Apply_button_on_the_Implementation_Partner_search_applies_the_filter_criteria.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Implementation Partners Apply search', async () => {
    await digiteyessettingsImplementationpartnersHelpers.verifyApplySearch(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});