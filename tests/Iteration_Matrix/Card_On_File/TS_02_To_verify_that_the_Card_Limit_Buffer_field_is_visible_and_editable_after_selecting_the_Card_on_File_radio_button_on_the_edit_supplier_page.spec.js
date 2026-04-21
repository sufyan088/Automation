const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_02_To_verify_that_the_Card_Limit_Buffer_field_is_visible_and_editable_after_selecting_the_Card_on_File_radio_button_on_the_edit_supplier_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_02_To_verify_that_the_Card_Limit_Buffer_field_is_visible_and_editable_after_selecting_the_Card_on_File_radio_button_on_the_edit_supplier_page.ds"
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
