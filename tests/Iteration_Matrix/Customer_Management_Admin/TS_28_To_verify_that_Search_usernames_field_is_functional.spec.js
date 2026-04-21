const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminHelpers
} = require('./_shared');

test("TS_28_To_verify_that_Search_usernames_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_28_To_verify_that_Search_usernames_field_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'userManagement');
    const searchInput = await customerManagementAdminHelpers.searchUsernames(page, 'asad');
    await test.expect(searchInput).toHaveValue('asad');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
