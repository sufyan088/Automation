const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_56_To_verify_the_status_of_the_declined_suppliers", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_New/TS_56_To_verify_the_status_of_the_declined_suppliers.ds"
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
