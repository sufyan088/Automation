const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_82_To_verify_that_Delete_button_is_functional_on_Edit_Support_Ticket_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_82_To_verify_that_Delete_button_is_functional_on_Edit_Support_Ticket_page.ds"
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
