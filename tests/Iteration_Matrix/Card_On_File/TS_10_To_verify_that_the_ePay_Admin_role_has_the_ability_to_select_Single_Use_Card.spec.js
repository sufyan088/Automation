const { test, loadRuntimeData, loginAsRole, closeSession, cardOnFileHelpers } = require('./_shared');

test("TS_10_To_verify_that_the_ePay_Admin_role_has_the_ability_to_select_Single_Use_Card", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_10_To_verify_that_the_ePay_Admin_role_has_the_ability_to_select_Single_Use_Card.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsRole(page, data, 'ePayAdmin');
  });

  await test.step('Run converted flow', async () => {
    await cardOnFileHelpers.openSupplierManagementForCustomer(page, 'Cadent');
    const supplier = await cardOnFileHelpers.createSupplier(page, { supplierName: `CofEpayAdmin${Date.now()}` });
    await cardOnFileHelpers.openEditSupplierDetails(page, supplier.supplierName);
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.expectRadioEnabled(page, cardOnFileHelpers.selectors.editSupplier.singleUseCard);
    await cardOnFileHelpers.expectRadioDisabled(page, cardOnFileHelpers.selectors.editSupplier.cardOnFile);
    await cardOnFileHelpers.selectSingleUseCard(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
