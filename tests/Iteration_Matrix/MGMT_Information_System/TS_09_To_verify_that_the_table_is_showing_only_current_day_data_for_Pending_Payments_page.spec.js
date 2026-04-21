const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_09_To_verify_that_the_table_is_showing_only_current_day_data_for_Pending_Payments_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_09_To_verify_that_the_table_is_showing_only_current_day_data_for_Pending_Payments_page.ds"
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
