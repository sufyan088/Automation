const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_All_Stations_Should_Be_Displayed_According_To_The_Camp_Cluster_When_User_Redirects_To_Camp_Server_Home_Page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_All_Stations_Should_Be_Displayed_According_To_The_Camp_Cluster_When_User_Redirects_To_Camp_Server_Home_Page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that all stations are displayed according to the Camp Cluster when user redirects to Camp Server Home page', async () => {
    await campServerIndiaRegistrationHelpers.verifyHomeStations(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
