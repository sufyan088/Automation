const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_46_To_verify_that_when_we_navigate_to_next_page_while_filtering_results_and_verify_if_filters_persist", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_46_To_verify_that_when_we_navigate_to_next_page_while_filtering_results_and_verify_if_filters_persist.ds"
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
