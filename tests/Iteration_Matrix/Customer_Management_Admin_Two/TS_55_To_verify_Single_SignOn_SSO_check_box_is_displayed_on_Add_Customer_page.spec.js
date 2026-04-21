const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_55_To_verify_Single_SignOn_SSO_check_box_is_displayed_on_Add_Customer_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_55_To_verify_Single_SignOn_SSO_check_box_is_displayed_on_Add_Customer_page.ds"
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
