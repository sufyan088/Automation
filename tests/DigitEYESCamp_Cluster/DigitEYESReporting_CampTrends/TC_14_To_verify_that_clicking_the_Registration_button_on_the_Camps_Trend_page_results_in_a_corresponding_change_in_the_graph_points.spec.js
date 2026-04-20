const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingCamptrendsHelpers
} = require('./_shared');

test("TC_14_To_verify_that_clicking_the_Registration_button_on_the_Camps_Trend_page_results_in_a_corresponding_change_in_the_graph_points", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/CampTrends/TC_14_To_verify_that_clicking_the_Registration_button_on_the_Camps_Trend_page_results_in_a_corresponding_change_in_the_graph_points.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingCamptrendsHelpers.openModule(page, data);
    await digiteyesreportingCamptrendsHelpers.verifyRegistrationChartToggle(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});