const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_57_To_verify_that_clicking_Asc_button_should_sort_Updated_Date_column_in_Ascending_order", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_imREmit_Lite/TS_57_To_verify_that_clicking_Asc_button_should_sort_Updated_Date_column_in_Ascending_order.ds"
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
