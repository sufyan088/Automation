const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_18_To_verify_that_Payment_File_selected_from_Runner_type_drop_down", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Onboarding/TS_18_To_verify_that_Payment_File_selected_from_Runner_type_drop_down.ds"
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
