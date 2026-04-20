const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaExaminationHelpers
} = require('./_shared');

test("To_Verify_That_Normal_No_Refractive_Error_Should_Be_UnChecked_When_All_Or_Some_Diagnosis_is_Checked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Examination/To_Verify_That_Normal_No_Refractive_Error_Should_Be_UnChecked_When_All_Or_Some_Diagnosis_is_Checked.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await campServerIndiaExaminationHelpers.verifyNormalUncheckedWhenDiagnosisChecked(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
