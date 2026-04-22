const { test, loadRuntimeData, loginAsAdmin, closeSession, cardOnFileHelpers } = require('./_shared');

test("TS_01_To_verify_that_the_Flag_Reset_button_is_visible_and_disabled_after_selecting_the_Card_on_File_radio_button_on_the_edit_supplier_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_01_To_verify_that_the_Flag_Reset_button_is_visible_and_disabled_after_selecting_the_Card_on_File_radio_button_on_the_edit_supplier_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await cardOnFileHelpers.openSupplierManagementForCustomer(page, 'Cadent');
    await cardOnFileHelpers.openEditSupplierDetails(page, 'CardOnFile');
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.selectCardOnFile(page);
    await cardOnFileHelpers.expectFlagResetVisible(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
