const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_70_To_verify_the_Supplier_Script_Flag_Yes_for_Automation_Pay_by_web_payments", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_Lite/TS_70_To_verify_the_Supplier_Script_Flag_Yes_for_Automation_Pay_by_web_payments.ds"
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
