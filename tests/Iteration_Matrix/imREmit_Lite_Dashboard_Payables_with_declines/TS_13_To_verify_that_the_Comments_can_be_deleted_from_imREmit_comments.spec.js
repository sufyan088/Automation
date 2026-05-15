const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_13_To_verify_that_the_Comments_can_be_deleted_from_imREmit_comments", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_13_To_verify_that_the_Comments_can_be_deleted_from_imREmit_comments.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  const commentText = `PayablesWithDeclines-${Date.now()}`;

  await test.step('Open payment details from the Payables with Declines list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPaymentDetails(page, data);
  });

  await test.step('Add and delete a payment comment', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.addComment(page, commentText);
    await imremitLiteDashboardPayablesWithDeclinesHelpers.deleteComment(page, commentText);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
