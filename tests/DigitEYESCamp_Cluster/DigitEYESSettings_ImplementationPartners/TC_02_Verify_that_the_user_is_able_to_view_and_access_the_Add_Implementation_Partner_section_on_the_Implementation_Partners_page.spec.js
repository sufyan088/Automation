const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsImplementationpartnersHelpers
} = require('./_shared');

test('TC_02_Verify_that_the_user_is_able_to_view_and_access_the_Add_Implementation_Partner_section_on_the_Implementation_Partners_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/ImplementationPartners/TC_02_Verify_that_the_user_is_able_to_view_and_access_the_Add_Implementation_Partner_section_on_the_Implementation_Partners_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Add Implementation Partner section is accessible', async () => {
    await digiteyessettingsImplementationpartnersHelpers.verifyAddSection(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});