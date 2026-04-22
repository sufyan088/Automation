const { test, loadRuntimeData, loginAsAdmin, closeSession, cardOnFileHelpers } = require('./_shared');

test("TS_04_To_verify_that_the_Management_role_has_the_ability_to_select_Single_Use_Card_or_Card_on_File", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_04_To_verify_that_the_Management_role_has_the_ability_to_select_Single_Use_Card_or_Card_on_File.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await cardOnFileHelpers.openSupplierManagementForCustomer(page, 'Cadent');
    await cardOnFileHelpers.openEditSupplierDetails(page, 'CardOnFile');
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.expectVisible(page, cardOnFileHelpers.selectors.editSupplier.cardTypeLabel);
    await cardOnFileHelpers.expectRadioEnabled(page, cardOnFileHelpers.selectors.editSupplier.singleUseCard);
    await cardOnFileHelpers.expectRadioEnabled(page, cardOnFileHelpers.selectors.editSupplier.cardOnFile);
    await cardOnFileHelpers.selectCardOnFile(page);
    await cardOnFileHelpers.selectSingleUseCard(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
