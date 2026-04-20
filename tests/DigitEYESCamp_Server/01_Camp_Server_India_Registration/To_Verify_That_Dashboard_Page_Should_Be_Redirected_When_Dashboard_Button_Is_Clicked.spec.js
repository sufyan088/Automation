const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_Dashboard_Page_Should_Be_Redirected_When_Dashboard_Button_Is_Clicked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_Dashboard_Page_Should_Be_Redirected_When_Dashboard_Button_Is_Clicked.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that Dashboard page is redirected when Dashboard button is clicked after successful registration', async () => {
    await campServerIndiaRegistrationHelpers.verifyDashboardRedirect(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
