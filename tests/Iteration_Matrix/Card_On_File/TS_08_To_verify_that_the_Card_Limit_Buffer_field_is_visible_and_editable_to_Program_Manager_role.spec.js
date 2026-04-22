const { test, loadRuntimeData, loginAsRole, closeSession, cardOnFileHelpers } = require('./_shared');

test("TS_08_To_verify_that_the_Card_Limit_Buffer_field_is_visible_and_editable_to_Program_Manager_role", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_08_To_verify_that_the_Card_Limit_Buffer_field_is_visible_and_editable_to_Program_Manager_role.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsRole(page, data, 'programManager');
  });

  await test.step('Run converted flow', async () => {
    await cardOnFileHelpers.openSupplierManagementForCustomer(page, 'Cadent');
    await cardOnFileHelpers.openEditSupplierDetails(page, 'CardOnFile');
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.selectCardOnFile(page);
    await cardOnFileHelpers.expectInputEditable(page, cardOnFileHelpers.selectors.editSupplier.cardLimitBufferInput);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
