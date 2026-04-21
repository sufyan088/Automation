const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_47_To_verify_that_Status_button_sorts_the_data_according_to_selected_state_Onboarding_pending", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_Lite/TS_47_To_verify_that_Status_button_sorts_the_data_according_to_selected_state_Onboarding_pending.ds"
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
