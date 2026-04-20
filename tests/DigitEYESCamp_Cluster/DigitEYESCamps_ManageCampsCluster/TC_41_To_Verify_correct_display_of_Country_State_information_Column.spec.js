const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_41_To_Verify_correct_display_of_Country_State_information_Column", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_41_To_Verify_correct_display_of_Country_State_information_Column.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Verify Country: State column is displayed', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectListingHeaders(page, ['Country: State']);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
