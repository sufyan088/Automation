const { test, loadRuntimeData, loginAsAdmin, closeSession, statementUploadHelpers } = require('./_shared');

test("TS_07_To_verify_the_data_on_the_Statement_Mapping_Form_section_after_uploading_the_statement_file", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Statement_Upload/TS_07_To_verify_the_data_on_the_Statement_Mapping_Form_section_after_uploading_the_statement_file.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await statementUploadHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
