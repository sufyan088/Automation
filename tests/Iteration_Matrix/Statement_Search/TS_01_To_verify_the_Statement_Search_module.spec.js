const { test, loadRuntimeData, loginAsAdmin, closeSession, statementSearchHelpers } = require('./_shared');

test("TS_01_To_verify_the_Statement_Search_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Statement_Search/TS_01_To_verify_the_Statement_Search_module.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await statementSearchHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
