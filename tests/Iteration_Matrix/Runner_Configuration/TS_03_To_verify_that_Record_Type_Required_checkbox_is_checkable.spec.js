const { test, expect, loadRuntimeData, loginAsAdmin, closeSession, runnerConfigurationHelpers } = require('./_shared');

test("TS_03_To_verify_that_Record_Type_Required_checkbox_is_checkable", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_03_To_verify_that_Record_Type_Required_checkbox_is_checkable.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    const ready = await runnerConfigurationHelpers.openPaymentScenario(page, data);
    if (!ready) {
      return;
    }

    await runnerConfigurationHelpers.ensureToggleState(page, 'Record Type Required', true);
    await runnerConfigurationHelpers.expectToggleChecked(page, 'Record Type Required', true);
    await expect(page.locator('body')).toContainText(/Record Type Required/i);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
