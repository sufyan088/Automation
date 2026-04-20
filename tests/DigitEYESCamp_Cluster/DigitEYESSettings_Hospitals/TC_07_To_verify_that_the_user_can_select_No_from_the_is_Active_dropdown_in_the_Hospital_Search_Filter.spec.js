const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsHospitalsHelpers
} = require('./_shared');

test('TC_07_To_verify_that_the_user_can_select_No_from_the_is_Active_dropdown_in_the_Hospital_Search_Filter', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/Hospitals/TC_07_To_verify_that_the_user_can_select_No_from_the_is_Active_dropdown_in_the_Hospital_Search_Filter.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Is Active No option is selectable', async () => {
    await digiteyessettingsHospitalsHelpers.verifyIsActiveNoOption(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});