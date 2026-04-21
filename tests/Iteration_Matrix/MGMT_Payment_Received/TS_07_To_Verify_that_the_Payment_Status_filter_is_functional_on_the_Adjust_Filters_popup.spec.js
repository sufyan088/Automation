const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_07_To_Verify_that_the_Payment_Status_filter_is_functional_on_the_Adjust_Filters_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payment_Received/TS_07_To_Verify_that_the_Payment_Status_filter_is_functional_on_the_Adjust_Filters_popup.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
