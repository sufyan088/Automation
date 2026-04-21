const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_55_To_verify_the_sorting_arrows_in_the_supplier_entries_Asc", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_Lite/TS_55_To_verify_the_sorting_arrows_in_the_supplier_entries_Asc.ds"
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
