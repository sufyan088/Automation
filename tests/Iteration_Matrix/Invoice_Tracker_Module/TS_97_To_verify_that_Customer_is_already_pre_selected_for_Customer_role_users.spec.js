const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_97_To_verify_that_Customer_is_already_pre_selected_for_Customer_role_users", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_Module/TS_97_To_verify_that_Customer_is_already_pre_selected_for_Customer_role_users.ds"
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
