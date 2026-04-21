const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_10_To_verify_that _Search _Supplier_Name_or_ID_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Mangement/TS_10_To_verify_that _Search _Supplier_Name_or_ID_field_is_functional.ds"
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
