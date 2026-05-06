const { test, loadRuntimeData, loginAsAdmin, closeSession, customerModuleManagementAdminModuleHelpers } = require('./_shared');

test("TS_16_To_verify_that_the_imREmit_Onboard_Pending_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Module_Management_Admin_Module/TS_16_To_verify_that_the_imREmit_Onboard_Pending_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerModuleManagementAdminModuleHelpers.runScenario(page, data, 'TS_16_To_verify_that_the_imREmit_Onboard_Pending_is_functional');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
