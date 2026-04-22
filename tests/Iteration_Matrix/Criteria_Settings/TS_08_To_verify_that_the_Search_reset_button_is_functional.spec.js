const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_08_To_verify_that_the_Search_reset_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_08_To_verify_that_the_Search_reset_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Apply and reset search filters', async () => {
    await criteriaSettingsHelpers.searchAllEntries(page, 'Recurring Payments');
    await criteriaSettingsHelpers.expectTableContainsText(page, 'Recurring Payments');
    await criteriaSettingsHelpers.clickResetSearchFilters(page);
    await criteriaSettingsHelpers.expectSearchFieldValue(page, 'allEntries', '');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
