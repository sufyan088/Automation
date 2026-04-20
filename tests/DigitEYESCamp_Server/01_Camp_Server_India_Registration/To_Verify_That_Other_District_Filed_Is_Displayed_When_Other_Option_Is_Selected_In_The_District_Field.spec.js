const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_Other_District_Filed_Is_Displayed_When_Other_Option_Is_Selected_In_The_District_Field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_Other_District_Filed_Is_Displayed_When_Other_Option_Is_Selected_In_The_District_Field.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that District (Other) field is displayed when Other is selected in the District dropdown', async () => {
    await campServerIndiaRegistrationHelpers.verifyOtherDistrictField(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
