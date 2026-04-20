const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_39_Verify_that_each_camp_cluster_record_displays_unique_reference_number", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_39_Verify_that_each_camp_cluster_record_displays_unique_reference_number.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Verify each record shows a unique reference number', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectUniqueReferenceNumbers(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
