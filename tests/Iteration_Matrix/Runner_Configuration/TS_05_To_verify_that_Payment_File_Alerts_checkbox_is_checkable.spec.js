const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_05_To_verify_that_Payment_File_Alerts_checkbox_is_checkable", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Runner_Configuration/TS_05_To_verify_that_Payment_File_Alerts_checkbox_is_checkable.ds"
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
