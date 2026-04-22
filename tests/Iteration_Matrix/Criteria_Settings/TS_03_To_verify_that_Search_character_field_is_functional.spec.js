const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_03_To_verify_that_Search_character_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_03_To_verify_that_Search_character_field_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Search by character value', async () => {
    await criteriaSettingsHelpers.searchCharacter(page, '45');
    await criteriaSettingsHelpers.expectSearchFieldValue(page, 'character', '45');
    await criteriaSettingsHelpers.expectTableContainsText(page, '45');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
