const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_18_To_verify_that_the_Card_Limit_Buffer_field_is_mandatory", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_18_To_verify_that_the_Card_Limit_Buffer_field_is_mandatory.ds"
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
