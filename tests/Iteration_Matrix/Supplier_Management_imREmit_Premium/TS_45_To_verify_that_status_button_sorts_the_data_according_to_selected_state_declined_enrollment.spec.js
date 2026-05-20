const { test, loadRuntimeData, loginAsAdmin, closeSession, supplierManagementImremitPremiumHelpers } = require('./_shared');

test("TS_45_To_verify_that_status_button_sorts_the_data_according_to_selected_state_declined_enrollment", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_(Premium)/TS_45_To_verify_that_status_button_sorts_the_data_according_to_selected_state_declined_enrollment.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await supplierManagementImremitPremiumHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
