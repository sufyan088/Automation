const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_20_To verify_that_the_Card_Limit_Buffer_and_Card_Limit_Amount_fields_are_enabled_and_editable_when_the_Flag_Reset_button_is_clicked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_20_To verify_that_the_Card_Limit_Buffer_and_Card_Limit_Amount_fields_are_enabled_and_editable_when_the_Flag_Reset_button_is_clicked.ds"
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
