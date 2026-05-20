const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPercentageGrowthHelpers } = require('./_shared');

test("TS_08_To_Verify_that_the_Search_all_entries_button_is_functional_on_the_MIS_Percentage_Growth_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Percentage_Growth/TS_08_To_Verify_that_the_Search_all_entries_button_is_functional_on_the_MIS_Percentage_Growth_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await mgmtPercentageGrowthHelpers.runScenario(page, __filename);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
