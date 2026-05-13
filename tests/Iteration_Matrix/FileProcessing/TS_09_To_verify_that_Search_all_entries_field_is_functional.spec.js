const { test, loadRuntimeData, loginAsAdmin, closeSession, fileprocessingHelpers } = require('./_shared');

test("TS_09_To_verify_that_Search_all_entries_field_is_functional ", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/FileProcessing/TS_09_To_verify_that_Search_all_entries_field_is_functional .ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await fileprocessingHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
