const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_65_To_verify_the_Ignore_Leading_and_Trailing_setting_description", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_65_To_verify_the_Ignore_Leading_and_Trailing_setting_description.ds"
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
