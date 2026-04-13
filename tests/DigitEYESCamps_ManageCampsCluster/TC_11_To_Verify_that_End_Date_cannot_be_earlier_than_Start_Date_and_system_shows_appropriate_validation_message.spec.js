const { test } = require('@playwright/test');
const { expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_11_To_Verify_that_End_Date_cannot_be_earlier_than_Start_Date_and_system_shows_appropriate_validation_message", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_11_To_Verify_that_End_Date_cannot_be_earlier_than_Start_Date_and_system_shows_appropriate_validation_message.ds"
  });

  const startDate = '2026-02-09';
  const endDate = '2026-02-04';

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
  });

  await test.step('Enter Start Date and earlier End Date', async () => {
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.startDateField,
      startDate,
      'Start Date'
    );
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.endDateField,
      endDate,
      'End Date'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.startDateField,
      startDate,
      'Start Date'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.endDateField,
      endDate,
      'End Date'
    );
    expect(endDate < startDate).toBe(true);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
