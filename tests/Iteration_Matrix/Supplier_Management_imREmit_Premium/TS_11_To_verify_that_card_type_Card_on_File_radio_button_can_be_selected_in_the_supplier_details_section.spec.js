const { test, loadRuntimeData, loginAsAdmin, closeSession, supplierManagementImremitPremiumHelpers } = require('./_shared');

test("TS_11_To_verify_that_card_type_Card_on_File_radio_button_can_be_selected_in_the_supplier_details_section", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_(Premium)/TS_11_To_verify_that_card_type_Card_on_File_radio_button_can_be_selected_in_the_supplier_details_section.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await supplierManagementImremitPremiumHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
