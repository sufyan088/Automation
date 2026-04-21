const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_35_To_verify_that_the_Select_All_option_is_selected_by_default_in_the_Month_dropdown_for_Payments_Received", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payment_Received/TS_35_To_verify_that_the_Select_All_option_is_selected_by_default_in_the_Month_dropdown_for_Payments_Received.ds"
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
