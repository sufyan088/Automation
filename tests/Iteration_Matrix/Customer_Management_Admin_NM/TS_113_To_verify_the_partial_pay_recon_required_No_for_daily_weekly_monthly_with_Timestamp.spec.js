const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_113_To_verify_the_partial_pay_recon_required_No_for_daily_weekly_monthly_with_Timestamp", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_113_To_verify_the_partial_pay_recon_required_No_for_daily_weekly_monthly_with_Timestamp.ds"
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
