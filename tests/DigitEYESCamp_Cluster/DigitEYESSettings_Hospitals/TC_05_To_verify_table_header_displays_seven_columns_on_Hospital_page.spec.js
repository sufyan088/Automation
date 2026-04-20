const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsHospitalsHelpers
} = require('./_shared');

test("TC_05_To_verify_table_header_displays_seven_columns_on_Hospital_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/Hospitals/TC_05_To_verify_table_header_displays_seven_columns_on_Hospital_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyessettingsHospitalsHelpers.verifyTableHeaders(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

