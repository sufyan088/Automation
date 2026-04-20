const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsHospitalsHelpers
} = require('./_shared');

test("TC_06_To_verify_that_the_user_can_select_Yes_from_is _Active_dropdown_in_the_Hospital_Search_Filter", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/Hospitals/TC_06_To_verify_that_the_user_can_select_Yes_from_is _Active_dropdown_in_the_Hospital_Search_Filter.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyessettingsHospitalsHelpers.verifyIsActiveYesOption(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

