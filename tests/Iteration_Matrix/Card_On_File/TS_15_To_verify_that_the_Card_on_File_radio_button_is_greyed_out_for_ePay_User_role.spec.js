const { test, loadRuntimeData, loginAsRole, closeSession, cardOnFileHelpers } = require('./_shared');

test("TS_15_To_verify_that_the_Card_on_File_radio_button_is_greyed_out_for_ePay_User_role", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_15_To_verify_that_the_Card_on_File_radio_button_is_greyed_out_for_ePay_User_role.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsRole(page, data, 'ePayUser');
  });

  await test.step('Run converted flow', async () => {
    await cardOnFileHelpers.openSupplierManagementForCustomer(page, 'Cadent');
    await cardOnFileHelpers.openEditSupplierDetails(page, 'CardOnFile');
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.expectRadioDisabled(page, cardOnFileHelpers.selectors.editSupplier.cardOnFile);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
