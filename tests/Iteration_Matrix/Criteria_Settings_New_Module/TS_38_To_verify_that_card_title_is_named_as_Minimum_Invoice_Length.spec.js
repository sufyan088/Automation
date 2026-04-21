const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_38_To_verify_that_card_title_is_named_as_Minimum_Invoice_Length", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_New_Module/TS_38_To_verify_that_card_title_is_named_as_Minimum_Invoice_Length.ds"
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
