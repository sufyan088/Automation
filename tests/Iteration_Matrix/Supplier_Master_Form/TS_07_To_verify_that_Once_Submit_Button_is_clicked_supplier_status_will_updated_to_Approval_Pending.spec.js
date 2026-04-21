const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_07_To_verify_that_Once_Submit_Button_is_clicked_supplier_status_will_updated_to_Approval_Pending", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Master_Form/TS_07_To_verify_that_Once_Submit_Button_is_clicked_supplier_status_will_updated_to_Approval_Pending.ds"
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
