const { test, loadRuntimeData, loginAsAdmin, closeSession, cardOnFileHelpers } = require('./_shared');

test("TS_20_To verify_that_the_Card_Limit_Buffer_and_Card_Limit_Amount_fields_are_enabled_and_editable_when_the_Flag_Reset_button_is_clicked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_20_To verify_that_the_Card_Limit_Buffer_and_Card_Limit_Amount_fields_are_enabled_and_editable_when_the_Flag_Reset_button_is_clicked.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await cardOnFileHelpers.openSupplierManagementForCustomer(page, 'Cadent');
    const supplier = await cardOnFileHelpers.createSupplier(page, { supplierName: `CofFlagReset${Date.now()}` });
    await cardOnFileHelpers.openEditSupplierDetails(page, supplier.supplierName);
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.selectCardOnFile(page);
    await cardOnFileHelpers.populateRequiredSupplierProfile(page, supplier);
    await cardOnFileHelpers.chooseRemittanceMethod(page, 'Pay By Email');
    await cardOnFileHelpers.expectInputEditable(page, cardOnFileHelpers.selectors.editSupplier.cardLimitBufferInput);
    await cardOnFileHelpers.expectInputEditable(page, cardOnFileHelpers.selectors.editSupplier.cardLimitAmountInput);
    await cardOnFileHelpers.setCardLimitAmount(page, '');
    await cardOnFileHelpers.clickSaveAndSubmit(page);
    await cardOnFileHelpers.expectValidationMessage(page, 'Card Limit Amount is required when Card on File is enabled');
    await cardOnFileHelpers.expectInputEditable(page, cardOnFileHelpers.selectors.editSupplier.cardLimitBufferInput);
    await cardOnFileHelpers.expectInputEditable(page, cardOnFileHelpers.selectors.editSupplier.cardLimitAmountInput);
    await cardOnFileHelpers.setCardLimitAmount(page, '55');
    await cardOnFileHelpers.clickSaveAndSubmit(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
