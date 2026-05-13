const { test, loadRuntimeData, loginAsAdmin, closeSession, invoiceTrackerHelpers } = require('./_shared');

test("TS_23_To_verify_that_Delete_All_Button_In_Saved_Searches_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker/TS_23_To_verify_that_Delete_All_Button_In_Saved_Searches_field_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await invoiceTrackerHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
