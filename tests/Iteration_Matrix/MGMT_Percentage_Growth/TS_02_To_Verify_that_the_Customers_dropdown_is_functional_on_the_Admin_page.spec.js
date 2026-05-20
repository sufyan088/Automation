const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPercentageGrowthHelpers } = require('./_shared');

test("TS_02_To_Verify_that_the_Customers_dropdown_is_functional_on_the_Admin_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Percentage_Growth/TS_02_To_Verify_that_the_Customers_dropdown_is_functional_on_the_Admin_page.ds"
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
