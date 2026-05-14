const { test, loadRuntimeData, loginAsAdmin, closeSession, statementSearchHelpers } = require('./_shared');

test("TS_06_To_verify_that_the_Column_Views_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Statement_Search/TS_06_To_verify_that_the_Column_Views_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await statementSearchHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
