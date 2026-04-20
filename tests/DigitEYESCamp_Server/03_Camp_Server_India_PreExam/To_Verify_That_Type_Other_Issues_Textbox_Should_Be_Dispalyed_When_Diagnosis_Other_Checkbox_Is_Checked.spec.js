const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaPreexamHelpers
} = require('./_shared');

test("To_Verify_That_Type_Other_Issues_Textbox_Should_Be_Dispalyed_When_Diagnosis_Other_Checkbox_Is_Checked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/PreExam/To_Verify_That_Type_Other_Issues_Textbox_Should_Be_Dispalyed_When_Diagnosis_Other_Checkbox_Is_Checked.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await campServerIndiaPreexamHelpers.verifyOtherIssuesTextboxDisplayed(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
