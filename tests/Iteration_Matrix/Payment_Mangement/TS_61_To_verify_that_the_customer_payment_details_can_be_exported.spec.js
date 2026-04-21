const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_61_To_verify_that_the_customer_payment_details_can_be_exported", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Mangement/TS_61_To_verify_that_the_customer_payment_details_can_be_exported.ds"
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
