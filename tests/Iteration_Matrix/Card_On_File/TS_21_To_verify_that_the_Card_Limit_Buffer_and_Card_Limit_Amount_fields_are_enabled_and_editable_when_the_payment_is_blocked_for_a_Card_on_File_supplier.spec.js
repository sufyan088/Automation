const { test, loadRuntimeData, loginAsAdmin, closeSession, cardOnFileHelpers } = require('./_shared');

test("TS_21_To_verify_that_the_Card_Limit_Buffer_and_Card_Limit_Amount_fields_are_enabled_and_editable_when_the_payment_is_blocked_for_a_Card_on_File_supplier", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_21_To_verify_that_the_Card_Limit_Buffer_and_Card_Limit_Amount_fields_are_enabled_and_editable_when_the_payment_is_blocked_for_a_Card_on_File_supplier.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await cardOnFileHelpers.openSupplierManagementForCustomer(page, 'Cadent');
    await cardOnFileHelpers.openEditSupplierDetails(page, 'CardOnFile');
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.selectCardOnFile(page);
    await cardOnFileHelpers.expectInputEditable(page, cardOnFileHelpers.selectors.editSupplier.cardLimitBufferInput);
    await cardOnFileHelpers.expectInputEditable(page, cardOnFileHelpers.selectors.editSupplier.cardLimitAmountInput);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
