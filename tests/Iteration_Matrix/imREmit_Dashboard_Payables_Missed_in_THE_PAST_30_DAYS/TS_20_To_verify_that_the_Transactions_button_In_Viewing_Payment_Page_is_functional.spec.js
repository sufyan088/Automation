const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesMissedInThePast30DaysHelpers } = require('./_shared');

test("TS_20_To_verify_that_the_Transactions_button_In_Viewing_Payment_Page_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Missed_in_THE_PAST_30_DAYS/TS_20_To_verify_that_the_Transactions_button_In_Viewing_Payment_Page_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open payment details from the payables missed list', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.openPaymentDetails(page, data);
  });

  await test.step('Open transactions in payment details', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.clickDetailButton(
      page,
      imremitDashboardPayablesMissedInThePast30DaysHelpers.selectors.detail.transactions
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
