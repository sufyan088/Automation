const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_31_To_verify_that_the_payments_can_be_re_processed_via_portal", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_imREmit_Lite/TS_31_To_verify_that_the_payments_can_be_re_processed_via_portal.ds"
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
