const { test, loadRuntimeData, loginAsAdmin, closeSession, invoiceTrackerModuleHelpers } = require('./_shared');

test("TS_96_To_verify_that_Payment_Method_filter_should_be_Dropdown_with_multi_select_capability", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_Module/TS_96_To_verify_that_Payment_Method_filter_should_be_Dropdown_with_multi_select_capability.ds"
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
