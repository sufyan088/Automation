const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_86_To_verify_Ignore_Leading_and_Trailing_setting_is_enabled_when_all_or_any_specific_supplier_is_selected", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_86_To_verify_Ignore_Leading_and_Trailing_setting_is_enabled_when_all_or_any_specific_supplier_is_selected.ds"
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
