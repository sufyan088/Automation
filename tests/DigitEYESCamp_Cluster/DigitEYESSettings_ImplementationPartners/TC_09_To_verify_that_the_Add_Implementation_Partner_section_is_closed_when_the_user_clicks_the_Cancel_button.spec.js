const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsImplementationpartnersHelpers
} = require('./_shared');

test('TC_09_To_verify_that_the_Add_Implementation_Partner_section_is_closed_when_the_user_clicks_the_Cancel_button', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/ImplementationPartners/TC_09_To_verify_that_the_Add_Implementation_Partner_section_is_closed_when_the_user_clicks_the_Cancel_button.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Add Implementation Partner cancel behavior', async () => {
    await digiteyessettingsImplementationpartnersHelpers.verifyAddCancel(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});