const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_10_Verify_that_system_supports_selecting_identical_Start_Date_and_End_Date_values_for_single_day_camps', async ({ page }) => {
  const data = loadRuntimeData();
  const dateValue = '2026-03-10';

  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_10_Verify_that_system_supports_selecting_identical_Start_Date_and_End_Date_values_for_single_day_camps.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster and select identical Start and End dates', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.startDateField,
      dateValue,
      'Start Date'
    );
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.endDateField,
      dateValue,
      'End Date'
    );
  });

  await test.step('Verify Start and End dates are retained as identical values', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.startDateField,
      dateValue,
      'Start Date'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.endDateField,
      dateValue,
      'End Date'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
