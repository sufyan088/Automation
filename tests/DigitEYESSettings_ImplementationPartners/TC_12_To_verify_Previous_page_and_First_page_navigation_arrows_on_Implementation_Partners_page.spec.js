const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsImplementationpartnersHelpers
} = require('./_shared');

test('TC_12_To_verify_Previous_page_and_First_page_navigation_arrows_on_Implementation_Partners_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/ImplementationPartners/TC_12_To_verify_Previous_page_and_First_page_navigation_arrows_on_Implementation_Partners_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify previous and first pagination controls on Implementation Partners', async () => {
    await digiteyessettingsImplementationpartnersHelpers.verifyPreviousAndFirstNavigation(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});