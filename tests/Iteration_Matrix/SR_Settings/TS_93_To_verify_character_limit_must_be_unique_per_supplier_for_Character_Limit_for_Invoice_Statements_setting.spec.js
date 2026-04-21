const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_93_To_verify_character_limit_must_be_unique_per_supplier_for_Character_Limit_for_Invoice_Statements_setting", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_93_To_verify_character_limit_must_be_unique_per_supplier_for_Character_Limit_for_Invoice_Statements_setting.ds"
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
