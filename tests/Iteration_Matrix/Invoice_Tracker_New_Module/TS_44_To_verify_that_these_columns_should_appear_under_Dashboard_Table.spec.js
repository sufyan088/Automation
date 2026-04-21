const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_44_To_verify_that_these_columns_should_appear_under_Dashboard_Table", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_44_To_verify_that_these_columns_should_appear_under_Dashboard_Table.ds"
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
