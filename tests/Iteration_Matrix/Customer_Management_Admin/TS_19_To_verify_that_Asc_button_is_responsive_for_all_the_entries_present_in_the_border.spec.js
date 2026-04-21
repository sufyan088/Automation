const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_19_To_verify_that_Asc_button_is_responsive_for_all_the_entries_present_in_the_border", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_19_To_verify_that_Asc_button_is_responsive_for_all_the_entries_present_in_the_border.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Customer Management page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
  });

  await test.step('Open Customer Name menu and choose Ascending', async () => {
    await customerManagementAdminHelpers.openTableHeaderMenu(page, 'Customer Name');
    await customerManagementAdminHelpers.verifyVisibleText(page, 'Ascending');
    await customerManagementAdminHelpers.clickVisibleText(page, 'Ascending');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
