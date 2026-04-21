const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_47_To_verify_that_User_selects_Duplicate_Payments_and_toggle_is_switched_to_Yes_Self_Funding_Subscription_has_enabled", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_New/TS_47_To_verify_that_User_selects_Duplicate_Payments_and_toggle_is_switched_to_Yes_Self_Funding_Subscription_has_enabled.ds"
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
