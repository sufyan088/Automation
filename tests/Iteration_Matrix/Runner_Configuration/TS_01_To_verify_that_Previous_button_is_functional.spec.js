const { test, loadRuntimeData, loginAsAdmin, closeSession, runnerConfigurationHelpers } = require('./_shared');

test("TS_01_To_verify_that_Previous_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_01_To_verify_that_Previous_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    const ready = await runnerConfigurationHelpers.openModule(page, data);
    if (!ready) {
      return;
    }

    await runnerConfigurationHelpers.clickWizardPrevious(page);
    await expect(page.getByRole('heading', { name: 'Participant Register', exact: true })).toBeVisible({ timeout: 15000 });
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
