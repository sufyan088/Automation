const { test, loadRuntimeData, loginAsRole, closeSession, cardOnFileHelpers } = require('./_shared');

test("TS_17_To_verify_that_the_Flag_Reset_button_is_not_visible_to_ePay_User_role", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_17_To_verify_that_the_Flag_Reset_button_is_not_visible_to_ePay_User_role.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsRole(page, data, 'ePayUser');
  });

  await test.step('Run converted flow', async () => {
    await cardOnFileHelpers.openSupplierManagementForCustomer(page, 'Cadent');
    await cardOnFileHelpers.openEditSupplierDetails(page, 'CardOnFile');
    await cardOnFileHelpers.ensureSupplierEnrollmentYes(page);
    await cardOnFileHelpers.expectFlagResetNotVisible(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
