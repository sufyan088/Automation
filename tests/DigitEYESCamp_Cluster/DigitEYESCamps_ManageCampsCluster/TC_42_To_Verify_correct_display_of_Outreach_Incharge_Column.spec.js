const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_42_To_Verify_correct_display_of_Outreach_Incharge_Column", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_42_To_Verify_correct_display_of_Outreach_Incharge_Column.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Verify Outreach Incharge column is displayed', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectListingHeaders(page, ['Outreach Incharge']);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
