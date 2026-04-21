const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_29_To_verify_that_Updated_Date_field_is_functional_on_Advance_Search_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Master_List/TS_29_To_verify_that_Updated_Date_field_is_functional_on_Advance_Search_popup.ds"
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
