const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPaymentsPostedHelpers } = require('./_shared');

test("TS_07_To_Verify_that_the_Show_Trendline_checkbox_is_functional_on_the_MIS_Payments_Posted_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payments_Posted/TS_07_To_Verify_that_the_Show_Trendline_checkbox_is_functional_on_the_MIS_Payments_Posted_page.ds"
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
