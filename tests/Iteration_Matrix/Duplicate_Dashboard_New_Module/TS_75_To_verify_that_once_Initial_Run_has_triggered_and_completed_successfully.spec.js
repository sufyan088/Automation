const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_75_To_verify_that_once_Initial_Run_has_triggered_and_completed_successfully", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_75_To_verify_that_once_Initial_Run_has_triggered_and_completed_successfully.ds"
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
