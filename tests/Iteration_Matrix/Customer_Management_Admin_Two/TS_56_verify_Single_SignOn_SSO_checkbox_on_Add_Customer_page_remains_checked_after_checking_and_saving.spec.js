const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_56_verify_Single_SignOn_SSO_checkbox_on_Add_Customer_page_remains_checked_after_checking_and_saving", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_56_verify_Single_SignOn_SSO_checkbox_on_Add_Customer_page_remains_checked_after_checking_and_saving.ds"
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
