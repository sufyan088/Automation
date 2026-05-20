const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPaymentReceivedHelpers } = require('./_shared');

test("TS_46_To_verify_that_Download_Chart_button_is_functional_on_Payment_Received_Graph_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payment_Received/TS_46_To_verify_that_Download_Chart_button_is_functional_on_Payment_Received_Graph_page.ds"
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
