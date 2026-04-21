const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_31_verify_that_total_amount_sent_is_not_equal_to_amount_taken_on_View_Payment_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Missed_in_THE_PAST_30_DAYS/TS_31_verify_that_total_amount_sent_is_not_equal_to_amount_taken_on_View_Payment_page.ds"
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
