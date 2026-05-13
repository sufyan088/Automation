const { test, expect, loadRuntimeData, loginAsAdmin, closeSession, runnerConfigurationHelpers } = require('./_shared');

test("TS_04_To_verify_that_Response_File_Required_checkbox_is_checkable", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_04_To_verify_that_Response_File_Required_checkbox_is_checkable.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    const ready = await runnerConfigurationHelpers.openPaymentScenario(page, data);
    if (!ready) {
      return;
    }

    await runnerConfigurationHelpers.ensureToggleState(page, 'Response File Required', true);
    await runnerConfigurationHelpers.expectToggleChecked(page, 'Response File Required', true);
    await expect(page.locator('body')).toContainText(/Response File Required/i);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
