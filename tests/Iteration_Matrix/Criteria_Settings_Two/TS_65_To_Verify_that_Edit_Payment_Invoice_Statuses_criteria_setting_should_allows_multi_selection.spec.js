const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_65_To_Verify_that_Edit_Payment_Invoice_Statuses_criteria_setting_should_allows_multi_selection", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_Two/TS_65_To_Verify_that_Edit_Payment_Invoice_Statuses_criteria_setting_should_allows_multi_selection.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
