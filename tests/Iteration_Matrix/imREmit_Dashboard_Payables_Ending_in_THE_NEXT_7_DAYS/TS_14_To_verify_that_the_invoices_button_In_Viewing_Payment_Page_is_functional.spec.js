const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesEndingInTheNext7DaysHelpers } = require('./_shared');

test("TS_14_To_verify_that_the_invoices_button_In_Viewing_Payment_Page_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Ending_in_THE_NEXT_7_DAYS/TS_14_To_verify_that_the_invoices_button_In_Viewing_Payment_Page_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open payment details from the payables ending list', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.openPaymentDetails(page, data);
  });

  await test.step('Open the Invoices view in payment details', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.clickDetailButton(
      page,
      imremitDashboardPayablesEndingInTheNext7DaysHelpers.selectors.detail.invoices
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
