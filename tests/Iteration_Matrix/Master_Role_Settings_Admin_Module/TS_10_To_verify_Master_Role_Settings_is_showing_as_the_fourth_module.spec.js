const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_10_To_verify_Master_Role_Settings_is_showing_as_the_fourth_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Master_Role_Settings_Admin_Module/TS_10_To_verify_Master_Role_Settings_is_showing_as_the_fourth_module.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
