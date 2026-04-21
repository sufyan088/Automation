const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_43_To_verify_under_Dashboard_tab_tickets_should_only_display_that_is_raised_against_that_Customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_43_To_verify_under_Dashboard_tab_tickets_should_only_display_that_is_raised_against_that_Customer.ds"
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
