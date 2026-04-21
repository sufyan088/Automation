const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_79_To_verify_that_edit_button_is_functional_on_Support_Tickets_Dashboard_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_79_To_verify_that_edit_button_is_functional_on_Support_Tickets_Dashboard_page.ds"
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
