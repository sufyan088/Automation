const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsHospitalsHelpers
} = require('./_shared');

test('TC_08_To_verify_that_clicking_the_Search_Filter_button_on_the_Hospitals_page_opens_the_Hospital_Search_popup', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/Hospitals/TC_08_To_verify_that_clicking_the_Search_Filter_button_on_the_Hospitals_page_opens_the_Hospital_Search_popup.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Hospital search popup opens', async () => {
    await digiteyessettingsHospitalsHelpers.verifySearchFilterOpen(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});