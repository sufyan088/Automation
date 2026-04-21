const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_58_To_Verify_that_after_clicking_Add_Criteria_button_for_Exclude_Payment_Statuses", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_Two/TS_58_To_Verify_that_after_clicking_Add_Criteria_button_for_Exclude_Payment_Statuses.ds"
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
