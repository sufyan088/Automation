const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPercentageGrowthHelpers } = require('./_shared');

test("TS_11_To_Verify_that_the_sorting_arrows_are_functional_Asc", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Percentage_Growth/TS_11_To_Verify_that_the_sorting_arrows_are_functional_Asc.ds"
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
