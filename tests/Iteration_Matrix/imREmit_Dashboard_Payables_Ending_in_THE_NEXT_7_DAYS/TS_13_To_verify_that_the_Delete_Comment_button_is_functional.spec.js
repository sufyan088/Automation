const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesEndingInTheNext7DaysHelpers } = require('./_shared');

test("TS_13_To_verify_that_the_Delete_Comment_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Ending_in_THE_NEXT_7_DAYS/TS_13_To_verify_that_the_Delete_Comment_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open payment details comments', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.openPaymentDetails(page, data);
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.addComment(page, 'Comments');
  });

  await test.step('Open the delete comment action', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.deleteComment(page, 'Comments');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
