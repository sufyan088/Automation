const { test, loadRuntimeData, loginAsAdmin, closeSession, srSearchNewModuleHelpers } = require('./_shared');

test("TS_53_To_verify_that_screen_displays_all_available_match_statuses_as_separate_labeled_cards_in_grid_layout", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search_New_Module/TS_53_To_verify_that_screen_displays_all_available_match_statuses_as_separate_labeled_cards_in_grid_layout.ds"
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
