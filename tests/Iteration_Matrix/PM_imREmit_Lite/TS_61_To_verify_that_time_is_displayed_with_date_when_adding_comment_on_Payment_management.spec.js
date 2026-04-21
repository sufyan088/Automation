const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_61_To_verify_that_time_is_displayed_with_date_when_adding_comment_on_Payment_management", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_imREmit_Lite/TS_61_To_verify_that_time_is_displayed_with_date_when_adding_comment_on_Payment_management.ds"
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
