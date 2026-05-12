const { test, loadRuntimeData, loginAsAdmin, closeSession, fileprocessingHelpers } = require('./_shared');

test("TS_08_To_Verify_That_Pagination_Button_Is_Functional ", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/FileProcessing/TS_08_To_Verify_That_Pagination_Button_Is_Functional .ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await fileprocessingHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
