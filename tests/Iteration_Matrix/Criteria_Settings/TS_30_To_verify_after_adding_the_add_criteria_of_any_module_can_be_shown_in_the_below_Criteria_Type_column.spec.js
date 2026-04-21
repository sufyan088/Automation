const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_30_To_verify_after_adding_the_add_criteria_of_any_module_can_be_shown_in_the_below_Criteria_Type_column", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_30_To_verify_after_adding_the_add_criteria_of_any_module_can_be_shown_in_the_below_Criteria_Type_column.ds"
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
