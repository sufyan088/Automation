const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_59_To_verify_that_clicking_Hide_button_should_hide_Updated_Date_column", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_imREmit_Lite/TS_59_To_verify_that_clicking_Hide_button_should_hide_Updated_Date_column.ds"
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
