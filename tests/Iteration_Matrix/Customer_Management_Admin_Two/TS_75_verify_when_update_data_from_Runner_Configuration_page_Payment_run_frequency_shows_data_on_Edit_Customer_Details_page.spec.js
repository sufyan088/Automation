const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_75_verify_when_update_data_from_Runner_Configuration_page_Payment_run_frequency_shows_data_on_Edit_Customer_Details_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_75_verify_when_update_data_from_Runner_Configuration_page_Payment_run_frequency_shows_data_on_Edit_Customer_Details_page.ds"
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
