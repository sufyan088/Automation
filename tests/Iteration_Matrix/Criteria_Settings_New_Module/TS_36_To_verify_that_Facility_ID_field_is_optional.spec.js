const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_36_To_verify_that_Facility_ID_field_is_optional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_New_Module/TS_36_To_verify_that_Facility_ID_field_is_optional.ds"
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
