const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_07_To_verify_that_Go_to_previous_page_button_is_functional ", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_07_To_verify_that_Go_to_previous_page_button_is_functional .ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Customer Management page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
  });

  await test.step('Go to previous page', async () => {
    const pagination = await customerManagementAdminHelpers.readPaginationState(page);
    await customerManagementAdminHelpers.clickPaginationButton(page, 'nextPage');
    await customerManagementAdminHelpers.expectPageNumber(page, pagination.currentPage + 1);
    await customerManagementAdminHelpers.clickPaginationButton(page, 'previousPage');
    await customerManagementAdminHelpers.expectPageNumber(page, pagination.currentPage);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
