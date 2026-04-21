const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_42_To_verify_that_input_default_value_should_be_one", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_New_Module/TS_42_To_verify_that_input_default_value_should_be_one.ds"
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
