const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_23_To_verify_that_the_Suffix_ID_criteria_setting_can_be_added", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_23_To_verify_that_the_Suffix_ID_criteria_setting_can_be_added.ds"
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
