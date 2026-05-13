const { test, loadRuntimeData, loginAsAdmin, closeSession, customerManagementAdminTwoHelpers } = require('./_shared');

test("TS_72_To_verify_that_when_we_select_the_Country_following_fields_are_shown_enabled", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_72_To_verify_that_when_we_select_the_Country_following_fields_are_shown_enabled.ds"
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
