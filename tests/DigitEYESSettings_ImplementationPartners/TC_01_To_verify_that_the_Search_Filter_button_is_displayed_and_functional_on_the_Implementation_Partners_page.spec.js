const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsImplementationpartnersHelpers
} = require('./_shared');

test('TC_01_To_verify_that_the_Search_Filter_button_is_displayed_and_functional_on_the_Implementation_Partners_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/ImplementationPartners/TC_01_To_verify_that_the_Search_Filter_button_is_displayed_and_functional_on_the_Implementation_Partners_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Implementation Partners search filter button', async () => {
    await digiteyessettingsImplementationpartnersHelpers.verifySearchFilterButton(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});