const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminTwoHelpers } = require('./_shared');

test("TS_60_To_verify_that_Payment_Groups_field_shows_all_Facility_Name_for_relevant_customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_60_To_verify_that_Payment_Groups_field_shows_all_Facility_Name_for_relevant_customer.ds"
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
