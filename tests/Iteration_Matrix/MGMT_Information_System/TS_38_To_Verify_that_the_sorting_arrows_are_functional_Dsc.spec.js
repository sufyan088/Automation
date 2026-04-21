const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_38_To_Verify_that_the_sorting_arrows_are_functional_Dsc", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_38_To_Verify_that_the_sorting_arrows_are_functional_Dsc.ds"
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
