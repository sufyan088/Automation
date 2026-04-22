const { test, loadRuntimeData, loginAsAdmin, closeSession, cardOnFileHelpers } = require('./_shared');

test("TS_05_To_verify_that_the_Card_Limit_Buffer_field_is_visible_and_editable_to_Management_role", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_05_To_verify_that_the_Card_Limit_Buffer_field_is_visible_and_editable_to_Management_role.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await cardOnFileHelpers.openSupplierManagementForCustomer(page, 'Cadent');
    await cardOnFileHelpers.openEditSupplierDetails(page, 'CardOnFile');
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.selectCardOnFile(page);
    await cardOnFileHelpers.expectVisible(page, cardOnFileHelpers.selectors.editSupplier.cardLimitAmountLabel);
    await cardOnFileHelpers.expectInputEditable(page, cardOnFileHelpers.selectors.editSupplier.cardLimitBufferInput);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
