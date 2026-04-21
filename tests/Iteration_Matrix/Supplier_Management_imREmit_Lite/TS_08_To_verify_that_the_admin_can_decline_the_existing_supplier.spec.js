const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_08_To_verify_that_the_admin_can_decline_the_existing_supplier", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_Lite/TS_08_To_verify_that_the_admin_can_decline_the_existing_supplier.ds"
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
