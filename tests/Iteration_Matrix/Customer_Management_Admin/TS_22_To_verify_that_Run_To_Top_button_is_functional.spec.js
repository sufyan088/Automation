const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_22_To_verify_that_Run_To_Top_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_22_To_verify_that_Run_To_Top_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Customer Management page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
  });

  await test.step('Scroll down and return to top', async () => {
    await customerManagementAdminHelpers.scrollDown(page, 800);
    await customerManagementAdminHelpers.clickReturnToTop(page);
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
    await customerManagementAdminHelpers.verifyAdminLandingPage(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
