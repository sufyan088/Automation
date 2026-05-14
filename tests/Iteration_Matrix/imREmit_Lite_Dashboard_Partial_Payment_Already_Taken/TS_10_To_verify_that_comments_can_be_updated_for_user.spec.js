const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPartialPaymentAlreadyTakenHelpers } = require('./_shared');

test("TS_10_To_verify_that_comments_can_be_updated_for_user", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Partial_Payment_Already_Taken/TS_10_To_verify_that_comments_can_be_updated_for_user.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  const commentText = `PartialPaymentAlreadyTaken-${Date.now()}`;
  const updatedText = `${commentText}-edited`;

  await test.step('Open payment details from the Partial Payment Already Taken list', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.openPaymentDetails(page, data);
  });

  await test.step('Add and edit a payment comment', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.addComment(page, commentText);
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.editComment(page, commentText, updatedText);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
