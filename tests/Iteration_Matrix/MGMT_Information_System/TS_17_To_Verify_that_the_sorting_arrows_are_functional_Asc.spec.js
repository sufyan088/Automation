const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtInformationSystemHelpers } = require('./_shared');

test("TS_17_To_Verify_that_the_sorting_arrows_are_functional_Asc", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_17_To_Verify_that_the_sorting_arrows_are_functional_Asc.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await mgmtInformationSystemHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
