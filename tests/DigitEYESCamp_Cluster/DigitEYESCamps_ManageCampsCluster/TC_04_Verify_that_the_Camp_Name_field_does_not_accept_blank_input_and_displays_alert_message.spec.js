const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_04_Verify_that_the_Camp_Name_field_does_not_accept_blank_input_and_displays_alert_message", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_04_Verify_that_the_Camp_Name_field_does_not_accept_blank_input_and_displays_alert_message.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
  });

  await test.step('Leave Camp Name blank and attempt to save', async () => {
    await digiteyescampsManagecampsclusterHelpers.fillCreateCampClusterForm(page, data, {
      includeCampName: false
    });
    await digiteyescampsManagecampsclusterHelpers.clickSave(page);
    await digiteyescampsManagecampsclusterHelpers.expectFieldValidationFailure(
      page,
      digiteyescampsManagecampsclusterSelectors.campNameField,
      'Camp Name'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
