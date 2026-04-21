const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_06_To_verify_the_Add_Grouping_button_is_functional_on_the_Create_supplier_grouping_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Statement_Upload/TS_06_To_verify_the_Add_Grouping_button_is_functional_on_the_Create_supplier_grouping_popup.ds"
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
