const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_62_To_verify_Script_Options_is_visible_after_selecting_Yes_from_the_supplier_script_flag", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_New/TS_62_To_verify_Script_Options_is_visible_after_selecting_Yes_from_the_supplier_script_flag.ds"
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
