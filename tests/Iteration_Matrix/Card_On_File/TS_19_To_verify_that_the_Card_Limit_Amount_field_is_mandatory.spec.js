const { test, loadRuntimeData, loginAsAdmin, closeSession, cardOnFileHelpers } = require('./_shared');

test("TS_19_To_verify_that_the_Card_Limit_Amount_field_is_mandatory", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_19_To_verify_that_the_Card_Limit_Amount_field_is_mandatory.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await cardOnFileHelpers.openSupplierManagementForCustomer(page, 'Cadent');
    await cardOnFileHelpers.openEditSupplierDetails(page, 'CardOnFile');
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.selectCardOnFile(page);
    await cardOnFileHelpers.setCardLimitAmount(page, '');
    await cardOnFileHelpers.clickSaveAndSubmit(page);
    await cardOnFileHelpers.expectValidationMessage(page, 'Card Limit Amount is required when Card on File is enabled');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
