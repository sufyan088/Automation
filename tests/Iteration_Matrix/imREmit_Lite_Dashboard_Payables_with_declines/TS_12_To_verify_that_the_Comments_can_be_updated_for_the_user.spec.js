const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_12_To_verify_that_the_Comments_can_be_updated_for_the_user", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_12_To_verify_that_the_Comments_can_be_updated_for_the_user.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  const commentText = `PayablesWithDeclines-${Date.now()}`;
  const updatedText = `${commentText}-edited`;

  await test.step('Open payment details from the Payables with Declines list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPaymentDetails(page, data);
  });

  await test.step('Add and edit a payment comment', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.addComment(page, commentText);
    await imremitLiteDashboardPayablesWithDeclinesHelpers.editComment(page, commentText, updatedText);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
