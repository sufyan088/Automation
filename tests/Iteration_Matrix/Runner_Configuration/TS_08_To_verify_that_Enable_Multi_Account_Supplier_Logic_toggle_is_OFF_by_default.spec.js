const { test, expect, loadRuntimeData, loginAsAdmin, closeSession, runnerConfigurationHelpers } = require('./_shared');

test("TS_08_To_verify_that_Enable_Multi_Account_Supplier_Logic_toggle_is_OFF_by_default", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_08_To_verify_that_Enable_Multi_Account_Supplier_Logic_toggle_is_OFF_by_default.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    const ready = await runnerConfigurationHelpers.openPaymentScenario(page, data);
    if (!ready) {
      return;
    }

    await runnerConfigurationHelpers.expectToggleChecked(page, 'Enable Multi Account Supplier Logic', false);
    await expect(page.locator('body')).toContainText(/Enable Multi Account Supplier Logic/i);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
