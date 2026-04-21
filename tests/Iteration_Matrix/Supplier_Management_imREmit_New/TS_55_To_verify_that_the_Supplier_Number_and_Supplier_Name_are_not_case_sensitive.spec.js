const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_55_To_verify_that_the_Supplier_Number_and_Supplier_Name_are_not_case_sensitive", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_New/TS_55_To_verify_that_the_Supplier_Number_and_Supplier_Name_are_not_case_sensitive.ds"
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
