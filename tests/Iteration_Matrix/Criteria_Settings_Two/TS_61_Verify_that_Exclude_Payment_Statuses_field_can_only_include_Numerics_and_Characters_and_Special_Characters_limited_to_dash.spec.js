const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_61_Verify_that_Exclude_Payment_Statuses_field_can_only_include_Numerics_and_Characters_and_Special_Characters_limited_to_dash", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_Two/TS_61_Verify_that_Exclude_Payment_Statuses_field_can_only_include_Numerics_and_Characters_and_Special_Characters_limited_to_dash.ds"
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
