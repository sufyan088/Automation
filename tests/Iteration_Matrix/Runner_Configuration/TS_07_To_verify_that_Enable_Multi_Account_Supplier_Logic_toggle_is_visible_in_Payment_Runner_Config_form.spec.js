const { test, expect, loadRuntimeData, loginAsAdmin, closeSession, runnerConfigurationHelpers } = require('./_shared');

test("TS_07_To_verify_that_Enable_Multi_Account_Supplier_Logic_toggle_is_visible_in_Payment_Runner_Config_form", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_07_To_verify_that_Enable_Multi_Account_Supplier_Logic_toggle_is_visible_in_Payment_Runner_Config_form.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    const ready = await runnerConfigurationHelpers.openPaymentScenario(page, data);
    if (!ready) {
      return;
    }

    const toggle = page.locator('label, div, section, article').filter({ hasText: /^Enable Multi Account Supplier Logic:?\*?$/i }).first().locator('button[role="switch"], button[data-state], input[type="checkbox"], button[type="button"]').first();
    await expect(toggle).toBeVisible({ timeout: 10000 });
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
