const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminNmHelpers
} = require('./_shared');

test("TS_101_To_verify_Bank_is_shown_on_View_Customer_Details_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_101_To_verify_Bank_is_shown_on_View_Customer_Details_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    const { customerName } = await customerManagementAdminNmHelpers.createLiteCustomerWithAssociations(page, data, {
      bankName: 'Union Trust Bank',
      fallbackBanks: ['Unidentified']
    });

    await customerManagementAdminNmHelpers.expectCustomerRowContains(page, customerName, 'Union Trust Bank');
    await customerManagementAdminNmHelpers.viewCustomerProfile(page, customerName);
    await customerManagementAdminNmHelpers.expectViewProfileBank(page, 'Union Trust Bank');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
