const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_39_To_verify_that_General_Support_Ticket_button_is_visible_in_portal", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_39_To_verify_that_General_Support_Ticket_button_is_visible_in_portal.ds"
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
