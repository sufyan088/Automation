const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_77_To_verify_that_Status_button_sorts_the_data_according_to_the_selected_state_Partial_payment_already_Taken", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Dashboard_imREmit_Lite_New/TS_77_To_verify_that_Status_button_sorts_the_data_according_to_the_selected_state_Partial_payment_already_Taken.ds"
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
