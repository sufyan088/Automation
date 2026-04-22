const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_24_To_verify_that_the_Credit_pair_Logic_criteria_settings_can_be_added", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_24_To_verify_that_the_Credit_pair_Logic_criteria_settings_can_be_added.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Open Credit pair Logic criteria dialog', async () => {
    await criteriaSettingsHelpers.openCriteriaCardAction(page, 'Matched Credit Logic', 'Edit Criteria');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
