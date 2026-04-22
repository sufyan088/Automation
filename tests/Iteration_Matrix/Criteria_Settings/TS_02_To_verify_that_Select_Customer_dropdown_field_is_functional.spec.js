const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_02_To_verify_that_Select_Customer_dropdown_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_02_To_verify_that_Select_Customer_dropdown_field_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
  });

  await test.step('Select customer from dropdown', async () => {
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
