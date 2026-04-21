const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_52_To_verify_after_the_Supplier_Name_field_space_does_not_allowed", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_New/TS_52_To_verify_after_the_Supplier_Name_field_space_does_not_allowed.ds"
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
