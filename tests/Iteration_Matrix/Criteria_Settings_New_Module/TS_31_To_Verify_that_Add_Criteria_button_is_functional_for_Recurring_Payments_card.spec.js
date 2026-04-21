const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_31_To_Verify_that_Add_Criteria_button_is_functional_for_Recurring_Payments_card", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_New_Module/TS_31_To_Verify_that_Add_Criteria_button_is_functional_for_Recurring_Payments_card.ds"
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
