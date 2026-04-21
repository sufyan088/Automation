const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_74_To_verify_the_status_of_the_supplier_after_Approve_with_Supplier_Enrollment_No", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_Lite/TS_74_To_verify_the_status_of_the_supplier_after_Approve_with_Supplier_Enrollment_No.ds"
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
