const {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminHelpers
} = require('./_shared');

test("TS_36_To_verify_that_customer_details_can_be_updated", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin/TS_36_To_verify_that_customer_details_can_be_updated.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminHelpers.openModule(page);
    await customerManagementAdminHelpers.openAdminSection(page, 'customerManagement');
    await customerManagementAdminHelpers.searchAllCustomers(page, 'Test Customer 077');
    await customerManagementAdminHelpers.expectTableContainsText(page, 'Test Customer 077');
    await customerManagementAdminHelpers.openFirstRowActionsMenu(page);
    await customerManagementAdminHelpers.clickVisibleText(page, 'Edit Customer Details');
    await page.waitForURL((url) => /\/app\/admin\/customer-management\/[^/]+\/edit$/.test(url.pathname), {
      timeout: 15000
    });
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
