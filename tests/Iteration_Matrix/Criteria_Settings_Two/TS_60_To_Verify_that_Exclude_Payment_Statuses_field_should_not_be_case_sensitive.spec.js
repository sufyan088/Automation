const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_60_To_Verify_that_Exclude_Payment_Statuses_field_should_not_be_case_sensitive", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_Two/TS_60_To_Verify_that_Exclude_Payment_Statuses_field_should_not_be_case_sensitive.ds"
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
