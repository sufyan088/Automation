const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_01_To_verify_1day_left_in_SLA_and_Passed_2day_SLA_are_visible_if_Sender_is_ALL_or_EdenredPay", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Lite_New_Dashboard_Cards/TS_01_To_verify_1day_left_in_SLA_and_Passed_2day_SLA_are_visible_if_Sender_is_ALL_or_EdenredPay.ds"
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
