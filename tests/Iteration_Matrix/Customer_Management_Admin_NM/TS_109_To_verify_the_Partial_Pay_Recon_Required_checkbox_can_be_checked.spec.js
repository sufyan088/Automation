const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminNmHelpers } = require('./_shared');

test("TS_109_To_verify_the_Partial_Pay_Recon_Required_checkbox_can_be_checked", async ({ page }) => {
  const data = loadRuntimeData();
  test.setTimeout(180000);
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_109_To_verify_the_Partial_Pay_Recon_Required_checkbox_can_be_checked.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminNmHelpers.expectRunnerCheckboxChecked(page, 'Customertest0100', 'Partial Pay Recon Required');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
