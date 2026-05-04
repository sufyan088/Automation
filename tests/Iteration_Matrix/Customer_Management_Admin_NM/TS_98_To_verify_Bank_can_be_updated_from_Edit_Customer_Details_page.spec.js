const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminNmHelpers,
  customerManagementAdminNmSelectors
} = require('./_shared');

test("TS_98_To_verify_Bank_can_be_updated_from_Edit_Customer_Details_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_98_To_verify_Bank_can_be_updated_from_Edit_Customer_Details_page.ds"
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
    await customerManagementAdminNmHelpers.editCustomerBank(page, customerName, 'First American Bank', ['Union Trust Bank']);
    await customerManagementAdminNmHelpers.expectCustomerRowContains(page, customerName, 'First American Bank');
  });
  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
