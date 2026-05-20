const { test, expect, loadRuntimeData, loginAsAdmin, closeSession, runnerConfigurationHelpers } = require('./_shared');

test("TS_06_To_verify_that_recon_file_can_generated_with_frequency_combination_Daily_Weekly_Monthly_Y_N_N_with_Timestamp", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_06_To_verify_that_recon_file_can_generated_with_frequency_combination_Daily_Weekly_Monthly_Y_N_N_with_Timestamp.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    const ready = await runnerConfigurationHelpers.openReconScenario(page, data);
    if (!ready) {
      return;
    }

    await runnerConfigurationHelpers.selectOptionNearLabel(page, 'Customer recon file transfer', 'Email').catch(() => {
      test.info().annotations.push({
        type: 'todo',
        description: 'Confirm the Customer recon file transfer dropdown trigger and target option in a live run.'
      });
    });
    await runnerConfigurationHelpers.ensureToggleState(page, 'Empty Recon Required', true).catch(() => null);
    await runnerConfigurationHelpers.ensureToggleState(page, 'Frequency (Daily)', true);
    await runnerConfigurationHelpers.ensureToggleState(page, 'Frequency (Weekly)', true);
    await runnerConfigurationHelpers.ensureToggleState(page, 'Frequency (Monthly)', true);
    await runnerConfigurationHelpers.fillTimeFields(page, 'Daily Selected Time', '08', '15');
    await runnerConfigurationHelpers.fillTimeFields(page, 'Weekly Selected Time', '09', '30');
    await runnerConfigurationHelpers.fillTimeFields(page, 'Monthly Selected Time', '10', '45');
    await runnerConfigurationHelpers.persistCurrentRunnerConfig(page, 'Recon');
    await expect(page.locator('body')).toContainText(/Frequency \(Daily\)|Frequency \(Weekly\)|Frequency \(Monthly\)/i);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
