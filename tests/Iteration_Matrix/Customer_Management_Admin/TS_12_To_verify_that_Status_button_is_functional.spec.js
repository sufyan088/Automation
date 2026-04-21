const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_12_To_verify_that_Status_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_12_To_verify_that_Status_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Customer Management page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
  });

  await test.step('Open Status filter and select values', async () => {
    await customerManagementAdminHelpers.openFilterButton(page, 'status');
    await customerManagementAdminHelpers.clickVisibleText(page, 'Active');
    await customerManagementAdminHelpers.clickVisibleText(page, 'Pending');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
