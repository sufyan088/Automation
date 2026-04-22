const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_07_To_verify_that_the_Pagination_dropdown_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_07_To_verify_that_the_Pagination_dropdown_field_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Open pagination menu and verify sizes', async () => {
    await criteriaSettingsHelpers.openPageSizeMenu(page);
    await criteriaSettingsHelpers.verifyPageSizeOptions(page, [5, 10, 25, 50, 100]);
  });

  await test.step('Select page size 50', async () => {
    await criteriaSettingsHelpers.choosePageSize(page, 50);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
