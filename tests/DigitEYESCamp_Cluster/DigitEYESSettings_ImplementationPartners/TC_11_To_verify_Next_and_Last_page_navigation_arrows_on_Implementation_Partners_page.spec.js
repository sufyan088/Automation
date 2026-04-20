const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsImplementationpartnersHelpers
} = require('./_shared');

test("TC_11_To_verify_Next_and_Last_page_navigation_arrows_on_Implementation_Partners_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/ImplementationPartners/TC_11_To_verify_Next_and_Last_page_navigation_arrows_on_Implementation_Partners_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyessettingsImplementationpartnersHelpers.verifyNextAndLastNavigation(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

