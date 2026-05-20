const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesMissedInThePast30DaysHelpers } = require('./_shared');

test("TS_16_To_verify_that_the_Edit_Comment_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Missed_in_THE_PAST_30_DAYS/TS_16_To_verify_that_the_Edit_Comment_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open payment details from the payables missed list', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.openPaymentDetails(page, data);
  });

  await test.step('Add and edit a payment comment', async () => {
    const commentText = `MissedPast30Days-${Date.now()}`;
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.addComment(page, commentText);
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.editComment(page, commentText, `${commentText}-edited`);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
