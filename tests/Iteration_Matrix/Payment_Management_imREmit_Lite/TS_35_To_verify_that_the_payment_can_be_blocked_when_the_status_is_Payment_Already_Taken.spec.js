const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_35_To_verify_that_the_payment_can_be_blocked_when_the_status_is_Payment_Already_Taken", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_imREmit_Lite/TS_35_To_verify_that_the_payment_can_be_blocked_when_the_status_is_Payment_Already_Taken.ds"
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
