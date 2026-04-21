const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_62_To_verify_that_the_Status_of_the_payment_can_be_updated_from_Invoice_Amount_Mismatch_to_Escalation_with_Bank", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Dashboard_imREmit_Lite_New/TS_62_To_verify_that_the_Status_of_the_payment_can_be_updated_from_Invoice_Amount_Mismatch_to_Escalation_with_Bank.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
