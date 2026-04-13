const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsImplementationpartnersHelpers
} = require('./_shared');

test('TC_05_To_verify_that_the_user_can_select_Yes_from_the_Active_dropdown_in_the_Implementation_Partner_Search_Filter', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/ImplementationPartners/TC_05_To_verify_that_the_user_can_select _Yes_from_the_Active_dropdown_in_the_Implementation_Partner_Search_Filter.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Yes is selectable in Active search field', async () => {
    await digiteyessettingsImplementationpartnersHelpers.verifySearchStatusOption(page, data, 'Yes');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});