const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_13_Verify_IP_Name_and_IP_Team_fields_are_disabled_when_Camp_Conducted_By_is_set_to_VS_Team", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_13_Verify_IP_Name_and_IP_Team_fields_are_disabled_when_Camp_Conducted_By_is_set_to_VS_Team.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
  });

  await test.step('Select VS Team and verify IP fields are read-only', async () => {
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.conductedByField,
      'VS Team',
      'Conducted By'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldHasAttribute(
      page,
      digiteyescampsManagecampsclusterSelectors.ipNameField,
      'readonly',
      'IP Name'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldHasAttribute(
      page,
      digiteyescampsManagecampsclusterSelectors.ipTeamField,
      'readonly',
      'IP Team'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
