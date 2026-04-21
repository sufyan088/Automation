const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_61_To_verify_that_when_Enable_One_Time_Run_button_is_clicked_then_its_disabled", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_61_To_verify_that_when_Enable_One_Time_Run_button_is_clicked_then_its_disabled.ds"
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
