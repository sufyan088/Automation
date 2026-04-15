const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verifty_That_User_Is_Successfully_Log_Out_From_The_Camp_Server_Upon_Clicking_On_The_Logout_Button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verifty_That_User_Is_Successfully_Log_Out_From_The_Camp_Server_Upon_Clicking_On_The_Logout_Button.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that user is successfully logged out from the Camp Server upon clicking the Logout button', async () => {
    await campServerIndiaRegistrationHelpers.verifyLogout(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
