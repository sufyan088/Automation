const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_09_To_verify_that_Supplier_Enrollment_checkbox_is_visible_and_unchecked_by_default", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_(Premium)/TS_09_To_verify_that_Supplier_Enrollment_checkbox_is_visible_and_unchecked_by_default.ds"
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
