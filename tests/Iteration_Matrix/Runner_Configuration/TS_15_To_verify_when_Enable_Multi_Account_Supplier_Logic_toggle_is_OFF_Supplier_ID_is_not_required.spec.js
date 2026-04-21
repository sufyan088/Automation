const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_15_To_verify_when_Enable_Multi_Account_Supplier_Logic_toggle_is_OFF_Supplier_ID_is_not_required", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_15_To_verify_when_Enable_Multi_Account_Supplier_Logic_toggle_is_OFF_Supplier_ID_is_not_required.ds"
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
