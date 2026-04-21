const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TC_11_To_verify_that_the_edit_button_is_functional_on_the_edit_supplier_script_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Script_Management_imREmit/TC_11_To_verify_that_the_edit_button_is_functional_on_the_edit_supplier_script_page.ds"
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
