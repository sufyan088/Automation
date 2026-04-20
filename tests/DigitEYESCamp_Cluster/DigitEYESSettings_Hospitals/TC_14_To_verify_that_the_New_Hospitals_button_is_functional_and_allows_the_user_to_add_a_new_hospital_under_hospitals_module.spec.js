const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsHospitalsHelpers
} = require('./_shared');

test('TC_14_To_verify_that_the_New_Hospitals_button_is_functional_and_allows_the_user_to_add_a_new_hospital_under_hospitals_module', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/Hospitals/TC_14_To_verify_that_the_New_Hospitals_button_is_functional_and_allows_the_user_to_add_a_new_hospital_under_hospitals_module.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify New Hospital form opens', async () => {
    await digiteyessettingsHospitalsHelpers.verifyNewHospitalButton(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});