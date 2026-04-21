const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_19_To_verify_that_Comment_can_be_added_to_View_Supplier_Master_Record_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Master_Form/TS_19_To_verify_that_Comment_can_be_added_to_View_Supplier_Master_Record_page.ds"
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
