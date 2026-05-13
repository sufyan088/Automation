const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminNmHelpers } = require('./_shared');

test("TS_107_To_verify_the_Edit_button_is_functional_on_the_customer_profile_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_107_To_verify_the_Edit_button_is_functional_on_the_customer_profile_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    const createdCustomer = await customerManagementAdminNmHelpers.createLiteCustomerWithAssociations(page, data);
    const nextContactName = 'Profile Edit Name';

    await customerManagementAdminNmHelpers.updateCustomerFromProfile(page, createdCustomer.customerName, nextContactName);
    await customerManagementAdminNmHelpers.expectCustomerContactNameAfterProfileEdit(page, createdCustomer.customerName, nextContactName);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
