const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_61_To_verify_that_Contact_PhoneNumber_field_under_Advanced_Filters_popup_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_61_To_verify_that_Contact_PhoneNumber_field_under_Advanced_Filters_popup_is_functional.ds"
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
