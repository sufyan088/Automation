const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_81_To_verify_that_Refresh_button_is_functional_on_Viewing_Payment_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_New/TS_81_To_verify_that_Refresh_button_is_functional_on_Viewing_Payment_page.ds"
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
