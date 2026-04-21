const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_56_To_verify_that_Exclude_Payment_Statuses_field_should_placed_after_Exclude_Invoice_Statuses", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_Two/TS_56_To_verify_that_Exclude_Payment_Statuses_field_should_placed_after_Exclude_Invoice_Statuses.ds"
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
