const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_48_To_verify_that_when_we_Switch_tabs_while_system_is_loading_search_results", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_48_To_verify_that_when_we_Switch_tabs_while_system_is_loading_search_results.ds"
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
