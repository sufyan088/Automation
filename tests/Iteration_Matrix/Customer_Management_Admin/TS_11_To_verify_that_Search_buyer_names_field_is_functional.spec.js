const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_11_To_verify_that_Search_buyer_names_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_11_To_verify_that_Search_buyer_names_field_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Customer Management page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
  });

  await test.step('Search by customer name', async () => {
    await customerManagementAdminHelpers.searchByCustomerName(page, 'A New Mobile Co');
    await customerManagementAdminHelpers.expectTableContainsText(page, 'A New Mobile Co');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
