const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesEndingInTheNext7DaysHelpers } = require('./_shared');

test("TS_25_To_verify_that_Run_To_Top_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Ending_in_THE_NEXT_7_DAYS/TS_25_To_verify_that_Run_To_Top_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the payables ending in next 7 days list', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.openPayablesEndingList(page, data);
  });

  await test.step('Scroll down and return to the top of the payment list', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.returnToTopOfPaymentList(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
