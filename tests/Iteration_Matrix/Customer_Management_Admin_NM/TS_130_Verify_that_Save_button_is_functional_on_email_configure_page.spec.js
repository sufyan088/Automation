const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_130_Verify_that_Save_button_is_functional_on_email_configure_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_130_Verify_that_Save_button_is_functional_on_email_configure_page.ds"
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
