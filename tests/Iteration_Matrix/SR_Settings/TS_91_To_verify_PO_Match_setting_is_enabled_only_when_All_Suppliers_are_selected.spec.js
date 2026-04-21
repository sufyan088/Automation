const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_91_To_verify_PO_Match_setting_is_enabled_only_when_All_Suppliers_are_selected", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_91_To_verify_PO_Match_setting_is_enabled_only_when_All_Suppliers_are_selected.ds"
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
