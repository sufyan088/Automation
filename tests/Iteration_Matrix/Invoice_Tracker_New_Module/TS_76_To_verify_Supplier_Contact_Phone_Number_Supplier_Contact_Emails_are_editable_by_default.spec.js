const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_76_To_verify_Supplier_Contact_Phone_Number_Supplier_Contact_Emails_are_editable_by_default", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_76_To_verify_Supplier_Contact_Phone_Number_Supplier_Contact_Emails_are_editable_by_default.ds"
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
