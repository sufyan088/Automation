const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_04_To_verify_payment_shows_in_1dayleftinSLAcard_if_received_before3PM_CurrentDate_minus_DateReceived_is_2", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Lite_New_Dashboard_Cards/TS_04_To_verify_payment_shows_in_1dayleftinSLAcard_if_received_before3PM_CurrentDate_minus_DateReceived_is_2.ds"
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
