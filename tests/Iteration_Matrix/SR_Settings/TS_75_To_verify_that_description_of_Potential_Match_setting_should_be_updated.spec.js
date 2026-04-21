const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_75_To_verify_that_description_of_Potential_Match_setting_should_be_updated", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_75_To_verify_that_description_of_Potential_Match_setting_should_be_updated.ds"
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
