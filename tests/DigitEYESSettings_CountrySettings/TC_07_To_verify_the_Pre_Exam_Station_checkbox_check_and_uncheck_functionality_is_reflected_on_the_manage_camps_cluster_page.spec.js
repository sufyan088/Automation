const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsCountrysettingsHelpers
} = require('./_shared');

test('TC_07_To_verify_the_Pre_Exam_Station_checkbox_check_and_uncheck_functionality_is_reflected_on_the_manage_camps_cluster_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/CountrySettings/TC_07_To_verify_the_Pre_Exam_Station_checkbox_check_and_uncheck_functionality_is_reflected_on_the_manage_camps_cluster_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Pre Exam setting reflects on Manage Camp Cluster', async () => {
    await digiteyessettingsCountrysettingsHelpers.verifyCheckboxReflection(page, data, 'preExam');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});