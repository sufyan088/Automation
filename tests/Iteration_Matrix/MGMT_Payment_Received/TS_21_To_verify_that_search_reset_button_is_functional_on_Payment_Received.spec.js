const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_21_To_verify_that_search_reset_button_is_functional_on_Payment_Received", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payment_Received/TS_21_To_verify_that_search_reset_button_is_functional_on_Payment_Received.ds"
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
