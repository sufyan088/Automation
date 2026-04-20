const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsImplementationpartnersHelpers
} = require('./_shared');

test('TC_06_To_verify_that_the_Close_button_is_displayed_on_the_Implementation_Partner_Search_Filter_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/ImplementationPartners/TC_06_To_verify_that_the_Close_button_is_displayed_on_the_Implementation_Partner_Search_Filter_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Search Close button on Implementation Partners', async () => {
    await digiteyessettingsImplementationpartnersHelpers.verifySearchCloseButton(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});