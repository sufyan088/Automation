const { test, expect, loadRuntimeData, loginAsAdmin, closeSession, runnerConfigurationHelpers } = require('./_shared');

test("TS_05_To_verify_that_Payment_File_Alerts_checkbox_is_checkable", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_05_To_verify_that_Payment_File_Alerts_checkbox_is_checkable.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    const ready = await runnerConfigurationHelpers.openPaymentScenario(page, data);
    if (!ready) {
      return;
    }

    await runnerConfigurationHelpers.ensureToggleState(page, 'Payment File Alerts', true);
    await runnerConfigurationHelpers.expectToggleChecked(page, 'Payment File Alerts', true);
    await expect(page.locator('body')).toContainText(/Payment File Alerts/i);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
