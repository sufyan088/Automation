const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_57_To_verify_that_description_of_Exclude_Payment_Statuses_should_be_correct", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_Two/TS_57_To_verify_that_description_of_Exclude_Payment_Statuses_should_be_correct.ds"
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
