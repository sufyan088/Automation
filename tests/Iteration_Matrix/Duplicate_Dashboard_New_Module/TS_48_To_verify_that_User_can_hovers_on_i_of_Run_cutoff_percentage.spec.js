const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_48_To_verify_that_User_can_hovers_on_i_of_Run_cutoff_percentage", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_48_To_verify_that_User_can_hovers_on_i_of_Run_cutoff_percentage.ds"
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
