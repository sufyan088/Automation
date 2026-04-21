const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_58_To_verify_that_the_supplier_enrolled_can_be_Declined", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_New/TS_58_To_verify_that_the_supplier_enrolled_can_be_Declined.ds"
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
