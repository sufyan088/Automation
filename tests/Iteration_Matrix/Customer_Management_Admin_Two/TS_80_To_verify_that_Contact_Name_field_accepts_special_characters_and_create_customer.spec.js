const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminTwoHelpers } = require('./_shared');

test("TS_80_To_verify_that_Contact_Name_field_accepts_special_characters_and_create_customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_80_To_verify_that_Contact_Name_field_accepts_special_characters_and_create_customer.ds"
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
