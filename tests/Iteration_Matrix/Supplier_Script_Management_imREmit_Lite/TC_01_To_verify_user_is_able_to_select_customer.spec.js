const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TC_01_To_verify_user_is_able_to_select_customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Script_Management_imREmit_Lite/TC_01_To_verify_user_is_able_to_select_customer.ds"
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
