const { test, loadRuntimeData, loginAsAdmin, closeSession, runConvertedFlow } = require('./_shared');

test("TS_25_To_verify_that_Matched_and_Paid_invoices_are_showing_under_Paid_Credits_card", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Dashboard/TS_25_To_verify_that_Matched_and_Paid_invoices_are_showing_under_Paid_Credits_card.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await runConvertedFlow(page, data);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
