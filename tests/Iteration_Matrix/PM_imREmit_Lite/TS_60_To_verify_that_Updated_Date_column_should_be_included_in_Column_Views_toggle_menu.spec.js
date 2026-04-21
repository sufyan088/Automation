const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_60_To_verify_that_Updated_Date_column_should_be_included_in_Column_Views_toggle_menu", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_imREmit_Lite/TS_60_To_verify_that_Updated_Date_column_should_be_included_in_Column_Views_toggle_menu.ds"
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
