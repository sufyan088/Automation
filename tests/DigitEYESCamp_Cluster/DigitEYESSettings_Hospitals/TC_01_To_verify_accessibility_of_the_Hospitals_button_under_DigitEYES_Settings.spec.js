const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsHospitalsHelpers
} = require('./_shared');

test("TC_01_To_verify_accessibility_of_the_Hospitals_button_under_DigitEYES_Settings", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/Hospitals/TC_01_To_verify_accessibility_of_the_Hospitals_button_under_DigitEYES_Settings.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyessettingsHospitalsHelpers.verifyHospitalsLink(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

