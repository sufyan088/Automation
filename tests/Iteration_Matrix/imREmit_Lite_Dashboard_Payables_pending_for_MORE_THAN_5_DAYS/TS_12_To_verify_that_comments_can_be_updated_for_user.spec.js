const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('./_shared');

test("TS_12_To_verify_that_comments_can_be_updated_for_user", async ({ page }) => {
  test.setTimeout(180000);
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_pending_for_MORE_THAN_5_DAYS/TS_12_To_verify_that_comments_can_be_updated_for_user.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  const commentText = `PendingForMoreThan5Days-${Date.now()}`;
  const updatedText = `${commentText}-edited`;

  await test.step('Open payment details from the Payables Pending for More Than 5 Days list', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openPaymentDetails(page, data);
  });

  await test.step('Add a payment comment', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.addComment(page, commentText);
  });

  await test.step('Edit the payment comment', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.editComment(page, commentText, updatedText);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
