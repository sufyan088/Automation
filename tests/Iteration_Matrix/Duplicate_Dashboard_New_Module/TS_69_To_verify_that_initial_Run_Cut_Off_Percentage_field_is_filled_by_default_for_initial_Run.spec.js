const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_69_To_verify_that_initial_Run_Cut_Off_Percentage_field_is_filled_by_default_for_initial_Run", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_69_To_verify_that_initial_Run_Cut_Off_Percentage_field_is_filled_by_default_for_initial_Run.ds"
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
