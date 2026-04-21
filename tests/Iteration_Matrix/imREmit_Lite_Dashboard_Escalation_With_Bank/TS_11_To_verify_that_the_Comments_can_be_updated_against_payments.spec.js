const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_11_To_verify_that_the_Comments_can_be_updated_against_payments", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Escalation_With_Bank/TS_11_To_verify_that_the_Comments_can_be_updated_against_payments.ds"
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
