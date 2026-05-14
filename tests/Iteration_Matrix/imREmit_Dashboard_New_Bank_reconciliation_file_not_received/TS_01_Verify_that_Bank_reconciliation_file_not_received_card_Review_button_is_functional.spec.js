const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardNewBankReconciliationFileNotReceivedHelpers } = require('./_shared');

test("TS_01_Verify_that_Bank_reconciliation_file_not_received_card_Review_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard_New/Bank_reconciliation_file_not_received/TS_01_Verify_that_Bank_reconciliation_file_not_received_card_Review_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await imremitDashboardNewBankReconciliationFileNotReceivedHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
