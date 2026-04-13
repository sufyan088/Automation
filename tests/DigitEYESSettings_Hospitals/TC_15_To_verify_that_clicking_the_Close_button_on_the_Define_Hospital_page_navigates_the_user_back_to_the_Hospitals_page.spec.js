const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsHospitalsHelpers
} = require('./_shared');

test('TC_15_To_verify_that_clicking_the_Close_button_on_the_Define_Hospital_page_navigates_the_user_back_to_the_Hospitals_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/Hospitals/TC_15_To_verify_that_clicking_the_Close_button_on_the_Define_Hospital_page_navigates_the_user_back_to_the_Hospitals_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Define Hospital Close returns to listing', async () => {
    await digiteyessettingsHospitalsHelpers.verifyDefineHospitalClose(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});