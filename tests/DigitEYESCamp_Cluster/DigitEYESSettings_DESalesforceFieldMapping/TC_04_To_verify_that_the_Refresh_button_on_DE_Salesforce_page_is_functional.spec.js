const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsDesalesforcefieldmappingHelpers
} = require('./_shared');

test("TC_04_To_verify_that_the_Refresh_button_on_DE_Salesforce_page_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/DESalesforceFieldMapping/TC_04_To_verify_that_the_Refresh_button_on_DE_Salesforce_page_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyessettingsDesalesforcefieldmappingHelpers.verifyRefreshButton(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

