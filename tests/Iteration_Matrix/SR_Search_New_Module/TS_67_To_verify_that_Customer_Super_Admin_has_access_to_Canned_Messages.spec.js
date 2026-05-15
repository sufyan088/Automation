const { test, loadRuntimeData, loginAsRole, closeSession, srSearchNewModuleHelpers } = require('./_shared');

test("TS_67_To_verify_that_Customer_Super_Admin_has_access_to_Canned_Messages", async ({ page }) => {
  const data = loadRuntimeData();
  data.Username_Customer_Super_Admin = 'adminsuper';
  data.Password_Customer_Super_Admin = '1111';
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search_New_Module/TS_67_To_verify_that_Customer_Super_Admin_has_access_to_Canned_Messages.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsRole(page, data, 'customerSuperAdmin');
  });

  await test.step('Run converted flow', async () => {
    await srSearchNewModuleHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
