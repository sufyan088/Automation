const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_10_To_verify_that_supplier_details_are_shown_when_supplier_enrollment_checkbox_is_checked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_(Premium)/TS_10_To_verify_that_supplier_details_are_shown_when_supplier_enrollment_checkbox_is_checked.ds"
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
