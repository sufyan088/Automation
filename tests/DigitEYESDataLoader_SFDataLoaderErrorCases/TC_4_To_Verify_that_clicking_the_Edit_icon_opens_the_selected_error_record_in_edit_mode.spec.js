const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers
} = require('./_shared');

test('TC_4_To_Verify_that_clicking_the_Edit_icon_opens_the_selected_error_record_in_edit_mode', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases/TC_4_To_Verify_that_clicking_the_Edit_icon_opens_the_selected_error_record_in_edit_mode.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Error Cases and verify clicking edit icon opens record in edit mode', async () => {
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openFirstRecordInEditMode(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
