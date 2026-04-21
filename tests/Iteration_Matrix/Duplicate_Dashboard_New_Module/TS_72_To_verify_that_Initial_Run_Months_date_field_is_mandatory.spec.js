const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_72_To_verify_that_Initial_Run_Months_date_field_is_mandatory", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_72_To_verify_that_Initial_Run_Months_date_field_is_mandatory.ds"
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
