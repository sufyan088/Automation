const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminHelpers } = require('./_shared');

test("TS_17_To_verify_that_Column_View_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_17_To_verify_that_Column_View_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Customer Management page', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.verifySectionVisible(page, 'customerManagement');
  });

  await test.step('Open Column Order and verify visible options', async () => {
    await customerManagementAdminHelpers.openColumnOrder(page);
    await customerManagementAdminHelpers.verifyColumnOrderOptionVisible(page, 'Customer Name');
    await customerManagementAdminHelpers.verifyColumnOrderOptionVisible(page, 'Onboarding Status');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
