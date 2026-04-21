const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_43_To_verify_that_status_button_sorts_the_data_according_to_selected_state_active", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_(Premium)/TS_43_To_verify_that_status_button_sorts_the_data_according_to_selected_state_active.ds"
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
