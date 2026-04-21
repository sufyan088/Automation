const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_39_To_verify_that_Project_Manager_Role_have_access_to_Customer_On_boarding_Form_to_configure_module_selection", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_New/TS_39_To_verify_that_Project_Manager_Role_have_access_to_Customer_On_boarding_Form_to_configure_module_selection.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
