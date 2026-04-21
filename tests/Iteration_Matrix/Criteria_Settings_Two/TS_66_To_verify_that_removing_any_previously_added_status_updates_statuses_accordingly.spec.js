const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_66_To_verify_that_removing_any_previously_added_status_updates_statuses_accordingly", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_Two/TS_66_To_verify_that_removing_any_previously_added_status_updates_statuses_accordingly.ds"
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
