const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_100_To_verify_when_imREmit_is_selected_from_module_selection_Parent_Customer_and_Bank_dropdown_fields_are_NOT_visible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_100_To_verify_when_imREmit_is_selected_from_module_selection_Parent_Customer_and_Bank_dropdown_fields_are_NOT_visible.ds"
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
