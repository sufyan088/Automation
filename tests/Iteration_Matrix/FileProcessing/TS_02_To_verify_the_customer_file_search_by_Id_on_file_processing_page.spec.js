const { test, loadRuntimeData, loginAsAdmin, closeSession, fileprocessingHelpers } = require('./_shared');

test("TS_02_To_verify_the_customer_file_search_by_Id_on_file_processing_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/FileProcessing/TS_02_To_verify_the_customer_file_search_by_Id_on_file_processing_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await fileprocessingHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
