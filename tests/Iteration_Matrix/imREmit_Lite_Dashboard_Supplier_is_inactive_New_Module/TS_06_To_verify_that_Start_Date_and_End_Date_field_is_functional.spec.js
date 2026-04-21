const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_06_To_verify_that_Start_Date_and_End_Date_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Supplier_is_inactive_New_Module/TS_06_To_verify_that_Start_Date_and_End_Date_field_is_functional.ds"
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
