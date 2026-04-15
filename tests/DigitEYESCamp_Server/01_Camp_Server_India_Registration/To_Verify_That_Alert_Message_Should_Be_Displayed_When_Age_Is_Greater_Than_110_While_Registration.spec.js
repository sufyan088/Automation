const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_Alert_Message_Should_Be_Displayed_When_Age_Is_Greater_Than_110_While_Registration", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_Alert_Message_Should_Be_Displayed_When_Age_Is_Greater_Than_110_While_Registration.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that alert message is displayed when age is greater than 110 while registration', async () => {
    await campServerIndiaRegistrationHelpers.verifyAgeUpperBound(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
