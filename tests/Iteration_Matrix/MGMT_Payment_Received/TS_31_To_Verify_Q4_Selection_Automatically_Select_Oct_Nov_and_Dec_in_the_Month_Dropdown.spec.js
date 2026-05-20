const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPaymentReceivedHelpers } = require('./_shared');

test("TS_31_To_Verify_Q4_Selection_Automatically_Select_Oct_Nov_and_Dec_in_the_Month_Dropdown", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payment_Received/TS_31_To_Verify_Q4_Selection_Automatically_Select_Oct_Nov_and_Dec_in_the_Month_Dropdown.ds"
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
