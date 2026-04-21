const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_106_To_verify_Program_Manager_role_can_add_edit_new_banks", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_106_To_verify_Program_Manager_role_can_add_edit_new_banks.ds"
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
