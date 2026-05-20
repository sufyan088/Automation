const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPaymentReceivedHelpers } = require('./_shared');

test("TS_37_To_verify_that_the_Payment_Status_dropdown_list_is_in_the_alphabetical_order_for_Payments_Received", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payment_Received/TS_37_To_verify_that_the_Payment_Status_dropdown_list_is_in_the_alphabetical_order_for_Payments_Received.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await mgmtPaymentReceivedHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
