const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminTwoHelpers } = require('./_shared');

test("TS_63_To_verify_that_Enable_Zero_Dollar_Payment_Checkbox_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_63_To_verify_that_Enable_Zero_Dollar_Payment_Checkbox_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerManagementAdminTwoHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
