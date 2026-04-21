const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_62_To_Verify_that_Exclude_Payment_Statuses_field_should_accepts_more_than_one_payment_status", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_Two/TS_62_To_Verify_that_Exclude_Payment_Statuses_field_should_accepts_more_than_one_payment_status.ds"
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
