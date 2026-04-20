const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingCamptrendsHelpers
} = require('./_shared');

test("TC_02_To_verify_the_functionality_of_the_Search_Filter_button_on_the_Camps_Trends_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/CampTrends/TC_02_To_verify_the_functionality_of_the_Search_Filter_button_on_the_Camps_Trends_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingCamptrendsHelpers.openModule(page, data);
    await digiteyesreportingCamptrendsHelpers.verifySearchFilter(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
