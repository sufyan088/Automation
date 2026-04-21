const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_21_To_verify_that_Hide_button_is_responsive_for_the_entries_present_in_the_border", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_21_To_verify_that_Hide_button_is_responsive_for_the_entries_present_in_the_border.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Customer Management page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
  });

  await test.step('Hide Program Manager Assigned column', async () => {
    await customerManagementAdminHelpers.openTableHeaderMenu(page, 'Program Manager Assigned');
    await customerManagementAdminHelpers.verifyVisibleText(page, 'Hide column');
    await customerManagementAdminHelpers.clickVisibleText(page, 'Hide column');
    await customerManagementAdminHelpers.verifyTableHeaderHidden(page, 'Program Manager Assigned');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
