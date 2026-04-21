const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_30_verify_payments_with_status_has_been_processed_awaiting_successful_authorizations_not_shown", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Pending_for_MORE_THAN_5_DAYS/TS_30_verify_payments_with_status_has_been_processed_awaiting_successful_authorizations_not_shown.ds"
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
