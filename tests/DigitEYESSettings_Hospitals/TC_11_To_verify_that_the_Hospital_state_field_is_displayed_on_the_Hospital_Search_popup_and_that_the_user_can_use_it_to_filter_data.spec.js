const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsHospitalsHelpers
} = require('./_shared');

test('TC_11_To_verify_that_the_Hospital_state_field_is_displayed_on_the_Hospital_Search_popup_and_that_the_user_can_use_it_to_filter_data', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/Hospitals/TC_11_To_verify_that_the_Hospital_state_field_is_displayed_on_the_Hospital_Search_popup_and_that_the_user_can_use_it_to_filter_data.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Hospital State field works on search popup', async () => {
    await digiteyessettingsHospitalsHelpers.verifyHospitalStateField(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});