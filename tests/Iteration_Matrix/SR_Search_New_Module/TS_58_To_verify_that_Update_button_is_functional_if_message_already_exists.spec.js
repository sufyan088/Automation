const { test, loadRuntimeData, loginAsAdmin, closeSession, srSearchNewModuleHelpers } = require('./_shared');

test("TS_58_To_verify_that_Update_button_is_functional_if_message_already_exists", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search_New_Module/TS_58_To_verify_that_Update_button_is_functional_if_message_already_exists.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await srSearchNewModuleHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
