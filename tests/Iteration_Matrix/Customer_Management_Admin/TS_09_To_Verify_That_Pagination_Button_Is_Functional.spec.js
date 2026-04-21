const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_09_To_Verify_That_Pagination_Button_Is_Functional ", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_09_To_Verify_That_Pagination_Button_Is_Functional .ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Customer Management page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
  });

  await test.step('Open pagination size menu and verify options', async () => {
    await customerManagementAdminHelpers.openPageSizeMenu(page);
    await customerManagementAdminHelpers.verifyPageSizeOptions(page, [5, 10, 25, 50, 100]);
  });

  await test.step('Select page size 10', async () => {
    await customerManagementAdminHelpers.choosePageSize(page, 10);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
