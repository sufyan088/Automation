const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_53_To_Verify_that_user_can_select_valid_Date_From_and_Date_To_values", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_53_To_Verify_that_user_can_select_valid_Date_From_and_Date_To_values.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Open Search / Filter popup and set Date From and Date To values', async () => {
    await digiteyescampsManagecampsclusterHelpers.openSearchFilter(page);
    await digiteyescampsManagecampsclusterHelpers.fillSearchDateFrom(page, '2026-03-04');
    await digiteyescampsManagecampsclusterHelpers.expectSearchDateFromValue(page, '2026-03-04');
    await digiteyescampsManagecampsclusterHelpers.fillSearchDateTo(page, '2026-03-04');
    await digiteyescampsManagecampsclusterHelpers.expectSearchDateToValue(page, '2026-03-04');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
