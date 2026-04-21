const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_40_To_verify_that_the_payment_statuses_are_showing_according_to_the_program_type_for_Payments_Received", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payment_Received/TS_40_To_verify_that_the_payment_statuses_are_showing_according_to_the_program_type_for_Payments_Received.ds"
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
