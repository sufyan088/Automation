const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TC_18_To_verify_that_status_button_sorts _the_data_according_to_selected_state_failed", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Dashboard_imREmit_Lite/TC_18_To_verify_that_status_button_sorts _the_data_according_to_selected_state_failed.ds"
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
