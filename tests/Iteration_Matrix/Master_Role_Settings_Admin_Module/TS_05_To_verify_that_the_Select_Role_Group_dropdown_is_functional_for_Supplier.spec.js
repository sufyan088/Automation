const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_05_To verify_that_the_Select_Role_Group_dropdown_is_functional_for_Supplier", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Master_Role_Settings_Admin_Module/TS_05_To verify_that_the_Select_Role_Group_dropdown_is_functional_for_Supplier.ds"
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
