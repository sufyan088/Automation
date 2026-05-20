const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPercentageGrowthHelpers } = require('./_shared');

test("TS_15_To_verify_that_the_Download_Image_button_is_functional_on_the_Percentage_Growth_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Percentage_Growth/TS_15_To_verify_that_the_Download_Image_button_is_functional_on_the_Percentage_Growth_page.ds"
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
