const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPaymentsPostedHelpers } = require('./_shared');

test("TS_02_To_Verify_that_the_Year_filter_is_functional_on_the_Adjust_Filters_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payments_Posted/TS_02_To_Verify_that_the_Year_filter_is_functional_on_the_Adjust_Filters_popup.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await mgmtPaymentsPostedHelpers.runScenario(page, __filename);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
