const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_13_To_verify_that_the_Credit_Pair_Logic_setting_is_working_properly_for_the_Missing_Credit", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Settings/TS_13_To_verify_that_the_Credit_Pair_Logic_setting_is_working_properly_for_the_Missing_Credit.ds"
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
