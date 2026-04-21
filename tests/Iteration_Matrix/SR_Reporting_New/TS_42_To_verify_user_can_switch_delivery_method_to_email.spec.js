const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_42_To_verify_user_can_switch_delivery_method_to_email", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Reporting_New/TS_42_To_verify_user_can_switch_delivery_method_to_email.ds"
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
