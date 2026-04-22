const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_04_To_verify_that_the_Search_all_entries_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_04_To_verify_that_the_Search_all_entries_field_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Search across all entries', async () => {
    await criteriaSettingsHelpers.searchAllEntries(page, 'Recurring Payments');
    await criteriaSettingsHelpers.expectSearchFieldValue(page, 'allEntries', 'Recurring Payments');
    await criteriaSettingsHelpers.expectTableContainsText(page, 'Recurring Payments');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
