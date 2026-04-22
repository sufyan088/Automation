const { test, loadRuntimeData, loginAsAdmin, closeSession, cardOnFileHelpers } = require('./_shared');

test("TS_03_To_verify_that_the_supplier_can_be_enrolled_as_Card_On_File_card_type", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_03_To_verify_that_the_supplier_can_be_enrolled_as_Card_On_File_card_type.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await cardOnFileHelpers.openSupplierManagementForCustomer(page, 'Cadent');
    const supplier = await cardOnFileHelpers.createSupplier(page, { supplierName: `CofEnroll${Date.now()}` });
    await cardOnFileHelpers.openEditSupplierDetails(page, supplier.supplierName);
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.selectCardOnFile(page);
    await cardOnFileHelpers.chooseRemittanceMethod(page, 'Pay By Email');
    await cardOnFileHelpers.expectVisible(page, cardOnFileHelpers.selectors.editSupplier.supplierContactNameInput);
    await cardOnFileHelpers.expectVisible(page, cardOnFileHelpers.selectors.editSupplier.contactEmailInput);
    await cardOnFileHelpers.expectVisible(page, cardOnFileHelpers.selectors.editSupplier.cardOnFile);
    await cardOnFileHelpers.expectVisible(page, cardOnFileHelpers.selectors.editSupplier.cardLimitBufferLabel);
    await cardOnFileHelpers.expectVisible(page, cardOnFileHelpers.selectors.editSupplier.cardLimitAmountLabel);
    await cardOnFileHelpers.setCardLimitBuffer(page, '500');
    await cardOnFileHelpers.setCardLimitAmount(page, '55');
    test.info().annotations.push({ type: 'supplier-name', description: supplier.supplierName });
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
