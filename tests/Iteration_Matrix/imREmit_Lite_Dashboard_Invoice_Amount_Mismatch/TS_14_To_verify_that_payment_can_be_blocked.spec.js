const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_14_To_verify_that_payment_can_be_blocked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Invoice_Amount_Mismatch/TS_14_To_verify_that_payment_can_be_blocked.ds"
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
