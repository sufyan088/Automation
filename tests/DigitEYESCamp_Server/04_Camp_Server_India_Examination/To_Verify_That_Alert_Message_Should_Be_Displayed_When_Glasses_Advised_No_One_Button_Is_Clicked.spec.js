const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaExaminationHelpers
} = require('./_shared');

test("To_Verify_That_Alert_Message_Should_Be_Displayed_When_Glasses_Advised_No_One_Button_Is_Clicked ", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Examination/To_Verify_That_Alert_Message_Should_Be_Displayed_When_Glasses_Advised_No_One_Button_Is_Clicked .ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await campServerIndiaExaminationHelpers.verifyGlassesAdvisedRequired(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
