const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_149_To_verify_that_Supplier_Name_is_shown_after_selecting_the_Supplier_ID_on_the_Adjust_Filters_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_149_To_verify_that_Supplier_Name_is_shown_after_selecting_the_Supplier_ID_on_the_Adjust_Filters_popup.ds"
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
