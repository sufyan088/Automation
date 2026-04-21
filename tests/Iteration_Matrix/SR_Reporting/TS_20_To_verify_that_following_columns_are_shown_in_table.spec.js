const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_20_To_verify_that_following_columns_are_shown_in_table", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Reporting/TS_20_To_verify_that_following_columns_are_shown_in_table.ds"
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
