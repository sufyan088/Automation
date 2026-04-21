const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_06_To_verify_payment_shows_in_passed2DaySLAcard_if_received_before3PM_date_greaterThanEqualTo_3", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Lite_New_Dashboard_Cards/TS_06_To_verify_payment_shows_in_passed2DaySLAcard_if_received_before3PM_date_greaterThanEqualTo_3.ds"
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
