const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_67_To_verify_that_the_Status_of_the_payment_can_be_updated_from_In_Progress_to_Closed", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Dashboard_imREmit_Lite_New/TS_67_To_verify_that_the_Status_of_the_payment_can_be_updated_from_In_Progress_to_Closed.ds"
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
