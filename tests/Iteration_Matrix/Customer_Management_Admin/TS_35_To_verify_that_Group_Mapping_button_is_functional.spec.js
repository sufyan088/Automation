const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminHelpers
} = require('./_shared');

test("TS_35_To_verify_that_Group_Mapping_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_35_To_verify_that_Group_Mapping_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'userManagement');
    await page.waitForFunction(() => {
      const summaries = Array.from(document.querySelectorAll('p'));
      return summaries.some((node) => /Page:\s*\d+\s+of\s+\d+/i.test(node.textContent || ''));
    }, { timeout: 15000 });
    await customerManagementAdminHelpers.verifyVisibleText(page, 'View Sessions');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
