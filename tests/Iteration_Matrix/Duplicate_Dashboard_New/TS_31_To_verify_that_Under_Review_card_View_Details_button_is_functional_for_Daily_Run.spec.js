const { test, loadRuntimeData, loginAsAdmin, closeSession, duplicateDashboardNewHelpers } = require('./_shared');

test("TS_31_To_verify_that_Under_Review_card_View_Details_button_is_functional_for_Daily_Run", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New/TS_31_To_verify_that_Under_Review_card_View_Details_button_is_functional_for_Daily_Run.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await duplicateDashboardNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
