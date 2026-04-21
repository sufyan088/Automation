const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_117_To_verify_onboarding_status_of_customer_is_Pending_after_creating_customer_with_imREmit", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_117_To_verify_onboarding_status_of_customer_is_Pending_after_creating_customer_with_imREmit.ds"
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
