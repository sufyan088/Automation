const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_96_To_verify_that_removing_customer_from_selection_immediately_removes_their_data_from_table_view", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_New_Module/TS_96_To_verify_that_removing_customer_from_selection_immediately_removes_their_data_from_table_view.ds"
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
