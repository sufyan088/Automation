const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_43_To_verify_that_user_can_select_more_than_one_status_from_Invoice_Status_dropdown_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Dashboard/TS_43_To_verify_that_user_can_select_more_than_one_status_from_Invoice_Status_dropdown_field.ds"
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
