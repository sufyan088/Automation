const { test, expect, loadRuntimeData, loginAsAdmin, closeSession, runnerConfigurationHelpers } = require('./_shared');

test("TS_14_To_verify_when_Enable_Multi_Account_Supplier_Logic_toggle_is_ON_leaving_Supplier_ID_blank_triggers_validation_error", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_14_To_verify_when_Enable_Multi_Account_Supplier_Logic_toggle_is_ON_leaving_Supplier_ID_blank_triggers_validation_error.ds"
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
    await runnerConfigurationHelpers.fillFieldByLabel(page, 'Multi-Account Supplier ID', '');
    await runnerConfigurationHelpers.persistCurrentRunnerConfig(page, 'Payment');
    await expect(page.locator('body')).toContainText(/supplier id.+required|required.+supplier id/i);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
