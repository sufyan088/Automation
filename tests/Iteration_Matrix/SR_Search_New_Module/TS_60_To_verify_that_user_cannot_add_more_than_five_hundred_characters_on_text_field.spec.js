const { test, loadRuntimeData, loginAsAdmin, closeSession, srSearchNewModuleHelpers } = require('./_shared');

test("TS_60_To_verify_that_user_cannot_add_more_than_five_hundred_characters_on_text_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search_New_Module/TS_60_To_verify_that_user_cannot_add_more_than_five_hundred_characters_on_text_field.ds"
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
