const { test, loadRuntimeData, loginAsAdmin, closeSession, srSearchNewModuleHelpers } = require('./_shared');

test("TS_62_To_verify_that_If_a_template_exists_user_can_review_or_edit_text", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search_New_Module/TS_62_To_verify_that_If_a_template_exists_user_can_review_or_edit_text.ds"
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
