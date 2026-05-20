const { test, expect, loadRuntimeData, loginAsAdmin, closeSession, runnerConfigurationHelpers } = require('./_shared');

test("TS_10_verify_when_Enable_Multi_Account_Supplier_Logic_toggle_is_ON_Multi_Account_Supplier_ID_field_is_visible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_10_verify_when_Enable_Multi_Account_Supplier_Logic_toggle_is_ON_Multi_Account_Supplier_ID_field_is_visible.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    const ready = await runnerConfigurationHelpers.openPaymentScenario(page, data);
    if (!ready) {
      return;
    }

    await runnerConfigurationHelpers.ensureToggleState(page, 'Enable Multi Account Supplier Logic', true);
    await runnerConfigurationHelpers.expectFieldVisible(page, 'Multi-Account Supplier ID', true);
    await expect(page.locator('body')).toContainText(/Multi-Account Supplier ID/i);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
