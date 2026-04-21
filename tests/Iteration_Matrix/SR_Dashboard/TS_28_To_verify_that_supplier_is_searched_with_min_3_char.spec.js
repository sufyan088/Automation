const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_28_To_verify_that_supplier_is_searched_with_min_3_char", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Dashboard/TS_28_To_verify_that_supplier_is_searched_with_min_3_char.ds"
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
