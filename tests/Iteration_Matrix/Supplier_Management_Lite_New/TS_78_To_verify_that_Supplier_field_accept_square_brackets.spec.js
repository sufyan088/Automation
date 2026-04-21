const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_78_To_verify_that_Supplier_field_accept_square_brackets", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_Lite_New/TS_78_To_verify_that_Supplier_field_accept_square_brackets.ds"
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
