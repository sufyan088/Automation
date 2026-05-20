const { test, expect, loadRuntimeData, loginAsAdmin, closeSession, runnerConfigurationHelpers } = require('./_shared');

test("TS_12_verify_when_Enable_Multi_Account_Supplier_Logic_toggle_is_ON_Multi_Account_Supplier_ID_field_is_visibleand saved", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_12_verify_when_Enable_Multi_Account_Supplier_Logic_toggle_is_ON_Multi_Account_Supplier_ID_field_is_visibleand saved.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    const ready = await runnerConfigurationHelpers.openPaymentScenario(page, data);
    if (!ready) {
      return;
    }

    const supplierId = runnerConfigurationHelpers.buildSupplierId(data);
    await runnerConfigurationHelpers.ensureToggleState(page, 'Enable Multi Account Supplier Logic', true);
    await runnerConfigurationHelpers.fillFieldByLabel(page, 'Multi-Account Supplier ID', supplierId);
    await runnerConfigurationHelpers.persistCurrentRunnerConfig(page, 'Payment');

    if (await runnerConfigurationHelpers.reopenRunnerConfigIfPossible(page, 'Payment')) {
      await runnerConfigurationHelpers.expectFieldVisible(page, 'Multi-Account Supplier ID', true);
      await expect(page.getByLabel(/^Multi-Account Supplier ID:?\*?$/i).or(page.locator('label, div, section, article').filter({ hasText: /^Multi-Account Supplier ID:?\*?$/i }).first().locator('input').first())).toHaveValue(supplierId, { timeout: 10000 });
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
