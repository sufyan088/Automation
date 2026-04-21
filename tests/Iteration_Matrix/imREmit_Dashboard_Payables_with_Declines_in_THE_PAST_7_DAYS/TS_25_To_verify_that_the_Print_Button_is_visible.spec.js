const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_25_To_verify_that_the_Print_Button_is_visible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_with_Declines_in_THE_PAST_7_DAYS/TS_25_To_verify_that_the_Print_Button_is_visible.ds"
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
