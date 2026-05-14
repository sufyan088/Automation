const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPaymentsPending5daysHelpers } = require('./_shared');

test("TS_18_To_verify_that_the_Remittance_Method_dropdown_is_functional_on_the_Adjust_Filter_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payments_Pending_5Days/TS_18_To_verify_that_the_Remittance_Method_dropdown_is_functional_on_the_Adjust_Filter_popup.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await mgmtPaymentsPending5daysHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
