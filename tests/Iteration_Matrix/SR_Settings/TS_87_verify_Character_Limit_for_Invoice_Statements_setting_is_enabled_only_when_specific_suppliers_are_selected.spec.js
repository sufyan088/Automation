const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_87_verify_Character_Limit_for_Invoice_Statements_setting_is_enabled_only_when_specific_suppliers_are_selected", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_87_verify_Character_Limit_for_Invoice_Statements_setting_is_enabled_only_when_specific_suppliers_are_selected.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
