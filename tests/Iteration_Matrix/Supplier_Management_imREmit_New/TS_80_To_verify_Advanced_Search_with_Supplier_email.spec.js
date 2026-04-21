const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_80_To_verify_Advanced_Search_with_Supplier_email", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_New/TS_80_To_verify_Advanced_Search_with_Supplier_email.ds"
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
