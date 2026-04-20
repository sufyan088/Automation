const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaExaminationHelpers
} = require('./_shared');

test("To_Verify_That_Clicking_Yes_On_The_Refer_To_Hospital_Button_Redirects_To_The_Refer_To_The_Hospital_Screen", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Examination/To_Verify_That_Clicking_Yes_On_The_Refer_To_Hospital_Button_Redirects_To_The_Refer_To_The_Hospital_Screen.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await campServerIndiaExaminationHelpers.verifyClickingYesOnReferToHospitalRedirectsToHospitalScreen(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
