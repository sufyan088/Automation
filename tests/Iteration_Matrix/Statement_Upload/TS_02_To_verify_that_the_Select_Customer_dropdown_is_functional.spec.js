const { test, loadRuntimeData, loginAsAdmin, closeSession, statementUploadHelpers } = require('./_shared');

test("TS_02_To_verify_that_the_Select_Customer_dropdown_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Statement_Upload/TS_02_To_verify_that_the_Select_Customer_dropdown_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await statementUploadHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
