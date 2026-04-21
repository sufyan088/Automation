const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_64_To_verify_that_Sender_dropdown_default_value_is_All", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_imREmit_Lite/TS_64_To_verify_that_Sender_dropdown_default_value_is_All.ds"
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
