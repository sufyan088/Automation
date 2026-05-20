const { test, loadRuntimeData, loginAsAdmin, closeSession, invoiceTrackerModuleHelpers } = require('./_shared');

test("TS_91_To_verify_that_New_Filter_Payment_Method_is_visible_in_Advanced_Search_pop_up", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_Module/TS_91_To_verify_that_New_Filter_Payment_Method_is_visible_in_Advanced_Search_pop_up.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await invoiceTrackerModuleHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
