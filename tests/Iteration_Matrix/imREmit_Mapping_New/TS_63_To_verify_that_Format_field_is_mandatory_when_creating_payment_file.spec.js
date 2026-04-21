const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_63_To_verify_that_Format_field_is_mandatory_when_creating_payment_file", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Mapping_New/TS_63_To_verify_that_Format_field_is_mandatory_when_creating_payment_file.ds"
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
