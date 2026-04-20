const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_03_To_Verify_that_Camp_Name_field_accepts_valid_alphanumeric_characters_and_special_characters_as_per_business_rules', async ({ page }) => {
  const data = loadRuntimeData();
  const value = 'Camp 01 - QA / @Mammoth';

  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_03_To_Verify_that_Camp_Name_field_accepts_valid_alphanumeric_characters_and_special_characters_as_per_business_rules.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster and enter Camp Name with allowed characters', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.campNameField,
      value,
      'Camp Name'
    );
  });

  await test.step('Verify Camp Name value is retained', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.campNameField,
      value,
      'Camp Name'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
